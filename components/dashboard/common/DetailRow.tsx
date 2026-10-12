import { Mail } from "lucide-react";

export default function DetailRow({

  icon: Icon,

  label,

  value,

}: {

  icon: typeof Mail;

  label: string;

  value: string;

}) {

  return (

    <div className="flex items-center gap-3 border-b border-[var(--hs-border-light)] px-4 py-3.5 last:border-b-0">

      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--hs-primary-light)] text-[var(--hs-text)]">

        <Icon className="size-3.5" />

      </div>



      <div className="min-w-0">

        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--hs-text-muted)]">

          {label}

        </p>



        <p className="mt-0.5 truncate text-sm font-semibold text-[var(--hs-text)]">

          {value}

        </p>

      </div>

    </div>

  );

}