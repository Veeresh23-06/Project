export default function SummaryCards({ total, monthlyTotals, expenseCount }) {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const currentMonthValue = monthlyTotals[currentMonth] || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total खर्च</p>
        <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">₹{total.toFixed(2)}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Monthly spending</p>
        <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">₹{currentMonthValue.toFixed(2)}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transactions</p>
        <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">{expenseCount}</p>
      </div>
    </div>
  );
}
