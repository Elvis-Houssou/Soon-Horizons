type LogoMarkProps = {
  size?: number;
  /** Couleur des fentes : doit être celle du fond sur lequel le logo est posé. */
  cut?: string;
  className?: string;
};

/** Symbole Soon Horizons : un soleil qui se lève derrière l'horizon, coupé de lignes. */
export function LogoMark({ size = 36, cut = "var(--bg)", className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false" className={className}>
      <path d="M10 38 A22 22 0 0 1 54 38 Z" fill="var(--accent)" />
      <rect x="8" y="25.5" width="48" height="2.6" fill={cut} />
      <rect x="8" y="31.5" width="48" height="2.6" fill={cut} />
      <rect x="4" y="41" width="56" height="2.4" fill="currentColor" />
      <rect x="14" y="47.5" width="36" height="1.8" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display tracking-[0.06em] ${className}`}>
      <span className="font-bold">SOON</span> <span className="font-medium">HORIZONS</span>
    </span>
  );
}

export function Logo({ cut }: { cut?: string }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark cut={cut} />
      <Wordmark className="text-lg" />
    </span>
  );
}
