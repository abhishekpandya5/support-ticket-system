import { formInputClassName } from '../common/FormField';

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
    <label className="block min-w-0 flex-1">
      <span className="sr-only">Search tickets by title</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Search by title..."
        className={formInputClassName}
        aria-label="Search tickets by title"
      />
    </label>
  );
}
