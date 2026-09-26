// Geometría medida sobre references/eye-sheikah-reference.jpeg (centro del emblema → 100,100; anillo r=84).
export function SheikahEmblemIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M52,31 A84 84 0 0 0 20,132 L39.5,127 L55,143.5 L76.5,158 L72,171" />
        <path d="M55,143.5 L49,152" />
        <path d="M134,22 A84 84 0 0 1 134.7,178.6 L124,158 L138,152" />
        <path d="M24,101 L40,101" />
        <path d="M160,101 L176,101" />
      </g>

      <g stroke="currentColor" strokeWidth="2.5">
        <circle cx="66" cy="22" r="6.5" />
        <circle cx="134" cy="22" r="6.5" />
        <circle cx="16.5" cy="101" r="7.5" />
        <circle cx="183.5" cy="101" r="7.5" />
        <circle cx="66.5" cy="177.5" r="6" />
        <circle cx="39.5" cy="161" r="4" />
        <circle cx="142.5" cy="145" r="5" />
      </g>
      <g fill="currentColor">
        <circle cx="66" cy="22" r="3" />
        <circle cx="134" cy="22" r="3" />
        <circle cx="16.5" cy="101" r="3.5" />
        <circle cx="183.5" cy="101" r="3.5" />
        <circle cx="66.5" cy="177.5" r="2.8" />
        <circle cx="39.5" cy="161" r="1.8" />
        <circle cx="142.5" cy="145" r="2.2" />
      </g>

      <g fill="currentColor">
        <polygon points="100,46 91,66 109,66" />
        <polygon points="61,59 78,70.5 62,80" />
        <polygon points="139,59 122,70.5 138,80" />
      </g>

      <path
        d="M48.5,87 C47,93 51,97 57,94 C74,74 126,74 143,94 C149,97 153,93 151.5,87"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M57,94 C74,130 126,130 143,94"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <path
        d="M83.6,95.6 A17 17 0 0 1 116.4,95.6 M83.6,104.4 A17 17 0 0 0 116.4,104.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="8.9" stroke="currentColor" strokeWidth="7.2" />

      <path
        d="M95,117 Q97.5,120 97.5,128 C97.5,140 92,150 92,162 C92,171 96,176 100,176 C104,176 108,171 108,162 C108,150 102.5,140 102.5,128 Q102.5,120 105,117 Z"
        fill="currentColor"
      />
    </svg>
  );
}
