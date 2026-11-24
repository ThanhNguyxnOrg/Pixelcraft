import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

/** APG horizontal tabs pattern: roving tabindex, Left/Right/Home/End keys (never traps Up/Down page scroll). */
export function Tabs<T extends { id: string }>({
  items,
  value,
  onChange,
  label,
  renderTab,
  renderPanel,
  listClassName = "",
  tabClassName,
}: {
  items: T[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  renderTab: (item: T, index: number, selected: boolean) => ReactNode;
  renderPanel: (item: T) => ReactNode;
  listClassName?: string;
  tabClassName: (selected: boolean) => string;
}) {
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(
    0,
    items.findIndex((i) => i.id === value),
  );

  function onKeyDown(e: KeyboardEvent) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft")
      next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  }

  const current = items[index];

  return (
    <>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
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
              onClick={() => onChange(item.id)}
              className={tabClassName(selected)}
            >
              {renderTab(item, i, selected)}
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
