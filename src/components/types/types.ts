type searchProps = {
  onUpdateSearch: (search: string) => void;
};
type cardListProps = {
  data: [];
  search: string;
  onItemSelected: (id: string) => void;
};
export type { searchProps, cardListProps };
