import { useEffect, useMemo, useState } from "react";
import type { VideoBlock } from "../../game/types/course";
import { getSafeVideoEmbedUrl } from "../../game/systems/youtube";

function VideoFrame(props: { embedUrl: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setTimedOut(true), 3500);
    return () => window.clearTimeout(timeout);
  }, []);

  const showFallback = timedOut && !loaded;

  return (
    <div className="lesson-block lesson-block--video">
      {showFallback && (
        <p style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>
          Video unavailable. Continue with lesson.
        </p>
      )}

      {!showFallback && (
        <iframe
          title={props.title}
          src={props.embedUrl}
          width="100%"
          height="315"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          style={{ border: 0, borderRadius: 8 }}
        />
      )}

      <p style={{ color: "var(--color-text-secondary)", fontSize: 13, marginTop: 8 }}>
        If the video doesn’t load, continue reading—progression is not blocked.
      </p>
    </div>
  );
}

export function VideoBlockRenderer(props: { block: VideoBlock }) {
  const { embedUrl } = useMemo(() => getSafeVideoEmbedUrl(props.block.url), [props.block.url]);

  const title = typeof props.block.title === "string" && props.block.title.trim().length > 0
    ? props.block.title.trim()
    : "Lesson video";

  if (!embedUrl) {
    return (
      <div className="lesson-block lesson-block--video">
        <p style={{ color: "var(--color-text-secondary)" }}>
          Video unavailable. Continue with lesson.
        </p>
      </div>
    );
  }

  // Keyed child component resets load/timeout state when URL changes.
  return <VideoFrame key={embedUrl} embedUrl={embedUrl} title={title} />;
}
