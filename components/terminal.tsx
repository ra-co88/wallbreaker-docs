interface TerminalLine { prompt?: string; cmd?: string; comment?: string; }
export function Terminal({ lines }: { lines: TerminalLine[] }) {
  return (<div className="wb-terminal">{lines.map((line, i) => (<span className="wb-terminal-line" key={i}>{line.prompt && <span className="wb-terminal-prompt">{line.prompt}</span>}{line.cmd && <span className="wb-terminal-cmd">{line.cmd}</span>}{line.comment && <span className="wb-terminal-comment">{line.comment}</span>}</span>))}</div>);
}
