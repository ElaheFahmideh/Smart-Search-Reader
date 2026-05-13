import { useEffect, useMemo, useState } from "react";
import { escapeRegExp } from "@utils";
import { useDebounce } from "@hooks/useDebounce";
import "./search.css";

const TEXT: string =
  "React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier. Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier  Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier Many developers use React for web apps.React is a JavaScript library for building user interfaces. React makes UI development easier";

type TSearchInput = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
};

type TSuggestionList = {
  suggestions: string[];
  handleChooseSuggestion: (arg: string) => void;
};

type TActionButton = {
  action: () => void;
  children: string;
};

export default function SearchNavigator() {
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const debouncedQuery = useDebounce<string>(query, 3000);

  const SUGGESTION_WORDS = Array.from(
    new Set(
      TEXT.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/),
    ),
  );

  const parts = useMemo(() => {
    if (!debouncedQuery) return [TEXT];

    const regex = new RegExp(`(${escapeRegExp(debouncedQuery)})`, "gi");
    return TEXT.split(regex);
  }, [TEXT, debouncedQuery]);

  const matchesCount = useMemo(() => {
    if (!debouncedQuery) return 0;

    return parts.filter(
      (part) => part.toLowerCase() === debouncedQuery.toLowerCase(),
    ).length;
  }, [parts, debouncedQuery]);

  const suggestions = useMemo(() => {
    setActiveIndex(0);
    if (!query.trim()) return [];

    return SUGGESTION_WORDS.filter((word: string) =>
      word.includes(query.toLowerCase()),
    ).slice(0, 8);
  }, [query]);

  const goNext = () => {
    if (!matchesCount) return;
    setActiveIndex((prev) => (prev + 1) % matchesCount);
  };

  const goPrev = () => {
    if (!matchesCount) return;
    setActiveIndex((prev) => (prev - 1 + matchesCount) % matchesCount);
  };

  const handleChooseSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const activeEl = document.getElementById(`match-mark-${activeIndex}`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  let matchIndex = -1;

  return (
    <div className="container">
      <div className="search_wrapper">
        <SearchInput
          query={query}
          setQuery={setQuery}
          setShowSuggestions={setShowSuggestions}
        />

        {showSuggestions &&
          Array.isArray(suggestions) &&
          suggestions.length > 0 && (
            <SuggestionList
              suggestions={suggestions}
              handleChooseSuggestion={handleChooseSuggestion}
            />
          )}
      </div>

      {debouncedQuery && (
        <div className="search__result">
          {matchesCount > 0 ? (
            <>
              <p>{`Result ${activeIndex + 1} of ${matchesCount}`}</p>
              <div className="search__result-actions">
                <ActionButton action={goPrev}>&#8963;</ActionButton>
                <ActionButton action={goNext}>&#8964;</ActionButton>
              </div>
            </>
          ) : (
            <p>No results found. Please try different keywords</p>
          )}
        </div>
      )}

      <div className="text__wrapper">
        {parts.map((part: string, index: number) => {
          const isMatch =
            debouncedQuery &&
            part.toLowerCase() === debouncedQuery.toLowerCase();

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
    </div>
  );
}

function SearchInput({ query, setQuery, setShowSuggestions }: TSearchInput) {
  return (
    <input
      type="text"
      name="search"
      placeholder="Search anything..."
      className="search search__input"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
      }}
    />
  );
}

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

function ActionButton({ action, children }: TActionButton) {
  return <button onClick={action}>{children}</button>;
}
