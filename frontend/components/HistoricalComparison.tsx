"use client";

import { useState, useEffect } from "react";

interface QuantityChange {
  symbol: string;
  previous_quantity: number;
  current_quantity: number;
  change: number;
}

interface ComparisonData {
  added_holdings: string[];
  removed_holdings: string[];
  quantity_changes: QuantityChange[];
}

interface HistoricalComparisonProps {
  data: ComparisonData | null;
}

export default function HistoricalComparison({
  data,
}: HistoricalComparisonProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm text-slate-400">Loading historical comparison...</p>
      </div>
    );
  }

  const noChanges =
    data.added_holdings.length === 0 &&
    data.removed_holdings.length === 0 &&
    data.quantity_changes.length === 0;

  const totalChanges =
    data.added_holdings.length +
    data.removed_holdings.length +
    data.quantity_changes.length;

  return (
    <>
      {/* ── Compact Dashboard Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {/* Card header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              {/* Subtle icon */}
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 border border-blue-100">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Portfolio Intelligence
              </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
              Historical Portfolio
            </h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Compare your latest portfolio snapshot with the previous one.
            </p>
          </div>

          {/* Change count badge */}
          {!noChanges && (
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-slate-900">{totalChanges}</span>
              <span className="text-xs text-slate-400 font-medium">changes</span>
            </div>
          )}
        </div>

        {/* Mini stat strip */}
        {!noChanges && (
          <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 text-center">
              <p className="text-base font-semibold text-emerald-600">{data.added_holdings.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Added</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-base font-semibold text-red-500">{data.removed_holdings.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Removed</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-base font-semibold text-blue-600">{data.quantity_changes.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Adjusted</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View Portfolio Changes
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ── Drawer ── */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[42%] bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Portfolio Intelligence
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Historical Comparison
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Snapshot delta from your previous portfolio
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Summary strip inside drawer */}
          {!noChanges && (
            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
              <div className="px-3 py-2.5 text-center">
                <p className="text-sm font-semibold text-emerald-600">{data.added_holdings.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Added</p>
              </div>
              <div className="px-3 py-2.5 text-center">
                <p className="text-sm font-semibold text-red-500">{data.removed_holdings.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Removed</p>
              </div>
              <div className="px-3 py-2.5 text-center">
                <p className="text-sm font-semibold text-blue-600">{data.quantity_changes.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Adjusted</p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {noChanges ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="text-slate-800 text-sm font-semibold">No changes detected</p>
              <p className="text-slate-400 text-xs mt-1 max-w-xs">
                Your portfolio matches the previous snapshot exactly.
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* ── Added Holdings ── */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <h3 className="text-sm font-semibold text-slate-800">Added Holdings</h3>
                  </div>
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    {data.added_holdings.length}
                  </span>
                </div>

                {data.added_holdings.length > 0 ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {data.added_holdings.map((holding) => (
                      <div
                        key={holding}
                        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors duration-100"
                      >
                        <span className="text-sm font-medium text-slate-800">{holding}</span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center">
                    <p className="text-xs text-slate-400 font-medium">No holdings added</p>
                  </div>
                )}
              </section>

              {/* ── Removed Holdings ── */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    <h3 className="text-sm font-semibold text-slate-800">Removed Holdings</h3>
                  </div>
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                    {data.removed_holdings.length}
                  </span>
                </div>

                {data.removed_holdings.length > 0 ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {data.removed_holdings.map((holding) => (
                      <div
                        key={holding}
                        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors duration-100"
                      >
                        <span className="text-sm font-medium text-slate-800">{holding}</span>
                        <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                          Exited
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center">
                    <p className="text-xs text-slate-400 font-medium">No holdings removed</p>
                  </div>
                )}
              </section>

              {/* ── Quantity Changes ── */}
              {data.quantity_changes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      <h3 className="text-sm font-semibold text-slate-800">Quantity Changes</h3>
                    </div>
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {data.quantity_changes.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {data.quantity_changes.map((item) => (
                      <div
                        key={item.symbol}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300 hover:shadow-sm transition-all duration-150"
                      >
                        {/* Symbol + Badge */}
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-sm font-bold text-slate-900 tracking-wide">
                            {item.symbol}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 border ${
                              item.change >= 0
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {item.change >= 0 ? "+" : ""}
                            {item.change}
                          </span>
                        </div>

                        {/* Previous → Current */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-center">
                            <p className="text-xs text-slate-400 font-medium mb-1">Previous</p>
                            <p className="text-lg font-semibold text-slate-700">
                              {item.previous_quantity}
                            </p>
                          </div>

                          <div className="flex-shrink-0 text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>

                          <div className="flex-1 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-center">
                            <p className="text-xs text-blue-400 font-medium mb-1">Current</p>
                            <p className="text-lg font-semibold text-blue-700">
                              {item.current_quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="flex-shrink-0 border-t border-slate-200 px-6 py-4 bg-white">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}