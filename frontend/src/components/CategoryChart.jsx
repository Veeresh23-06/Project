import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const colors = ['#4f46e5', '#ec4899', '#f97316', '#22c55e', '#0ea5e9', '#fbbf24', '#a855f7'];

export default function CategoryChart({ data }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Category Breakdown</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Visual view of spending by category.</p>
      </div>
      {data.length === 0 ? (
        <div className="rounded-3xl bg-slate-50 p-10 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">Add expenses to see charts.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-1">
          <div className="h-72 rounded-3xl bg-slate-50 p-4 dark:bg-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="amount" data={data} outerRadius={100} fill="#4f46e5" label>
                  {data.map((entry, index) => (
                    <Cell key={`slice-${entry.category}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72 rounded-3xl bg-slate-50 p-4 dark:bg-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="amount" fill="#4f46e5" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
