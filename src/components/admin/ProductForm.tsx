import React, { useState } from 'react';
import { Product } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../supabase/client';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSuccess, 
  onCancel 
}) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [quantity, setQuantity] = useState(product?.quantity.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate input
    if (!name || !price || !quantity || !category) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const productData = {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        category,
        image_url: imageUrl || null,
      };

      let result;

      if (product) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && (
        <div className="bg-error-50 p-3 rounded-md text-error-700 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Product Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price (₹) *"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
        />

        <Input
          label="Quantity *"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Category *"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          required
        />

        <Input
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;