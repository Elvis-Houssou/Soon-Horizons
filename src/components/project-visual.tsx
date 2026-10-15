import type { VisualKind } from "@/content/projects";

const sky = "var(--img-sky)";
const ground = "var(--img-ground)";
const b1 = "var(--img-b1)";
const b2 = "var(--img-b2)";
const stroke = "var(--img-stroke)";
const line = "var(--img-line)";
const accent = "var(--accent)";

const HORIZON = 360;

/** Fentes horizontales qui découpent le soleil, comme dans le logo. */
function Sun({ cx, r, opacity = 0.9 }: { cx: number; r: number; opacity?: number }) {
  const top = HORIZON - r;
  return (
    // .pv-sun : le soleil se lève au survol d'une carte (voir globals.css).
    <g className="pv-sun">
      <circle cx={cx} cy={HORIZON} r={r} fill={accent} opacity={opacity} />
      <rect x={cx - r} y={top + r * 0.42} width={r * 2} height={5} fill={sky} />
      <rect x={cx - r} y={top + r * 0.62} width={r * 2} height={5} fill={sky} />
    </g>
  );
}

function Ground({ reflection = true }: { reflection?: boolean }) {
  return (
    <>
      <rect x="0" y={HORIZON} width="800" height={500 - HORIZON} fill={ground} />
      <line x1="0" y1={HORIZON} x2="800" y2={HORIZON} stroke={line} strokeOpacity="0.45" strokeWidth="1.5" />
      {reflection && (
        <>
          <rect x="260" y={HORIZON + 22} width="320" height="3" fill={accent} opacity="0.35" />
          <rect x="320" y={HORIZON + 44} width="200" height="3" fill={accent} opacity="0.2" />
        </>
      )}
    </>
  );
}

function Scene({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "villa":
      return (
        <>
          <Sun cx={540} r={170} />
          <Ground />
          <rect x="180" y="270" width="460" height="90" fill={b1} stroke={stroke} />
          <rect x="120" y="205" width="420" height="65" fill={b2} stroke={stroke} />
          <rect x="150" y="222" width="360" height="30" fill={accent} opacity="0.25" />
          <rect x="250" y="292" width="240" height="52" fill={accent} opacity="0.12" />
        </>
      );
    case "tower":
      return (
        <>
          <Sun cx={220} r={130} opacity={0.6} />
          <Ground reflection={false} />
          <rect x="330" y="50" width="170" height="310" fill={b1} stroke={stroke} />
          <rect x="500" y="170" width="80" height="190" fill={b2} stroke={stroke} />
          {[80, 115, 150, 185, 220, 255, 290, 325].map((y, i) => (
            <rect key={y} x="344" y={y} width="142" height="3" fill={i === 0 ? accent : stroke} />
          ))}
        </>
      );
    case "pavilion":
      return (
        <>
          <Ground />
          <path d={`M180 ${HORIZON} A220 220 0 0 1 620 ${HORIZON} Z`} fill={b1} stroke={stroke} />
          <path d={`M260 ${HORIZON} A140 140 0 0 1 540 ${HORIZON} Z`} fill={accent} opacity="0.3" />
          <line x1="400" y1="140" x2="400" y2={HORIZON} stroke={stroke} />
          <line x1="300" y1="175" x2="330" y2={HORIZON} stroke={stroke} />
          <line x1="500" y1="175" x2="470" y2={HORIZON} stroke={stroke} />
        </>
      );
    case "resort":
      return (
        <>
          <Sun cx={620} r={140} opacity={0.8} />
          <Ground />
          <rect x="60" y="290" width="600" height="70" fill={b1} stroke={stroke} />
          <rect x="110" y="240" width="420" height="50" fill={b2} stroke={stroke} />
          <rect x="170" y="200" width="240" height="40" fill={b1} stroke={stroke} />
          {[130, 210, 290, 370, 450].map((x) => (
            <rect key={x} x={x} y="300" width="56" height="24" fill={accent} opacity="0.2" />
          ))}
        </>
      );
    case "office":
      return (
        <>
          <Sun cx={640} r={100} opacity={0.6} />
          <Ground reflection={false} />
          <rect x="250" y="40" width="160" height="320" fill={b1} stroke={stroke} />
          <rect x="410" y="120" width="130" height="240" fill={b2} stroke={stroke} />
          {[270, 290, 310, 330, 350, 370, 390].map((x) => (
            <line key={x} x1={x} y1="56" x2={x} y2={HORIZON} stroke={stroke} />
          ))}
          <rect x="250" y="40" width="160" height="6" fill={accent} opacity="0.7" />
        </>
      );
    case "house":
      return (
        <>
          <Sun cx={170} r={120} opacity={0.7} />
          <Ground />
          <rect x="300" y="260" width="300" height="100" fill={b1} stroke={stroke} />
          <polygon points="290,262 450,185 610,262" fill={b2} stroke={stroke} />
          {[330, 410, 490].map((x) => (
            <rect key={x} x={x} y="290" width="40" height="50" fill={accent} opacity="0.22" />
          ))}
          <rect x="600" y="300" width="120" height="60" fill={b2} stroke={stroke} />
        </>
      );
    case "interior":
      return (
        <>
          <rect width="800" height="500" fill={b1} />
          <rect x="80" y="70" width="640" height="300" fill={accent} opacity="0.18" />
          <line x1="293" y1="70" x2="293" y2="370" stroke={stroke} strokeWidth="5" />
          <line x1="507" y1="70" x2="507" y2="370" stroke={stroke} strokeWidth="5" />
          <rect x="0" y="370" width="800" height="130" fill={ground} />
          <rect x="170" y="335" width="320" height="64" rx="6" fill={stroke} />
          <rect x="540" y="320" width="120" height="80" rx="4" fill={b2} stroke={stroke} />
        </>
      );
    case "aerial":
      return (
        <>
          <rect width="800" height="500" fill={sky} />
          <rect x="0" y="330" width="800" height="170" fill={accent} opacity="0.15" />
          <rect x="160" y="110" width="400" height="170" fill={b2} stroke={stroke} />
          <rect x="280" y="200" width="400" height="110" fill={b1} stroke={stroke} />
          <rect x="200" y="290" width="240" height="50" fill={accent} opacity="0.4" />
          <rect x="500" y="330" width="22" height="120" fill={stroke} />
        </>
      );
  }
}

type ProjectVisualProps = {
  kind: VisualKind;
  /** Texte alternatif. Sans libellé, l'illustration est décorative (masquée aux lecteurs d'écran). */
  label?: string;
  className?: string;
  /** Cadrage quand l'image est recadrée : "end" pousse la scène à droite (place pour un titre). */
  align?: "center" | "end";
};

/**
 * Illustration provisoire d'un projet, qui suit le thème clair/sombre.
 * À remplacer par next/image quand les vrais rendus seront disponibles.
 */
export function ProjectVisual({ kind, label, className = "", align = "center" }: ProjectVisualProps) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio={align === "end" ? "xMaxYMid slice" : "xMidYMid slice"}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={`block h-full w-full ${className}`}
    >
      <rect width="800" height="500" fill={sky} />
      <Scene kind={kind} />
    </svg>
  );
}
