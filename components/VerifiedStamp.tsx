// The hand-stamped "verified" seal is SewaLink's signature motif: it echoes
// the ink stamps used on Nepali citizenship documents and ward recommendation
// letters — the exact paperwork our verification flow is built on.

export function StampFilterDefs() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <filter id="stampWobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export function VerifiedStamp({
  size = 72,
  className = "",
  label = "VERIFIED",
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`stamp-wobble ${className}`}
      role="img"
      aria-label="Verified professional"
    >
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path
        id={`stampCirclePath-${label}`}
        d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
        fill="none"
      />
      <text fontSize="9.5" letterSpacing="2.5" fontFamily="var(--font-sora)" fontWeight="700" fill="currentColor">
        <textPath href={`#stampCirclePath-${label}`} startOffset="2%">
          {label} • SEWALINK • {label} •
        </textPath>
      </text>
      <path
        d="M35 51 L45 61 L67 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
