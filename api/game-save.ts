import { createClient } from "@supabase/supabase-js";
import { migrateGameSavePayload, toStoredSaveRecord } from "../src/persistence/saveSchema";

type ApiRequest = {
  method?: string;
  headers: Record<string, string | undefined>;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

function getServerSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return null;
  }

  return { url, anonKey, serviceRoleKey };
}

function devLog(message: string, details?: unknown) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (details !== undefined) {
    console.warn(`[api/game-save] ${message}`, details);
    return;
  }

  console.warn(`[api/game-save] ${message}`);
}

function parseBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

async function getAuthenticatedUser(request: ApiRequest) {
  const config = getServerSupabaseConfig();
  if (!config) {
    return { ok: false as const, status: 500, body: { error: "server_misconfigured" } };
  }

  const token = parseBearerToken(request.headers.authorization);
  if (!token) {
    return { ok: false as const, status: 401, body: { error: "unauthorized" } };
  }

  const authClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const authResult = await authClient.auth.getUser(token);
  if (authResult.error || !authResult.data.user) {
    devLog("Failed to validate auth token.", authResult.error);
    return { ok: false as const, status: 401, body: { error: "unauthorized" } };
  }

  const dbClient = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return {
    ok: true as const,
    user: authResult.data.user,
    dbClient,
  };
}

function noStore(response: ApiResponse) {
  response.setHeader("Cache-Control", "no-store");
}

function parseRequestBody(rawBody: unknown): unknown {
  if (!rawBody) return null;

  if (typeof rawBody === "string") {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }

  return rawBody;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  noStore(response);

  if (!["GET", "PUT", "DELETE"].includes(request.method ?? "")) {
    response.setHeader("Allow", "GET,PUT,DELETE");
    return response.status(405).json({ error: "method_not_allowed" });
  }

  const authContext = await getAuthenticatedUser(request);
  if (!authContext.ok) {
    return response.status(authContext.status).json(authContext.body);
  }

  const { dbClient, user } = authContext;

  if (request.method === "GET") {
    const queryResult = await dbClient
      .from("game_saves")
      .select("save_payload")
      .eq("user_id", user.id)
      .maybeSingle();

    if (queryResult.error) {
      devLog("Failed to load game save.", queryResult.error);
      return response.status(500).json({ error: "load_failed" });
    }

    const payload = queryResult.data?.save_payload ?? null;
    if (!payload) {
      return response.status(200).json({ save: null });
    }

    const migrated = migrateGameSavePayload(payload);
    if (!migrated.ok) {
      devLog("Stored payload is invalid.", migrated);
      return response.status(200).json({ save: null, warning: migrated.error });
    }

    return response.status(200).json({ save: migrated.payload });
  }

  if (request.method === "PUT") {
    const body = parseRequestBody(request.body) as { payload?: unknown } | null;
    const migrated = migrateGameSavePayload(body?.payload ?? null);

    if (!migrated.ok) {
      return response.status(400).json({
        error: migrated.error,
        message: migrated.message,
      });
    }

    const record = toStoredSaveRecord(migrated.payload);
    const upsertResult = await dbClient.from("game_saves").upsert(
      {
        user_id: user.id,
        save_version: record.save_version,
        save_payload: record.save_payload,
      },
      { onConflict: "user_id" }
    );

    if (upsertResult.error) {
      devLog("Failed to upsert game save.", upsertResult.error);
      return response.status(500).json({ error: "save_failed" });
    }

    return response.status(200).json({ success: true, version: record.save_version });
  }

  const deleteResult = await dbClient.from("game_saves").delete().eq("user_id", user.id);
  if (deleteResult.error) {
    devLog("Failed to delete game save.", deleteResult.error);
    return response.status(500).json({ error: "reset_failed" });
  }

  return response.status(200).json({ success: true });
}
