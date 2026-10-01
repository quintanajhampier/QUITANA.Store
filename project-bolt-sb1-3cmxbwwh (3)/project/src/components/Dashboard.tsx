import { useEffect, useState, type ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Upload, LogOut, Footprints, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  subscribeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  uploadProductImage,
} from '@/lib/products';
import type { Product, ProductInput } from '@/types/product';

export default function Dashboard({ onGoStore }: { onGoStore: () => void }) {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('¿Eliminar esta zapatilla? Esta acción no se puede deshacer.')) return;
    try {
      if (imageUrl) await deleteProductImage(imageUrl);
      await deleteProduct(id);
    } catch (e) {
      alert('No se pudo eliminar: ' + (e instanceof Error ? e.message : 'error'));
    }
  };

  const handleSave = async (input: ProductInput) => {
    if (editing) {
      await updateProduct(editing.id, input);
    } else {
      await createProduct(input);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };

  const copyStoreLink = async () => {
    const url = `${window.location.origin}/`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copia este enlace:', url);
    }
  };

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
              <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyStoreLink}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar enlace de tienda
                </>
              )}
            </button>
            <button
              onClick={onGoStore}
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Ver tienda
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Zapatillas{' '}
            <span className="ml-1 text-sm font-normal text-neutral-500">
              ({products.length})
            </span>
          </h2>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            Nueva zapatilla
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-3 text-sm">Cargando…</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950/50 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 py-20 text-center">
            <p className="text-sm font-medium text-neutral-500">
              No hay zapatillas todavía.
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              Haz clic en "Nueva zapatilla" para crear la primera.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full">
              <thead className="border-b border-neutral-800 bg-neutral-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Zapatilla
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:table-cell">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {products.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                          {p.image_url && (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {p.title}
                        </span>
                      </div>
                    </td>
                    <td className="hidden max-w-xs px-4 py-3 sm:table-cell">
                      <p className="truncate text-sm text-neutral-400">
                        {p.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                      S/.{p.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.image_url)}
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-950/50 hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modalOpen && (
        <ProductModal
          product={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ---------- Product Modal ---------- */

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (input: ProductInput) => Promise<void>;
}) {
  const [title, setTitle] = useState(product?.title ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      setImageUrl(url);
    } catch (err) {
      setError('No se pudo subir la imagen: ' + (err instanceof Error ? err.message : 'error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        image_url: imageUrl || null,
      });
    } catch (err) {
      setError('No se pudo guardar: ' + (err instanceof Error ? err.message : 'error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h3 className="text-lg font-bold text-white">
            {product ? 'Editar zapatilla' : 'Nueva zapatilla'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {/* Image upload */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">
              Foto de la zapatilla
            </label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800">
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-600">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? 'Subiendo…' : 'Subir foto'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="ml-2 text-sm text-neutral-500 hover:text-red-400"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">
              Modelo / Título
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nike Air Max 90"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/10"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">
              Descripción
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Talla, color, condición, etc."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/10"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">
              Precio (S/.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                S/.
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-neutral-200 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? 'Guardar cambios' : 'Crear zapatilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
