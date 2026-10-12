type SelectControlProps = {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function SelectControl({
  ariaLabel,
  value,
  onChange,
  options,
}: SelectControlProps) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full min-w-0 cursor-pointer rounded-lg border border-[var(--hs-border)] bg-white px-3 text-sm font-medium text-[var(--hs-text)] outline-none transition focus:border-[var(--hs-primary)] focus:ring-2 focus:ring-[var(--hs-primary)]/15"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default SelectControl;