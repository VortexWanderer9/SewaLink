"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { workersApi } from "@/lib/api";

interface WorkerProfileData {
  profile: any;
  error: string | null;
}

export default function WorkerProfileClient({ initialData }: { initialData: WorkerProfileData }) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: data.profile?.bio || '',
    priceFrom: data.profile?.priceFrom || 0,
    priceTo: data.profile?.priceTo || 0,
    location: data.profile?.location || '',
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
    if (formData.priceFrom < 0) newErrors.priceFrom = 'Price must be at least 0';
    if (formData.priceTo && formData.priceTo < formData.priceFrom) {
      newErrors.priceTo = 'Maximum price must be greater than minimum price';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await workersApi.updateMyProfile(formData);
      const profile = await workersApi.getMyProfile();
      setData({ profile, error: null });
      setEditing(false);
      setErrors({});
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: error.message || 'Failed to update profile' });
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
            <h1 className="font-display text-2xl font-bold text-ink-900">My Profile</h1>
            <p className="mt-1 text-sm text-ink-400">Manage your worker profile and availability</p>
          </div>
          <Link
            href="/worker-dashboard"
            className="text-sm font-medium text-indigo-900 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {data.error && (
          <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Failed to load profile. Please refresh the page.
          </div>
        )}

        {/* Profile Info */}
        <div className="space-y-6">
          <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 rounded-full border border-ink-900/12 px-4 py-2 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  <User size={18} /> Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-xs font-medium text-ink-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                    placeholder="Describe your skills and experience"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="priceFrom" className="block text-xs font-medium text-ink-700">
                      Starting Price (Rs)
                    </label>
                    <input
                      id="priceFrom"
                      type="number"
                      value={formData.priceFrom}
                      onChange={(e) => setFormData({ ...formData, priceFrom: parseInt(e.target.value) || 0 })}
                      className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                      placeholder="500"
                    />
                    {errors.priceFrom && <p className="mt-1 text-xs text-red-600">{errors.priceFrom}</p>}
                  </div>
                  <div>
                    <label htmlFor="priceTo" className="block text-xs font-medium text-ink-700">
                      Maximum Price (Rs, Optional)
                    </label>
                    <input
                      id="priceTo"
                      type="number"
                      value={formData.priceTo}
                      onChange={(e) => setFormData({ ...formData, priceTo: parseInt(e.target.value) || 0 })}
                      className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                      placeholder="2000"
                    />
                    {errors.priceTo && <p className="mt-1 text-xs text-red-600">{errors.priceTo}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-xs font-medium text-ink-700">
                    Service Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                    placeholder="Kathmandu, Lalitpur, Bhaktapur"
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                </div>
                {errors.submit && <p className="text-xs text-red-600">{errors.submit}</p>}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:opacity-40"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        bio: data.profile?.bio || '',
                        priceFrom: data.profile?.priceFrom || 0,
                        priceTo: data.profile?.priceTo || 0,
                        location: data.profile?.location || '',
                      });
                      setErrors({});
                    }}
                    className="rounded-full border border-ink-900/12 px-6 py-3 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-ink-400">Name</p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{data.profile?.user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Category</p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{data.profile?.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Bio</p>
                  <p className="mt-1 text-sm text-ink-700">{data.profile?.bio || 'No bio provided'}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-ink-400">Starting Price</p>
                    <p className="mt-1 text-sm font-medium text-ink-900">Rs {data.profile?.priceFrom || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-400">Maximum Price</p>
                    <p className="mt-1 text-sm font-medium text-ink-900">{data.profile?.priceTo ? `Rs ${data.profile.priceTo}` : 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Location</p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{data.profile?.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Years of Experience</p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{data.profile?.yearsExperience || 0} years</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Verification Status</p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{data.profile?.verificationStatus || 'Pending'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink-900 mb-4">Performance Stats</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-ink-400">Total Jobs</p>
                <p className="mt-2 font-display text-xl font-bold text-indigo-900">{data.profile?.totalJobsDone || 0}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Rating</p>
                <p className="mt-2 font-display text-xl font-bold text-indigo-900">{data.profile?.rating || 0}.0</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Reviews</p>
                <p className="mt-2 font-display text-xl font-bold text-indigo-900">{data.profile?.totalReviews || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
