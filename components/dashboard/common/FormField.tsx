export default function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {

  return (
    <label className="grid gap-1.5 text-sm font-bold text-[var(--hs-text-secondary)]">
      {label}
      {children}
    </label>

  );

}