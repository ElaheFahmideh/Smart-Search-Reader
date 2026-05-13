type THighlightedText = {
  parts: string[];
  debouncedQuery: string;
  matchIndex: number;
  activeIndex: number;
};

function HighlightedText({
  parts,
  debouncedQuery,
  matchIndex,
  activeIndex,
}: THighlightedText) {
  return (
    <div className="text__wrapper">
      {parts.map((part: string, index: number) => {
        const isMatch =
          debouncedQuery && part.toLowerCase() === debouncedQuery.toLowerCase();

        if (isMatch) {
          matchIndex++;
          const isActive = matchIndex === activeIndex;
          return (
            <mark
              key={`part-${index}`}
              id={`match-mark-${matchIndex}`}
              className={isActive ? "match-mark-active" : ""}
            >
              {part}
            </mark>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}

export default HighlightedText;
