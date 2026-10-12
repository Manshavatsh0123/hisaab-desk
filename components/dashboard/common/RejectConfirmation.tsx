import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ApprovalEntry {
    id: number;
    initials: string;
    customer: string;
    staff: string;
    cadence: string;
    amount: string;
    time: string;
}

export default function RejectConfirmation({
    entry,
    onCancel,
    onConfirm,
}: {

    entry: ApprovalEntry;
    onCancel: () => void;
    onConfirm: () => void;

}) {

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--hs-text)]/40 p-4 backdrop-blur-sm">

            <button type="button" aria-label="Close rejection confirmation" onClick={onCancel} className="absolute inset-0 cursor-default" />



            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[var(--hs-border)] bg-[var(--hs-surface)] shadow-[0_24px_80px_rgba(38,54,77,0.20)]">
                <div className="border-b border-[var(--hs-border)] bg-[var(--hs-background)] px-5 py-4 sm:px-6">

                    <div className="flex items-start justify-between gap-4">
                        <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--hs-text-secondary)]">
                                REVIEW COLLECTION
                            </p>



                            <h2 className="mt-1 text-xl font-bold text-[var(--hs-text)]">
                                Reject collection?
                            </h2>

                        </div>



                        <Button

                            type="button"

                            variant="ghost"

                            size="icon"

                            onClick={onCancel}

                            className="size-8 rounded-lg text-[var(--hs-text-secondary)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-text)]"

                            aria-label="Close"

                        >

                            <X className="size-4" />

                        </Button>

                    </div>

                </div>



                <div className="px-5 py-5 sm:px-6">

                    <p className="text-sm leading-6 text-[var(--hs-text-secondary)]">

                        You are about to reject the collection submitted

                        for{" "}

                        <span className="font-bold text-[var(--hs-text)]">

                            {entry.customer}

                        </span>

                        . This entry will not be added to the books.

                    </p>



                    <div className="mt-4 rounded-xl border border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-xs font-bold text-[var(--hs-text)]">

                                    {entry.customer}

                                </p>



                                <p className="mt-0.5 text-xs text-[var(--hs-text-muted)]">

                                    Collected by {entry.staff}

                                </p>

                            </div>



                            <p className="text-base font-bold tabular-nums text-[var(--hs-text)]">

                                {entry.amount}

                            </p>

                        </div>

                    </div>

                </div>



                <div className="flex flex-col-reverse gap-2 border-t border-[var(--hs-border)] p-4 sm:flex-row sm:justify-end">

                    <Button

                        type="button"

                        variant="outline"

                        onClick={onCancel}

                        className="h-10 rounded-lg border border-[var(--hs-border)] bg-white px-4 font-semibold text-[var(--hs-text-secondary)] hover:bg-[var(--hs-hover)]"

                    >

                        Keep for review

                    </Button>



                    <Button

                        type="button"

                        onClick={onConfirm}

                        className="h-10 rounded-lg bg-[var(--hs-primary)] px-5 font-semibold text-white hover:bg-[var(--hs-primary-dark)]"

                    >

                        Reject collection

                    </Button>

                </div>

            </div>

        </div>

    );

}