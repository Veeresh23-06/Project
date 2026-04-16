export default function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
        <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 text-left font-medium">Notes</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-950">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                Loading expenses...
              </td>
            </tr>
          ) : expenses.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                No expenses found. Add a new expense to get started.
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{expense.category}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                  ₹{expense.amount.toFixed(2)}
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{expense.notes || '-'}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => onEdit(expense)}
                    className="mr-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:hover:bg-rose-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
