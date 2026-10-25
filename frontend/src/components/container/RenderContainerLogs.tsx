interface ContainerLogsProps {
  rawLogs: string | undefined;
}

export function ContainerLogs({ rawLogs }: ContainerLogsProps) {
  if (!rawLogs) {
    return (
      <span className="text-gray-500">
        No output generated yet...
      </span>
    );
  }

  return (
    <>
      {rawLogs.split("\n").map((line, index) => {
        const lower = line.toLowerCase();

        const isError =
          lower.includes("error") ||
          lower.includes("err") ||
          lower.includes("fail") ||
          lower.includes("exception");

        return (
          <div
            key={`${index}-${line}`}
            className={`py-0.5 px-2 hover:bg-white/5 rounded font-mono text-xs whitespace-pre-wrap break-all ${
              isError
                ? "text-rose-400 bg-rose-500/10 border-l-2 border-rose-500 pl-3"
                : "text-emerald-200"
            }`}
          >
            {line}
          </div>
        );
      })}
    </>
  );
}