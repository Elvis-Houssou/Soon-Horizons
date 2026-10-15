type PlanDrawingProps = {
  kind: "plan" | "section";
  label: string;
};

const ink = "#0b0b0c";
const paper = "#fbf9f5";

/** Plan ou coupe provisoire, toujours sur fond papier, filigrané au nom de la marque. */
export function PlanDrawing({ kind, label }: PlanDrawingProps) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="block h-full w-full select-none">
      <rect width="400" height="300" fill={paper} />
      {kind === "plan" ? (
        <>
          <g fill="none" stroke={ink} strokeWidth="3">
            <rect x="50" y="50" width="300" height="190" />
            <line x1="200" y1="50" x2="200" y2="150" />
            <line x1="50" y1="150" x2="150" y2="150" />
            <line x1="250" y1="150" x2="350" y2="150" />
            <line x1="270" y1="50" x2="270" y2="150" />
          </g>
          <g fill="none" stroke={ink} strokeWidth="1">
            <path d="M150 150 A30 30 0 0 1 180 180" />
            <rect x="70" y="250" width="200" height="30" strokeDasharray="4 3" />
          </g>
        </>
      ) : (
        <>
          <g fill="none" stroke={ink} strokeWidth="3">
            <line x1="30" y1="230" x2="370" y2="230" />
            <rect x="90" y="160" width="230" height="70" />
            <rect x="60" y="100" width="200" height="60" />
          </g>
          <g fill="none" stroke={ink} strokeWidth="1" strokeDasharray="4 3">
            <line x1="30" y1="160" x2="370" y2="160" />
            <line x1="30" y1="100" x2="370" y2="100" />
          </g>
          <g fontFamily="var(--font-mono)" fontSize="10" fill="#3d3a35">
            <text x="330" y="96">+6.40</text>
            <text x="330" y="156">+3.20</text>
            <text x="330" y="226">±0.00</text>
          </g>
        </>
      )}
      <text
        x="200"
        y="170"
        textAnchor="middle"
        transform="rotate(-24 200 150)"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="34"
        fill={ink}
        opacity="0.08"
        letterSpacing="4"
      >
        SOON HORIZONS
      </text>
    </svg>
  );
}
