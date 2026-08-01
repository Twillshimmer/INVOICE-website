import React from "react";

export default function Header({ view, setView }) {
  return (
    <header className="bg-ink-800 text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-brass-600 flex items-center justify-center font-display font-bold text-ink-900">
            ₹
          </div>
          <div>
            <p className="font-display text-lg leading-none">Ledger</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-200">Invoice Generator</p>
          </div>
        </div>
        <nav className="flex items-center gap-1 bg-ink-700 rounded-full p-1">
          {[
            { key: "editor", label: "New Invoice" },
            { key: "saved", label: "Saved Invoices" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition ${
                view === tab.key ? "bg-brass-600 text-ink-900" : "text-ink-100 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
