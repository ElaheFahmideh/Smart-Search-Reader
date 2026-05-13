import SearchNavigator from "./searchNavigator";

type TSearchResult = {
  matchesCount: number;
  activeIndex: number;
  goPrev: () => void;
  goNext: () => void;
};

function SearchResult({
  matchesCount,
  activeIndex,
  goPrev,
  goNext,
}: TSearchResult) {
  return (
    <div className="search__result">
      {matchesCount > 0 ? (
        <>
          <p>{`Result ${activeIndex + 1} of ${matchesCount}`}</p>
          <div className="search__result-navigator">
            <SearchNavigator action={goPrev}>&#8963;</SearchNavigator>
            <SearchNavigator action={goNext}>&#8964;</SearchNavigator>
          </div>
        </>
      ) : (
        <p>No results found. Please try different keywords</p>
      )}
    </div>
  );
}

export default SearchResult;
