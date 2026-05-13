import { useEffect, useMemo, useState } from "react";
import { escapeRegExp } from "@utils";
import { useDebounce } from "@hooks/useDebounce";
import SearchInput from "./searchInput";
import SuggestionList from "./suggestionList";
import SearchResult from "./searchResult";
import HighlightedText from "./highlightedText";
import article from "@/assets/data/article.txt?raw";
import "./index.css";

export default function SmartSearch() {
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const debouncedQuery = useDebounce<string>(query, 3000);

  const SUGGESTION_WORDS = Array.from(
    new Set(
      article
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/),
    ),
  );

  const parts = useMemo(() => {
    if (!debouncedQuery) return [article];

    const regex = new RegExp(`(${escapeRegExp(debouncedQuery)})`, "gi");
    return article.split(regex);
  }, [article, debouncedQuery]);

  const matchesCount = useMemo(() => {
    if (!debouncedQuery) return 0;

    return parts.filter(
      (part) => part.toLowerCase() === debouncedQuery.toLowerCase(),
    ).length;
  }, [parts, debouncedQuery]);

  const suggestions = useMemo(() => {
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

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

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
        <SearchResult
          matchesCount={matchesCount}
          activeIndex={activeIndex}
          goPrev={goPrev}
          goNext={goNext}
        />
      )}

      <HighlightedText
        parts={parts}
        debouncedQuery={debouncedQuery}
        matchIndex={matchIndex}
        activeIndex={activeIndex}
      />
    </div>
  );
}
