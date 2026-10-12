import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function EmptyState({

  search,

  onClear,

}: {

  search: string;

  onClear: () => void;

}) {

  return (

    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

      <div className="grid size-12 place-items-center rounded-full bg-[var(--hs-primary-light)] text-[var(--hs-text)]">

        <Search className="size-5" />

      </div>



      <h3 className="mt-4 text-base font-bold text-[var(--hs-text)]">

        No field agents found

      </h3>



      <p className="mt-1 max-w-sm text-sm text-[var(--hs-text-secondary)]">

        {search

          ? "Try another name, username, ID or phone number."

          : "No agents match the selected filters."}

      </p>



      <Button
        type="button"
        variant="outline"
        onClick={onClear}
        className="mt-4 border-[var(--hs-border)] text-[var(--hs-text)]"
      >

        Clear filters

      </Button>

    </div>

  );

}