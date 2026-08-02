"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Plus, Loader2, Trash2, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { addressesApi } from "@/lib/api";

interface AddressesData {
  addresses: any[];
  error: string | null;
}

export default function AddressesClient({ initialData }: { initialData: AddressesData }) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    fullAddress: '',
    city: '',
    district: '',
    ward: '',
    instructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-900" />
          <p className="mt-2 text-sm text-ink-400">Loading...</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.label.trim()) newErrors.label = 'Label is required';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addressesApi.create(formData);
      const addresses = await addressesApi.list();
      setData({ addresses, error: null });
      setShowForm(false);
      setFormData({
        label: '',
        fullAddress: '',
        city: '',
        district: '',
        ward: '',
        instructions: '',
      });
      setErrors({});
    } catch (error: any) {
      console.error('Failed to create address:', error);
      setErrors({ submit: error.message || 'Failed to create address' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      await addressesApi.remove(id);
      const addresses = await addressesApi.list();
      setData({ addresses, error: null });
    } catch (error: any) {
      console.error('Failed to remove address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setLoading(true);
    try {
      await addressesApi.setDefault(id);
      const addresses = await addressesApi.list();
      setData({ addresses, error: null });
    } catch (error: any) {
      console.error('Failed to set default address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">My Addresses</h1>
            <p className="mt-1 text-sm text-ink-400">Manage your saved addresses for bookings</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-indigo-900 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {data.error && (
          <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Failed to load addresses. Please refresh the page.
          </div>
        )}

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 flex items-center gap-2 rounded-full border border-ink-900/12 px-6 py-3 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
          >
            <Plus size={18} /> Add New Address
          </button>
        )}

        {/* Add Address Form */}
        {showForm && (
          <div className="mb-6 rounded-xl2 border border-ink-900/8 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink-900">Add New Address</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="label" className="block text-xs font-medium text-ink-700">
                  Label (e.g., Home, Office)
                </label>
                <input
                  id="label"
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                  placeholder="Home"
                />
                {errors.label && <p className="mt-1 text-xs text-red-600">{errors.label}</p>}
              </div>
              <div>
                <label htmlFor="fullAddress" className="block text-xs font-medium text-ink-700">
                  Full Address
                </label>
                <input
                  id="fullAddress"
                  type="text"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                  placeholder="House 12, Ward 5, Baneshwor"
                />
                {errors.fullAddress && <p className="mt-1 text-xs text-red-600">{errors.fullAddress}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-ink-700">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                    placeholder="Kathmandu"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="district" className="block text-xs font-medium text-ink-700">
                    District
                  </label>
                  <input
                    id="district"
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                    placeholder="Kathmandu"
                  />
                  {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="ward" className="block text-xs font-medium text-ink-700">
                  Ward (Optional)
                </label>
                <input
                  id="ward"
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                  placeholder="5"
                />
              </div>
              <div>
                <label htmlFor="instructions" className="block text-xs font-medium text-ink-700">
                  Instructions (Optional)
                </label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                  placeholder="Landmark, gate color, etc."
                />
              </div>
              {errors.submit && <p className="text-xs text-red-600">{errors.submit}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:opacity-40"
                >
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      label: '',
                      fullAddress: '',
                      city: '',
                      district: '',
                      ward: '',
                      instructions: '',
                    });
                    setErrors({});
                  }}
                  className="rounded-full border border-ink-900/12 px-6 py-3 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {loading && !showForm ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
          </div>
        ) : data.addresses.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
            <MapPin size={48} className="mx-auto text-ink-200" />
            <p className="mt-4 text-sm text-ink-400">No saved addresses yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-full bg-indigo-900 px-6 py-2 text-sm font-semibold text-paper-50"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.addresses.map((address: any) => (
              <div key={address.id} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink-900">{address.label}</p>
                      {address.isDefault && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ink-700">{address.fullAddress}</p>
                    <p className="mt-1 text-sm text-ink-400">
                      {address.city}, {address.district}
                      {address.ward && `, Ward ${address.ward}`}
                    </p>
                    {address.instructions && (
                      <p className="mt-1 text-xs text-ink-400">{address.instructions}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={loading}
                        className="rounded-full p-2 text-ink-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-40"
                        aria-label="Set as default"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(address.id)}
                      disabled={loading}
                      className="rounded-full p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                      aria-label="Remove address"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
