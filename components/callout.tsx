import type { ReactNode } from "react";
type CalloutType = "info" | "warning" | "danger";
const labels: Record<CalloutType, string> = { info: "Info", warning: "Warning", danger: "Danger" };
export function Callout({ type = "info", children }: { type?: CalloutType; children: ReactNode }) {
  return (<div className={`wb-callout wb-callout--${type}`}><span className="wb-callout-label">{labels[type]}</span>{children}</div>);
}
