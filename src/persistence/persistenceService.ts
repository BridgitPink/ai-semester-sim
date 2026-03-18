import { GAME_SAVE_VERSION, migrateGameSavePayload, type GameSavePayload } from "./saveSchema";
import { getBrowserSupabaseClient, hasSupabaseBrowserConfig } from "./supabaseClient";

const GAME_SAVE_ENDPOINT = "/api/game-save";
const LOCAL_CACHE_KEY = "aiSemesterSim:saveCache:v1";

type PersistenceLogLevel = "warn" | "error";

function log(level: PersistenceLogLevel, message: string, details?: unknown) {
  if (!import.meta.env.DEV) {
    return;
  }

  if (details !== undefined) {
    console[level](`[persistence] ${message}`, details);
    return;
  }

  console[level](`[persistence] ${message}`);
}

function readLocalCache(): GameSavePayload | null {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateGameSavePayload(parsed);
    if (!migrated.ok) {
      log("warn", "Local save cache is invalid and will be ignored.", migrated);
      return null;
    }

    return migrated.payload;
  } catch (error) {
    log("warn", "Failed to read local cache.", error);
    return null;
  }
}

function writeLocalCache(payload: GameSavePayload) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    log("warn", "Failed to write local cache.", error);
  }
}

export function clearLocalSaveCache() {
  try {
    localStorage.removeItem(LOCAL_CACHE_KEY);
  } catch (error) {
    log("warn", "Failed to clear local cache.", error);
  }
}

async function getAccessToken(): Promise<string | null> {
  if (!hasSupabaseBrowserConfig()) {
    log("warn", "Supabase browser config is missing; persistence disabled.");
    return null;
  }

  const client = getBrowserSupabaseClient();
  if (!client) {
    return null;
  }

  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) {
    log("error", "Failed to resolve existing auth session.", sessionError);
    return null;
  }

  if (sessionData.session) {
    return sessionData.session.access_token;
  }

  const anonymousResult = await client.auth.signInAnonymously();
  if (anonymousResult.error || !anonymousResult.data.session) {
    log("warn", "Anonymous sign-in unavailable; continuing without server persistence.", anonymousResult.error);
    return null;
  }

  return anonymousResult.data.session.access_token;
}

async function authenticatedRequest(method: "GET" | "PUT" | "DELETE", payload?: GameSavePayload) {
  const token = await getAccessToken();
  if (!token) {
    return { ok: false, status: 401, body: null as unknown };
  }

  const response = await fetch(GAME_SAVE_ENDPOINT, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify({ payload }) : undefined,
  });

  const body = (await response.json().catch(() => null)) as unknown;
  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

export async function loadGameFromServer(): Promise<GameSavePayload | null> {
  try {
    const response = await authenticatedRequest("GET");
    if (!response.ok) {
      log("warn", `GET ${GAME_SAVE_ENDPOINT} failed with status ${response.status}; trying local cache.`);
      return readLocalCache();
    }

    const save = (response.body as { save?: unknown } | null)?.save;
    if (!save) {
      return null;
    }

    const migrated = migrateGameSavePayload(save);
    if (!migrated.ok) {
      log("warn", "Server save payload is invalid and will be ignored.", migrated);
      return readLocalCache();
    }

    writeLocalCache(migrated.payload);
    return migrated.payload;
  } catch (error) {
    log("warn", "Network failure while loading game save; trying local cache.", error);
    return readLocalCache();
  }
}

export async function saveGameToServer(payload: GameSavePayload): Promise<boolean> {
  if (payload.version !== GAME_SAVE_VERSION) {
    log("warn", "Refusing to save payload with unsupported version.", payload.version);
    return false;
  }

  // Always keep a local resilience snapshot, even if remote persistence is unavailable.
  writeLocalCache(payload);

  try {
    const response = await authenticatedRequest("PUT", payload);
    if (!response.ok) {
      log("warn", `PUT ${GAME_SAVE_ENDPOINT} failed with status ${response.status}.`, response.body);
      return false;
    }

    return true;
  } catch (error) {
    log("warn", "Network failure while saving game state.", error);
    return false;
  }
}

export async function resetGameOnServer(): Promise<boolean> {
  try {
    const response = await authenticatedRequest("DELETE");
    clearLocalSaveCache();
    if (!response.ok) {
      log("warn", `DELETE ${GAME_SAVE_ENDPOINT} failed with status ${response.status}.`, response.body);
      return false;
    }

    return true;
  } catch (error) {
    clearLocalSaveCache();
    log("warn", "Network failure while resetting save on server.", error);
    return false;
  }
}
