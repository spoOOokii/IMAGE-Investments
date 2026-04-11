"use client";

import { useEffect, useRef, useState } from "react";

export type AnimatedSelectOption = {
  value: string;
  label: string;
};

type AnimatedSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: AnimatedSelectOption[];
  placeholder: string;
  triggerClassName: string;
  menuClassName: string;
  optionClassName: string;
  selectedOptionClassName?: string;
};

export function AnimatedSelect({
  value,
  onChange,
  options,
  placeholder,
  triggerClassName,
  menuClassName,
  optionClassName,
  selectedOptionClassName = "",
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`${triggerClassName} flex items-center justify-between gap-3`}
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          aria-hidden
          className={`text-xs transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ˅
        </span>
      </button>

      <div
        className={`absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-[1.6rem] transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-80 translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 max-h-0 opacity-0"
        } ${menuClassName}`}
      >
        <ul
          role="listbox"
          className="select-scrollbar max-h-80 overflow-y-auto p-2"
        >
          {options.map((option) => (
            <li key={`${option.value}-${option.label}`}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`select-option-item ${optionClassName} ${
                  option.value === value ? selectedOptionClassName : ""
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
