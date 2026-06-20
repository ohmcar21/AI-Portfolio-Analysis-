import React from "react";

type Holding = {
  id?: string;
  symbol?: string;
  exchange?: string;
  quantity?: number | string;
  average_price?: number | string;
  current_price?: number | string;
  invested_value?: number | string;
  current_value?: number | string;
  pnl?: number | string;
  pnl_pct?: number | string;
  sector?: string | null;
};

type Props = {
  holdings: Holding[]; // always expect an array (page will pass summary?.holdings ?? [])
};

const safeNumber = (v: any) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function HoldingsTable({ holdings }: Props) {
  if (!Array.isArray(holdings)) {
    return <div className="mt-6 text-center text-gray-600">Loading holdings…</div>;
  }

  if (holdings.length === 0) {
    return <div className="mt-6 p-4 text-center text-gray-600">No holdings found.</div>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invested Value</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PnL</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {holdings.map((h, idx) => {
            const qty = safeNumber(h.quantity);
            const avg = safeNumber(h.average_price);
            const cur = safeNumber(h.current_price);
            const invested = safeNumber(h.invested_value) || avg * qty;
            const currentValue = safeNumber(h.current_value) || cur * qty;
            const pnl = safeNumber(h.pnl) || currentValue - invested;

            const pnlClass =
              pnl > 0 ? "text-green-600 font-semibold" : pnl < 0 ? "text-red-600 font-semibold" : "text-gray-800";

            return (
              <tr key={h.id ?? `${h.symbol ?? "unk"}-${idx}`}>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{h.symbol ?? "-"}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{qty}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(avg)}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(cur)}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(invested)}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(currentValue)}</td>
                <td className={`px-3 py-3 whitespace-nowrap text-sm text-right ${pnlClass}`}>
                  <div>{formatCurrency(pnl)}</div>
                  <div className="text-xs text-gray-500">{safeNumber(h.pnl_pct).toFixed(2)}%</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
