import type { ReactNode } from "react";
export function StatCard({ value, label }: { value: string; label: string }) {
  return (<div className="wb-stat-card"><span className="wb-stat-card-value">{value}</span><span className="wb-stat-card-label">{label}</span></div>);
}
export function StatStrip({ children }: { children: ReactNode }) {
  return <div className="wb-stat-strip">{children}</div>;
}
