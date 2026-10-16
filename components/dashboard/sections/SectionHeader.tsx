export default function SectionHeader({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count?: string;
}) {

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-[var(--hs-text)]">{title}</h2>
        <p className="mt-0.5 text-sm text-[var(--hs-text-secondary)]">{description}</p>
      </div>

      {count && (
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--hs-border)] bg-[var(--hs-background)] px-3 py-1.5 text-xs font-semibold text-[var(--hs-text-secondary)]">
          {count}
        </span>
      )}
    </div>
  );

}