import { formInputClassName } from '../common/FormField';

const SEARCH_INPUT_ID = 'ticket-search';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function SearchBar({
  value,
  onChange,
  disabled = false,
}: SearchBarProps) {
  return (
    <label htmlFor={SEARCH_INPUT_ID} className="block min-w-0 flex-1">
      <span className="sr-only">Search tickets by title</span>
      <input
        id={SEARCH_INPUT_ID}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Search by title..."
        className={formInputClassName}
      />
    </label>
  );
}
