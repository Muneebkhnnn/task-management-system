import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-(--line) bg-(--surface)">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-2.5 md:px-6 md:py-3">
        <span className="text-xl font-bold tracking-[-0.02em] text-(--brand)">Taskline</span>
        <div className="flex items-center gap-3">
          <span className="max-w-30 truncate font-semibold md:max-w-55">{user?.username}</span>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-(--line) bg-(--surface) px-4.5 font-semibold hover:bg-(--bg)" onClick={() => {
            void logout()
          }}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
