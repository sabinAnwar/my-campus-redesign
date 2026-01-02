import React from "react";

export const SimpleMarkdown = ({ text }: { text: string }) => {
  const renderMarkdown = (input: string) => {
    const lines = input.split("\n");

    return lines.map((line, lineIndex) => {
      let processed: (string | React.JSX.Element)[] = [line];

      // Bold: **text**
      processed = processed.flatMap((part, i) => {
        if (typeof part !== "string") return part;
        const segments: (string | React.JSX.Element)[] = [];
        const regex = /\*\*(.+?)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(part)) !== null) {
          if (match.index > lastIndex) {
            segments.push(part.slice(lastIndex, match.index));
          }
          segments.push(
            <strong
              key={`bold-${lineIndex}-${i}-${match.index}`}
              className="font-bold text-iu-blue"
            >
              {match[1]}
            </strong>
          );
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < part.length) {
          segments.push(part.slice(lastIndex));
        }

        return segments.length > 0 ? segments : [part];
      });

      const isBullet =
        line.trim().startsWith("- ") || line.trim().startsWith("• ");
      const isNumbered = /^\d+\.\s/.test(line.trim());
      const isEmoji =
        /^[📅📝🔄📊🏥📆🎯📄📚📧📖🏫🪪💰🌍📞🧠👋✅❌⚠️💡🎥🗂️💪💰💵]/.test(
          line.trim()
        );

      if (isBullet) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-iu-blue font-bold">•</span>
            <span className="font-bold">
              {processed.map((p) =>
                typeof p === "string" ? p.replace(/^[-•]\s*/, "") : p
              )}
            </span>
          </div>
        );
      }

      if (isNumbered) {
        const num = line.trim().match(/^(\d+)\./)?.[1];
        return (
          <div key={lineIndex} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-iu-blue font-bold">{num}.</span>
            <span className="font-bold">
              {processed.map((p) =>
                typeof p === "string" ? p.replace(/^\d+\.\s*/, "") : p
              )}
            </span>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={lineIndex} className="h-2" />;
      }

      return (
        <div
          key={lineIndex}
          className={isEmoji ? "mt-3 first:mt-0 font-bold" : "font-bold"}
        >
          {processed}
        </div>
      );
    });
  };

  return <div className="space-y-0.5">{renderMarkdown(text)}</div>;
};
