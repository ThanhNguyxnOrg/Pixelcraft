import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

/** APG tabs pattern: roving tabindex, arrow/Home/End keys, automatic activation, optional spring pill indicator. */
export function Tabs<T extends { id: string }>({
  items,
  value,
  onChange,
  label,
  renderTab,
  renderPanel,
  listClassName = "",
  tabClassName,
  pillClassName,
}: {
  items: T[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  renderTab: (item: T, index: number, selected: boolean) => ReactNode;
  renderPanel: (item: T) => ReactNode;
  listClassName?: string;
  tabClassName: (selected: boolean) => string;
  pillClassName?: string;
}) {
  const base = useId();
  const reducedMotion = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(
    0,
    items.findIndex((i) => i.id === value),
  );

  function select(next: number, focus = false) {
    const item = items[next];
    if (!item) return;
    onChange(item.id);
    const el = refs.current[next];
    if (focus) el?.focus();
    el?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }

  function onKeyDown(e: KeyboardEvent) {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    select(next, true);
  }

  const current = items[index] ?? items[0];

  return (
    <>
      <div
        role="tablist"
        aria-label={label}
        className={listClassName}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          const selected = i === index;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={`relative ${tabClassName(selected)}`}
            >
              {selected && pillClassName ? (
                <motion.span
                  layoutId={reducedMotion ? undefined : `${base}-pill`}
                  aria-hidden="true"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                          mass: 0.7,
                        }
                  }
                  className={`pointer-events-none absolute inset-0 ${pillClassName}`}
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-2">
                {renderTab(item, i, selected)}
              </span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${current.id}`}
        tabIndex={0}
      >
        {renderPanel(current)}
      </div>
    </>
  );
}
