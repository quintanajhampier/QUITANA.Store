import { useState } from 'react';
import { Lock, Mail, Loader2, Footprints } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login({ onBack }: { onBack: () => void }) {
  const { signIn, adminError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  const displayError = error ?? adminError;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-neutral-950">
            <Footprints className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            QUINTANA<span className="text-neutral-500">.Store</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Inicia sesión para gestionar zapatillas
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          {displayError && (
            <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-400">
              {displayError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-neutral-200 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={onBack} className="text-sm text-neutral-600 hover:text-neutral-400">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
