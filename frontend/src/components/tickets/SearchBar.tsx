const inputClassName =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50';

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
        className={inputClassName}
        aria-label="Search tickets by title"
      />
    </label>
  );
}
