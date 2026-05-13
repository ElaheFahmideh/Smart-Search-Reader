type TSearchInput = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
};

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

export default SearchInput;
