import React from "react";

export function Field({ label, className = "", children, hint }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-ink-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-ink-100 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition ${
        props.className || ""
      }`}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border border-ink-100 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition resize-none ${
        props.className || ""
      }`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-ink-100 bg-white px-3 py-2 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-brass-400 transition ${
        props.className || ""
      }`}
    >
      {props.children}
    </select>
  );
}

export function SectionCard({ title, eyebrow, children, actions }) {
  return (
    <div className="bg-white rounded-lg border border-ink-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-50">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600 mb-0.5">
              {eyebrow}
            </p>
          )}
          <h3 className="font-display text-lg text-ink-800">{title}</h3>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
