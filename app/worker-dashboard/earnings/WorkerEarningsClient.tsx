"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, Calendar, Wallet, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { earningsApi } from "@/lib/api";

interface WorkerEarningsData {
  earnings: any;
  payouts: any[];
  error: string | null;
}

export default function WorkerEarningsClient({ initialData }: { initialData: WorkerEarningsData }) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

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

  const paginatedPayouts = data.payouts.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(data.payouts.length / pageSize);

  const handleRequestPayout = async () => {
    setLoading(true);
    try {
      await earningsApi.request();
      const payouts = await earningsApi.payouts(0, 50);
      setData({ ...data, payouts });
    } catch (error: any) {
      console.error('Failed to request payout:', error);
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
            <h1 className="font-display text-2xl font-bold text-ink-900">My Earnings</h1>
            <p className="mt-1 text-sm text-ink-400">View your earnings and payout history</p>
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
            Failed to load earnings data. Please refresh the page.
          </div>
        )}

        {/* Earnings Summary */}
        {data.earnings && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
              <p className="text-xs text-ink-400">Total Earnings</p>
              <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                Rs {data.earnings.totalEarnings || 0}
              </p>
            </div>
            <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
              <p className="text-xs text-ink-400">Available Balance</p>
              <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                Rs {data.earnings.availableBalance || 0}
              </p>
            </div>
            <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
              <p className="text-xs text-ink-400">Pending Payouts</p>
              <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                Rs {data.earnings.pendingPayouts || 0}
              </p>
            </div>
          </div>
        )}

        {/* Request Payout */}
        <div className="mb-8">
          <button
            onClick={handleRequestPayout}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:opacity-40"
          >
            <Wallet size={18} />
            {loading ? 'Requesting...' : 'Request Payout'}
          </button>
        </div>

        {/* Payout History */}
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900">Payout History</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
            </div>
          ) : paginatedPayouts.length === 0 ? (
            <div className="mt-4 rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
              <DollarSign size={48} className="mx-auto text-ink-200" />
              <p className="mt-4 text-sm text-ink-400">No payouts yet</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {paginatedPayouts.map((payout: any) => (
                <div key={payout.id} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink-900">Rs {payout.amount}</p>
                      <p className="mt-1 text-sm text-ink-400">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      payout.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : payout.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {payout.status}
                    </span>
                  </div>
                  {payout.referenceId && (
                    <p className="mt-2 text-xs text-ink-400">Reference: {payout.referenceId}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full border border-ink-900/12 p-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-ink-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded-full border border-ink-900/12 p-2 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
