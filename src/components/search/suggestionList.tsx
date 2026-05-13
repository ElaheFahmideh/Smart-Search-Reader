type TSuggestionList = {
  suggestions: string[];
  handleChooseSuggestion: (arg: string) => void;
};

function SuggestionList({
  suggestions,
  handleChooseSuggestion,
}: TSuggestionList) {
  return (
    <ul className="search__suggestions-list">
      {suggestions.map((suggestion: string, index: number) => (
        <li
          key={`${suggestion}-${index}`}
          onClick={() => handleChooseSuggestion(suggestion)}
          className="search__suggestions-item"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
}

export default SuggestionList;
