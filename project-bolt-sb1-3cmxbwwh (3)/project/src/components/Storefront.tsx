import { useEffect, useState } from 'react';
import { MessageCircle, Loader2, PackageOpen, Footprints } from 'lucide-react';
import { subscribeProducts, buildWhatsAppLink } from '@/lib/products';
import { WHATSAPP_NUMBER } from '@/lib/firebase';
import type { Product } from '@/types/product';

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeProducts(
      (products) => {
        setProducts(products);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-950">
              <Footprints className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                QUINTANA<span className="text-neutral-500">.Store</span>
              </h1>
              <p className="text-xs text-neutral-500">Zapatillas</p>
            </div>
          </div>

        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            Nueva Colección
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Encuentra tu<br />
            <span className="text-white">próximo par</span>
          </h2>
          <p className="mt-4 max-w-md text-base text-neutral-400">
            Las mejores zapatillas, listas para ti. Explora el catálogo y pide por WhatsApp en un solo clic.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-3 text-sm">Cargando zapatillas…</p>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-800 bg-red-950/50 p-6 text-center">
            <p className="text-sm font-medium text-red-400">
              No se pudieron cargar los productos.
            </p>
            <p className="mt-1 text-xs text-red-500/70">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
            <PackageOpen className="h-12 w-12" />
            <p className="mt-3 text-sm font-medium text-neutral-500">
              Aún no hay zapatillas publicadas.
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              Vuelve pronto, estamos preparando el catálogo.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-800 py-8">
        <p className="text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} QUINTANA.Store — Zapatillas
        </p>
      </footer>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const link = buildWhatsAppLink(product, WHATSAPP_NUMBER);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/40">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Footprints className="h-12 w-12 text-neutral-700" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-white">{product.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-400">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-white">
            S/.{product.price.toFixed(2)}
          </span>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-green-600 active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4" />
          Comprar
        </a>
      </div>
    </article>
  );
}
