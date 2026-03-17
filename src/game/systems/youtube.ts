type SafeEmbedResult =
  | { embedUrl: string; reason?: undefined }
  | { embedUrl: null; reason: string };

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

function safeParseUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

function getYouTubeVideoId(url: URL): string | null {
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.replace(/^\//, "").split("/")[0];
    return id || null;
  }

  // youtube.com
  const path = url.pathname;

  if (path === "/watch") {
    const id = url.searchParams.get("v");
    return id || null;
  }

  // /embed/{id}
  if (path.startsWith("/embed/")) {
    const id = path.replace("/embed/", "").split("/")[0];
    return id || null;
  }

  // /shorts/{id}
  if (path.startsWith("/shorts/")) {
    const id = path.replace("/shorts/", "").split("/")[0];
    return id || null;
  }

  return null;
}

export function isValidYouTubeUrl(input: string): boolean {
  if (typeof input !== "string" || input.trim().length === 0) return false;

  const url = safeParseUrl(input.trim());
  if (!url) return false;

  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return false;

  return getYouTubeVideoId(url) !== null;
}

export function normalizeYouTubeEmbedUrl(input: string): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;

  const url = safeParseUrl(trimmed);
  if (!url) return null;

  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;

  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  // Optional start time support: t=, start=
  const t = url.searchParams.get("t") ?? url.searchParams.get("start");
  const startSeconds = t ? parseStartSeconds(t) : null;

  const embed = new URL(`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`);
  if (startSeconds !== null) embed.searchParams.set("start", String(startSeconds));

  return embed.toString();
}

function parseStartSeconds(value: string): number | null {
  // Accept raw seconds ("90") or youtube style ("1m30s")
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  const match = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return null;

  const hours = match[1] ? Number(match[1]) : 0;
  const minutes = match[2] ? Number(match[2]) : 0;
  const seconds = match[3] ? Number(match[3]) : 0;

  const total = hours * 3600 + minutes * 60 + seconds;
  return Number.isFinite(total) && total > 0 ? total : null;
}

export function getSafeVideoEmbedUrl(input?: string): SafeEmbedResult {
  if (typeof input !== "string" || input.trim().length === 0) {
    return { embedUrl: null, reason: "missing-url" };
  }

  const embedUrl = normalizeYouTubeEmbedUrl(input);
  if (!embedUrl) {
    return { embedUrl: null, reason: "invalid-youtube-url" };
  }

  return { embedUrl };
}
