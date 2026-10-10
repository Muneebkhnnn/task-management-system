import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const justRegistered = (location.state as { registered?: boolean } | null)?.registered;
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedIdentifier = identifier.trim();

    if (trimmedIdentifier.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier)) {
        setValidationError("Enter a valid email address.");
        return
      }
    } else if (trimmedIdentifier.length < 3) {
      setValidationError("Username must be at least 3 characters.");
      return
    }

    if (!trimmedIdentifier) {
      setValidationError('Enter your email or username.');
      return;
    }

    if (!password) {
      setValidationError('Enter your password.');
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    try {
      await login({ identifier: trimmedIdentifier, password });
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;

      toast.error(message ?? 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see your tasks.">
      {justRegistered && <p className="mb-4 rounded-(--radius) bg-(--green-bg) px-3 py-2.5 text-[0.9rem] text-(--green)">Account created. Log in to continue.</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 min-w-0 flex-1">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="identifier">Email or username</label>
          <input
            id="identifier"
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 min-w-0 flex-1">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">Password</label>
          <input
            required
            id="password"
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {validationError && <p className="mb-3 rounded-(--radius) bg-(--danger-bg) px-3 py-2.5 text-[0.9rem] text-(--danger)">{validationError}</p>}

        <button className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-(--radius) border border-transparent bg-(--brand) px-4.5 font-semibold text-white hover:bg-(--brand-ink) disabled:opacity-60" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-5 text-center text-(--muted)">
        New here? <Link className="font-semibold text-(--brand)" to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
