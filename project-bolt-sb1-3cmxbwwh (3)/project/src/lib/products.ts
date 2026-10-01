import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/lib/firebase';
import type { Product, ProductInput } from '@/types/product';

const COLLECTION = 'products';

export function subscribeProducts(
  onUpdate: (products: Product[]) => void,
  onError: (error: string) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          price: data.price,
          image_url: data.image_url ?? null,
          created_at: data.created_at?.toDate?.()?.toISOString() ?? '',
          updated_at: data.updated_at?.toDate?.()?.toISOString() ?? '',
        };
      });
      onUpdate(products);
    },
    (err) => onError(err.message)
  );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, COLLECTION), {
    title: input.title,
    description: input.description,
    price: input.price,
    image_url: input.image_url ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    id: docRef.id,
    ...input,
    created_at: now,
    updated_at: now,
  };
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...input,
    updatedAt: new Date(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Falta configurar Cloudinary. Agrega VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en .env'
    );
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message ?? 'No se pudo subir la imagen');
  }
  const data = await res.json();
  return data.secure_url as string;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!CLOUDINARY_CLOUD_NAME) return;
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return;
    const version = parts[uploadIndex + 1];
    const publicId = parts.slice(uploadIndex + 2).join('/').replace(/\.[^.]+$/, '');
    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;
    await fetch(destroyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: publicId, invalidate: true }),
    });
  } catch {
    // If deletion fails (e.g. not a Cloudinary URL), just skip
  }
}

export function buildWhatsAppLink(product: Product, number: string): string {
  const message =
    `Hola, quiero hacer un pedido:\n\n` +
    `Producto: ${product.title}\n` +
    `Precio: S/. ${product.price.toFixed(2)}\n` +
    `Cantidad: 1\n\n` +
    `¿Está disponible?`;
  const clean = number.replace(/[^0-9+]/g, '');
  return `https://wa.me/${clean.replace('+', '')}?text=${encodeURIComponent(message)}`;
}
