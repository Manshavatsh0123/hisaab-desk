"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type SelectControlProps = {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
};

export default function SelectControl({
  ariaLabel,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: SelectControlProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const selectedIndex = options.indexOf(value);
    return selectedIndex >= 0 ? selectedIndex : 0;
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();

  const selectedIndex = options.indexOf(value);
  const selectedLabel =
    selectedIndex >= 0 ? options[selectedIndex] : placeholder || value || "Select option";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const index = Math.max(0, Math.min(activeIndex, options.length - 1));
    optionRefs.current[index]?.focus();
  }, [open, activeIndex, options.length]);

  const chooseOption = (option: string) => {
    onChange(option);
    setActiveIndex(options.indexOf(option));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const openAtSelected = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen((current) => !current);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setOpen(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : options.length - 1);
      setOpen(true);
    } else if (event.key === "Home" && options.length) {
      event.preventDefault();
      setActiveIndex(0);
      setOpen(true);
    } else if (event.key === "End" && options.length) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      setOpen(true);
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled || options.length === 0}
        onClick={openAtSelected}
        onKeyDown={handleTriggerKeyDown}
        className={[
          "group flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-[8px]",
          "border border-[var(--hs-border)] bg-white px-3 text-left text-sm font-medium",
          "text-[var(--hs-text)] shadow-sm shadow-slate-950/[0.03]",
          "transition duration-150 hover:border-slate-300 hover:bg-slate-50/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/20 focus-visible:border-[var(--hs-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open ? "border-[var(--hs-primary)] ring-2 ring-[var(--hs-primary)]/10" : "",
        ].join(" ")}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${open ? "rotate-180 text-[var(--hs-primary)]" : ""
            }`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-[120] w-full min-w-[160px] origin-top overflow-hidden rounded-[8px] border border-slate-200 bg-white p-1.5 shadow-[0_10px_28px_rgba(15,23,42,0.12)] animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => {
              const selected = option === value;
              const active = index === activeIndex;

              return (
                <button
                  key={option}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={active ? 0 : -1}
                  onClick={() => chooseOption(option)}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                  className={[
                    "flex min-h-9 w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2",
                    "text-left text-sm transition-colors",
                    selected
                      ? "bg-[var(--hs-primary-light)] font-semibold text-[var(--hs-primary)]"
                      : "text-slate-700 hover:bg-slate-50",
                    active && !selected ? "bg-slate-50" : "",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--hs-primary)]/30",
                  ].join(" ")}
                >
                  <span className="min-w-0 truncate">{option}</span>
                  {selected && <Check className="size-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
