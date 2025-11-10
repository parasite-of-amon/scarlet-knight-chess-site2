import { LoginForm } from './client';

export const metadata = {
  title: 'Admin Login | Rutgers Chess Club',
  description: 'Admin login for Rutgers Chess Club event management',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-primary text-5xl mb-4">♞</div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Sign in to manage events
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
