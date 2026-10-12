export default function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="rounded-xl border border-[var(--hs-border)] bg-[var(--hs-background)] p-4">

      <p className="text-xs font-medium text-[var(--hs-text-secondary)]">
        {label}
      </p>
      
      <p className="mt-1.5 text-lg font-bold text-[var(--hs-text)]">
        {value}
      </p>

    </div>

  );

}