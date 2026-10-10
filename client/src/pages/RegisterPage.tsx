
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // One handler updates whichever field triggered the event.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name as keyof typeof prev]: value, // keyof extracts the property names from a type making it => "username" | "email" | "password" | "confirm"
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = form.username.trim();
    const email = form.email.trim();

    const nextErrors = {
      username: '',
      email: '',
      password: '',
      confirm: '',
    };

    if (username.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (form.password !== form.confirm) {
      nextErrors.confirm = 'Passwords do not match.';
    }

    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username,
        email,
        password: form.password,
      });

      navigate('/login', {
        replace: true,
        state: { registered: true },
      });
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;

      toast.error(message ?? 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4 min-w-0 flex-1">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="username">Username</label>
          <input
            id="username"
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
          />
          {fieldErrors.username && (
            <p className="mt-1.5 text-sm text-(--danger)">{fieldErrors.username}</p>
          )}
        </div>

        <div className="mb-4 min-w-0 flex-1">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">Email</label>
          <input
            id="email"
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <p className="mt-1.5 text-sm text-(--danger)">{fieldErrors.email}</p>
          )}
        </div>

        <div className="mb-4 min-w-0 flex-1">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">Password</label>
          <input
            id="password"
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />
          <p className="mt-1.5 text-sm text-(--muted)">At least 6 characters.</p>
          {fieldErrors.password && (
            <p className="mt-1.5 text-sm text-(--danger)">{fieldErrors.password}</p>
          )}
        </div>

        <div className="mb-4 min-w-0 flex-1">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
          />
          {fieldErrors.confirm && (
            <p className="mt-1.5 text-sm text-(--danger)">{fieldErrors.confirm}</p>
          )}
        </div>

        <button
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-(--radius) border border-transparent bg-(--brand) px-4.5 font-semibold text-white hover:bg-(--brand-ink) disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-(--muted)">
        Already have an account? <Link className="font-semibold text-(--brand)" to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
