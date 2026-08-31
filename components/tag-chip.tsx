export function TagChip({ label, color = "default" }: { label: string; color?: "default" | "teal" | "purple" | "green" }) {
  return <span className={`wb-tag-chip wb-tag-chip--${color}`}>{label}</span>;
}
