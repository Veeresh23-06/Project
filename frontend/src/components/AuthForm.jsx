import { useEffect, useMemo, useState } from 'react';

export default function AuthForm({ onSubmit, authMode, setAuthMode, loading, error, message }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '' });

  // Clear form when auth mode changes
  useEffect(() => {
    setForm({ name: '', email: '', password: '', token: '' });
  }, [authMode]);

  const fields = useMemo(() => {
    if (authMode === 'signup') {
      return [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
      ];
    }
    if (authMode === 'request-reset') {
      return [{ name: 'email', label: 'Email', type: 'email' }];
    }
    if (authMode === 'reset-password') {
      return [
        { name: 'token', label: 'Reset Token', type: 'text' },
        { name: 'password', label: 'New Password', type: 'password' },
      ];
    }
    return [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
    ];
  }, [authMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, mode: authMode });
  };

  const description =
    authMode === 'signup'
      ? 'Create an account to start tracking your spending.'
      : authMode === 'request-reset'
      ? 'Enter your email to receive a reset token.'
      : authMode === 'reset-password'
      ? 'Use the reset token to update your password.'
      : 'Sign in to manage your expenses securely.';

  const actionLabel =
    authMode === 'signup'
      ? 'Create account'
      : authMode === 'request-reset'
      ? 'Request reset token'
      : authMode === 'reset-password'
      ? 'Reset password'
      : 'Sign in';

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700/60 dark:text-slate-100">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Smart Expense Tracker</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {authMode !== 'login' && authMode !== 'signup' && (
          <div className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {authMode === 'request-reset' ? '📧 Password Recovery' : '🔐 Reset Your Password'}
          </div>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        ))}

        {message && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <div className="font-semibold">✓ Success</div>
            {authMode === 'request-reset' && (
              <div className="mt-2 space-y-1">
                <p>Reset token has been sent to your email.</p>
                <p className="font-mono text-xs opacity-75">Token: {message.includes('token:') ? message.split('token: ')[1] : message}</p>
              </div>
            )}
            {authMode === 'reset-password' && <p>{message}</p>}
          </div>
        )}
        {error && (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
            <div className="font-semibold">✕ Error</div>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
          disabled={loading}
        >
          {loading ? 'Working…' : actionLabel}
        </button>
      </form>

      <nav className="mt-6 space-y-2 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
        {authMode === 'signup' && (
          <>
            <p>
              Already have an account?{' '}
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('login')}>
                Sign in
              </button>
            </p>
          </>
        )}
        {authMode === 'login' && (
          <>
            <p>
              New here?{' '}
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('signup')}>
                Create account
              </button>
            </p>
            <p>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('request-reset')}>
                Forgot password?
              </button>
            </p>
          </>
        )}
        {authMode === 'request-reset' && (
          <>
            <p>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('reset-password')}>
                Have a token? Reset now
              </button>
            </p>
            <p>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('login')}>
                Back to sign in
              </button>
            </p>
          </>
        )}
        {authMode === 'reset-password' && (
          <>
            <p>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('login')}>
                Done? Sign in
              </button>
            </p>
            <p>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" onClick={() => setAuthMode('request-reset')}>
                Need a new token?
              </button>
            </p>
          </>
        )}
      </nav>
    </div>
  );
}
