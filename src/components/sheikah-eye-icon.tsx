export function SheikahEyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        d="M5,50 Q50,10 95,50 Q50,90 5,50 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <path
        d="M50,64 Q58,80 50,92 Q42,80 50,64 Z"
        fill="currentColor"
      />
    </svg>
  );
}
