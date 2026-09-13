type AkhWordmarkProps = {
  className?: string;
};

export function AkhWordmark({ className = "" }: AkhWordmarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 164 54"
      role="img"
      aria-label="AKH"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>AKH</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3"
      >
        <path d="M4 46 26 8l22 38M14 30h24" />
        <path d="M62 8v38M64 28 91 8M64 28l29 18" />
        <path d="M108 10v36M146 10v36M109 28h37M134 4h16" />
      </g>
    </svg>
  );
}
