export default function MiniStat({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div className="min-w-0 border-r border-[var(--hs-border)] p-2.5 last:border-r-0">

      <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[var(--hs-text-muted)]">

        {label}

      </p>

      <p className="mt-1 truncate text-sm font-bold text-[var(--hs-text)]">

        {value}

      </p>

    </div>

  );

}