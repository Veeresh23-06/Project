import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import FilterBar from './components/FilterBar';
import AuthForm from './components/AuthForm';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const categories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Health', 'Entertainment', 'Other'];

function App() {
  const savedToken = localStorage.getItem('expense_token');
  const savedUser = localStorage.getItem('expense_user');

  const [token, setToken] = useState(savedToken || '');
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [theme, setTheme] = useState(localStorage.getItem('expense_theme') || 'light');
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({ category: '', fromDate: '', toDate: '', search: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('expense_theme', theme);
  }, [theme]);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.search) params.append('search', filters.search);
    return params.toString();
  };

  const fetchExpenses = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      const query = buildQuery();
      const response = await fetch(`${API_BASE}/expenses${query ? `?${query}` : ''}`, {
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load expenses');
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters.category, filters.fromDate, filters.toDate, filters.search, token]);

  const totals = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const monthly = expenses.reduce((acc, item) => {
      const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + item.amount;
      return acc;
    }, {});
    return { total, monthly };
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        amount: expenses.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0),
      }))
      .filter((item) => item.amount > 0);
  }, [expenses]);

  const onAuthSubmit = async (formData) => {
    try {
      setAuthLoading(true);
      setAuthError('');
      setAuthMessage('');
      const endpoint = `${API_BASE}/auth/${formData.mode}`;
      const body = JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        token: formData.token,
      });
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      if (formData.mode === 'login' || formData.mode === 'signup') {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('expense_token', data.token);
        localStorage.setItem('expense_user', JSON.stringify(data.user));
        setFilters({ category: '', fromDate: '', toDate: '', search: '' });
        setSelectedExpense(null);
      } else if (formData.mode === 'request-reset') {
        setAuthMessage(`Reset token: ${data.resetToken}`);
      } else if (formData.mode === 'reset-password') {
        setAuthMode('login');
        setAuthMessage(data.message || 'Password reset successfully. Please sign in.');
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('expense_token');
    localStorage.removeItem('expense_user');
    setExpenses([]);
  };

  const handleSave = async (payload) => {
    try {
      setError('');
      const method = payload._id ? 'PUT' : 'POST';
      const endpoint = payload._id ? `${API_BASE}/expenses/${payload._id}` : `${API_BASE}/expenses`;
      const response = await fetch(endpoint, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save expense');
      setSelectedExpense(null);
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete expense');
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = async () => {
    try {
      setError('');
      const query = buildQuery();
      const response = await fetch(`${API_BASE}/expenses/export${query ? `?${query}` : ''}`, {
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Unable to export data');
      }
      const csvText = await response.text();
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expenses.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-surface text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <AuthForm
            authMode={authMode}
            setAuthMode={setAuthMode}
            onSubmit={onAuthSubmit}
            loading={authLoading}
            error={authError}
            message={authMessage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-surface text-slate-900'}`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Smart Expense Tracker</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Hello {user?.name}, track your spending with personalized insights.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button
              onClick={handleExport}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>

        <SummaryCards total={totals.total} monthlyTotals={totals.monthly} expenseCount={expenses.length} />

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <ExpenseForm categories={categories} expense={selectedExpense} onSave={handleSave} onCancel={() => setSelectedExpense(null)} />

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Expenses</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Filter, search and edit your expense records.</p>
                </div>
              </div>
              <FilterBar filters={filters} setFilters={setFilters} categories={categories} />
              {error && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>}
              <ExpenseTable expenses={expenses} loading={loading} onEdit={setSelectedExpense} onDelete={handleDelete} />
            </div>
          </div>

          <CategoryChart data={categoryBreakdown} />
        </div>
      </div>
    </div>
  );
}

export default App;
