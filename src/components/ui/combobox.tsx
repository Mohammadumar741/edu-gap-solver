import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  id?: string;
};

/**
 * Typeahead combobox: free-text input with a filtered suggestion dropdown.
 * Users can pick a suggestion OR type any custom value.
 */
export function Combobox({ value, onChange, options, placeholder, className, id }: Props) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const q = value.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    const list = q
      ? options.filter((o) => o.toLowerCase().includes(q))
      : options;
    return list.slice(0, 8);
  }, [options, q]);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
          else if (e.key === "Enter" && open && filtered[active]) { e.preventDefault(); pick(filtered[active]); }
          else if (e.key === "Escape") setOpen(false);
        }}
        autoComplete="off"
        className="w-full bg-input border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      {open && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-border/60 bg-popover text-popover-foreground shadow-lg py-1"
        >
          {filtered.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "px-3 py-1.5 text-sm cursor-pointer",
                i === active ? "bg-primary/15 text-primary" : "hover:bg-muted",
              )}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}