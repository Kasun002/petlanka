import { Outlet } from 'react-router-dom';

export default function MainLayout(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Petlanka Admin</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
