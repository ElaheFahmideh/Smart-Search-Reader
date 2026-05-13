type TSearchNavigator = {
  action: () => void;
  children: string;
};

function SearchNavigator({ action, children }: TSearchNavigator) {
  return <button onClick={action}>{children}</button>;
}

export default SearchNavigator;
