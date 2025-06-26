import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Basic product schema (subset of full Product to keep form initial implementation lean)
const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  originalPrice: z.coerce.number().min(0).optional(),
  category: z.string(),
  serviceType: z.string(),
  status: z.enum(['active', 'inactive', 'draft', 'archived']),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  bestValue: z.boolean().optional(),
  inventory: z.object({
    trackInventory: z.boolean().optional(),
    quantity: z.coerce.number().default(0),
    lowStockThreshold: z.coerce.number().default(5),
    allowBackorders: z.boolean().optional(),
  }).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onCancel: () => void;
  onSuccess: () => void;
  productId?: string;
}

export default function ProductForm({ defaultValues, onCancel, onSuccess, productId }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      price: 0,
      category: 'diy',
      serviceType: 'digital',
      status: 'active',
      featured: false,
      popular: false,
      bestValue: false,
      inventory: {
        trackInventory: false,
        quantity: 0,
        lowStockThreshold: 5,
        allowBackorders: false,
      },
      ...defaultValues,
    },
  });

  // Auto-generate slug when name changes (if user hasn\'t manually edited slug)
  const nameVal = watch('name');
  const slugVal = watch('slug');
  useEffect(() => {
    if (!productId || !slugVal) {
      const newSlug = nameVal
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', newSlug, { shouldValidate: true });
    }
  }, [nameVal]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Upload new images first
      const uploadedImages = [] as { image: string; alt: string; isPrimary: boolean }[];
      for (const img of images) {
        if (img.id) {
          uploadedImages.push({ image: img.id, alt: img.alt, isPrimary: img.isPrimary });
          continue;
        }
        const form = new FormData();
        form.append('file', img.file as File);
        form.append('alt', img.alt || img.file?.name || 'image');
        const res = await fetch('/api/payload/collections/media', {
          method: 'POST',
          body: form,
        });
        if (!res.ok) throw new Error('Media upload failed');
        const { doc } = await res.json();
        uploadedImages.push({ image: doc.id, alt: img.alt, isPrimary: img.isPrimary });
      }

      // Attach images to product data
      const payloadData: any = { ...data };
      if (uploadedImages.length) payloadData.images = uploadedImages;

      const method = productId ? 'PATCH' : 'POST';
      const url = productId ? `/api/products/${productId}` : '/api/products';
      const prodRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      });
      if (!prodRes.ok) throw new Error('Failed to save product');
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const trackInventory = watch('inventory.trackInventory');

  // Image management
  type TempImage = { id?: string; url: string; file?: File; alt: string; isPrimary: boolean };
  const [images, setImages] = useState<TempImage[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr: TempImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      arr.push({ file, url: URL.createObjectURL(file), alt: file.name, isPrimary: false });
    }
    setImages((prev) => [...prev, ...arr]);
  };

  const setPrimaryImage = (index: number) => {
    setImages((imgs) => imgs.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const removeImage = (index: number) => {
    setImages((imgs) => imgs.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('name')}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product name"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            {...register('slug')}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="product-slug"
          />
          {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select {...register('category')} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="diy">DIY Kits</option>
            <option value="legal">Legal Services</option>
            <option value="consultation">Consultation</option>
            <option value="express">Express Services</option>
            <option value="review">Document Review</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <select {...register('serviceType')} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="digital">Digital Product</option>
            <option value="service">Service</option>
            <option value="consultation">Consultation</option>
            <option value="full_service">Full Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('price')}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Original Price (optional)</label>
          <input
            type="number"
            step="0.01"
            {...register('originalPrice')}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register('status')} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center space-x-4 pt-6">
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('featured')} className="h-4 w-4 text-blue-600" />
            <span className="ml-2 text-sm">Featured</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('popular')} className="h-4 w-4 text-blue-600" />
            <span className="ml-2 text-sm">Popular</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('bestValue')} className="h-4 w-4 text-blue-600" />
            <span className="ml-2 text-sm">Best Value</span>
          </label>
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Short Description</label>
        <textarea
          {...register('shortDescription')}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Inventory */}
      <div className="border p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Inventory</label>
        <label className="inline-flex items-center mb-2">
          <input type="checkbox" {...register('inventory.trackInventory')} className="h-4 w-4 text-blue-600" />
          <span className="ml-2 text-sm">Track Inventory</span>
        </label>
        {trackInventory && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                {...register('inventory.quantity')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
              <input
                type="number"
                {...register('inventory.lowStockThreshold')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex items-center mt-6">
              <label className="inline-flex items-center">
                <input type="checkbox" {...register('inventory.allowBackorders')} className="h-4 w-4 text-blue-600" />
                <span className="ml-2 text-sm">Allow Backorders</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Images */}
      <div className="border p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group border rounded-md overflow-hidden">
                <img src={img.url} alt={img.alt} className="object-cover w-full h-24" />
                {img.isPrimary && (
                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">Primary</span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(idx)}
                    className="bg-white text-xs px-2 py-1 rounded mr-2"
                  >
                    Set Primary
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {productId ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
