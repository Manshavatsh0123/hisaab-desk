export default function TableHead({

  children,

  align = "left",

}: {

  children: React.ReactNode;

  align?: "left" | "right";

}) {

  return (

    <th

      className={`px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--hs-text-secondary)] lg:px-5 ${align === "right" ? "text-right" : "text-left"

        }`}

    >

      {children}

    </th>

  );

}