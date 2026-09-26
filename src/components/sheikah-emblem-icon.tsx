export function SheikahEmblemIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* anillo segmentado */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {/* arcos superiores */}
        <path d="M60,46 Q22,68 28,108" />
        <path d="M140,46 Q178,68 172,108" />
        {/* arco derecho descendente */}
        <path d="M172,108 Q179,127 160,142" />
        {/* arco izquierdo largo, de curva a trazo recto */}
        <path d="M28,108 Q20,138 40,150 L40,160 L54,160" />
        {/* trazos colgantes tipo circuito */}
        <path d="M160,142 L173,142 L173,153" />
        <path d="M54,160 L40,172" />
        <path d="M66,163 L66,175" />
      </g>

      {/* nodos huecos */}
      <circle cx="60" cy="46" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="140" cy="46" r="5" stroke="currentColor" strokeWidth="2" />
      {/* nodos sólidos */}
      <circle cx="28" cy="108" r="4.5" fill="currentColor" />
      <circle cx="172" cy="108" r="4.5" fill="currentColor" />
      <circle cx="160" cy="142" r="4.5" fill="currentColor" />
      <circle cx="54" cy="160" r="4.5" fill="currentColor" />
      <circle cx="66" cy="163" r="3.5" fill="currentColor" />

      {/* pestañas */}
      <polygon points="100,36 92,60 108,60" fill="currentColor" />
      <polygon points="78,46 70,64 87,63" fill="currentColor" />
      <polygon points="122,46 113,63 130,64" fill="currentColor" />
      <polygon points="60,57 53,70 70,70" fill="currentColor" />
      <polygon points="140,57 130,70 147,70" fill="currentColor" />

      {/* ojo, con ganchos curvos en las esquinas */}
      <path
        d="M58,95 Q100,58 142,95 Q100,118 58,95 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M58,95 C50,98 47,105 53,110"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M142,95 C150,98 153,105 147,110"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* iris con hueco visible */}
      <circle cx="100" cy="95" r="16" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="100" cy="95" r="6" fill="currentColor" />

      {/* lágrima alargada */}
      <path
        d="M91,109 C88,127 94,146 100,154 C106,146 112,127 109,109 Z"
        fill="currentColor"
      />
    </svg>
  );
}
