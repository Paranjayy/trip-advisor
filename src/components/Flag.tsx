import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cross-platform flag rendering.
 *
 * Windows Chrome doesn't ship color emoji for regional-indicator flags, so
 * native flag emoji silently render as letters (e.g. "JP" instead of 🇯🇵).
 * We convert the emoji to its Twemoji SVG via jsdelivr — works everywhere —
 * and fall back to the native emoji if the image fails to load.
 */
function emojiToTwemojiCode(emoji: string): string | null {
  const codes: string[] = [];
  let i = 0;
  while (i < emoji.length) {
    const cp = emoji.codePointAt(i);
    if (cp === undefined) break;
    if (cp !== 0xfe0f) codes.push(cp.toString(16));
    i += cp > 0xffff ? 2 : 1;
  }
  return codes.length ? codes.join("-") : null;
}

export function Flag({
  emoji,
  size = 24,
  className,
  rounded = true,
}: {
  emoji: string;
  size?: number;
  className?: string;
  rounded?: boolean;
}) {
  const code = emojiToTwemojiCode(emoji);
  const [errored, setErrored] = useState(false);

  // Fallback for Windows Chrome where native flags are just letters
  if (!code || errored) {
    return (
      <span
        className={cn("inline-block font-mono font-bold leading-none select-none", className)}
        style={{ fontSize: size * 0.8 }}
        title={emoji}
        aria-label={emoji}
      >
        {emoji}
      </span>
    );
  }

  const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`;
  return (
    <div 
      className={cn("inline-flex items-center justify-center shrink-0 overflow-hidden bg-muted/20", rounded && "rounded-[4px]", className)}
      style={{ width: size, height: Math.round(size * 0.72) }}
      title={emoji}
    >
      <img
        src={url}
        width={size}
        height={Math.round(size * 0.72)}
        alt={emoji}
        onError={() => setErrored(true)}
        className="block w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
