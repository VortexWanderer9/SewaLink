export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  skip: number;
  take: number;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3001/api/v1`
    : 'http://localhost:3001/api/v1');

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('sewalink_token', token);
    else localStorage.removeItem('sewalink_token');
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined' && !authToken) {
    authToken = localStorage.getItem('sewalink_token');
  }
  return authToken;
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  let body: any;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const err = new Error(body?.message || body?.error || `HTTP ${res.status}`);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return body as T;
}

export type AuthUser = {
  id: string;
  role: 'CUSTOMER' | 'WORKER' | 'ADMIN';
  fullName: string;
  email: string | null;
  phone: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationStatus?: string;
  workerProfileId?: string;
};

export type RegisterCustomerInput = {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  address?: {
    label: string;
    fullAddress: string;
    city: string;
    district: string;
    ward?: string;
    instructions?: string;
  };
};

export type RegisterWorkerInput = {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  categorySlug: string;
  location: string;
  bio?: string;
  yearsExperience?: number;
  priceFrom?: number;
};

export type LoginInput = { phone?: string; email?: string; password: string };

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export const authApi = {
  registerCustomer: (dto: RegisterCustomerInput) =>
    apiFetch<AuthResponse>('/auth/register/customer', { method: 'POST', body: JSON.stringify(dto) }),
  registerWorker: (dto: RegisterWorkerInput) =>
    apiFetch<AuthResponse>('/auth/register/worker', { method: 'POST', body: JSON.stringify(dto) }),
  login: (dto: LoginInput) =>
    apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
  refresh: (refreshToken?: string) =>
    apiFetch<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  logout: (all?: boolean) => apiFetch<any>('/auth/logout', { method: 'POST', body: JSON.stringify({ all }) }),
  sendOtp: (phone: string) =>
    apiFetch<any>('/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (otp: string) =>
    apiFetch<any>('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ otp }) }),
};

export type Category = {
  slug: string;
  name: string;
  nameNe: string;
  blurb: string;
  avgPrice: string;
  iconName?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { workers: number };
};

export const categoriesApi = {
  list: () => apiFetch<Category[]>('/categories'),
  get: (slug: string) => apiFetch<Category>(`/categories/${slug}`),
};

export type WorkerProfile = {
  id: string;
  userId: string;
  categorySlug: string;
  bio: string | null;
  yearsExperience: number;
  priceFrom: number;
  priceTo: number | null;
  location: string;
  verificationStatus: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  totalReviews: number;
  totalJobsDone: number;
  totalEarnings: number;
  responseTimeMinutes: number | null;
  isOnline: boolean;
  gulfReturnee: boolean;
  foreignCountryExp: string | null;
  user: { id: string; fullName: string; avatarUrl: string | null; isPhoneVerified: boolean };
  category: Category;
  badges: { badge: { id: string; name: string; color: string | null; description: string | null } }[];
  availability: { id: string; dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }[];
};

export const workersApi = {
  search: (params?: {
    category?: string;
    query?: string;
    location?: string;
    minRating?: number;
    maxPrice?: number;
    verifiedOnly?: boolean;
    onlineOnly?: boolean;
    sort?: 'rating' | 'price_asc' | 'price_desc' | 'jobs_desc';
    skip?: number;
    take?: number;
  }) => {
    const qp = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qp.append(k, String(v));
      });
    }
    return apiFetch<PaginatedResponse<WorkerProfile>>(`/workers/search?${qp.toString()}`);
  },
  getById: (id: string) => apiFetch<WorkerProfile>(`/workers/${id}`),
  getMyProfile: () => apiFetch<WorkerProfile>('/workers/me/profile'),
  updateMyProfile: (dto: any) =>
    apiFetch<WorkerProfile>('/workers/me/profile', { method: 'PUT', body: JSON.stringify(dto) }),
  setOnline: (isOnline: boolean) =>
    apiFetch<any>('/workers/me/online', { method: 'PATCH', body: JSON.stringify({ isOnline }) }),
  getMyBookings: (status?: string, skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (status) qp.append('status', status);
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<any[]>(`/workers/me/bookings?${qp.toString()}`);
  },
  getMyEarnings: () => apiFetch<any>('/workers/me/earnings'),
  updateVerification: (id: string, status: string, notes?: string) =>
    apiFetch<any>(`/workers/${id}/verification`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
};

export type Booking = {
  id: string;
  customerId: string;
  workerId: string;
  categorySlug: string;
  status: string;
  scheduledAt: string;
  durationMinutes?: number;
  addressText: string;
  description?: string;
  notes?: string;
  basePrice: number;
  partsPrice: number;
  tipAmount: number;
  platformFee: number;
  totalAmount: number;
  workerEarnings: number;
  paidAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  arrivedAt?: string;
  startedAt?: string;
  createdAt: string;
  customer?: { id: string; fullName: string; phone: string; avatarUrl?: string | null };
  worker?: { id: string; fullName: string; phone: string; avatarUrl?: string | null };
  category?: Category;
  payments?: any[];
  reviews?: any[];
};

export const bookingsApi = {
  create: (dto: any) => apiFetch<Booking>('/bookings', { method: 'POST', body: JSON.stringify(dto) }),
  getMy: (status?: string, skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (status) qp.append('status', status);
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<Booking[]>(`/bookings/me?${qp.toString()}`);
  },
  get: (id: string) => apiFetch<Booking>(`/bookings/${id}`),
  updateStatus: (id: string, status: string, extra?: any) =>
    apiFetch<Booking>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, ...extra }) }),
  reschedule: (id: string, scheduledAt: string, reason?: string) =>
    apiFetch<Booking>(`/bookings/${id}/reschedule`, { method: 'PUT', body: JSON.stringify({ scheduledAt, reason }) }),
};

export const paymentsApi = {
  initiate: (bookingId: string, method: string, metadata?: any) =>
    apiFetch<any>('/payments/initiate', { method: 'POST', body: JSON.stringify({ bookingId, method, metadata }) }),
  verifyEsewa: (oid: string, amt: string, refId: string) =>
    apiFetch<any>('/payments/esewa/verify', { method: 'POST', body: JSON.stringify({ oid, amt, refId }) }),
  verifyKhalti: (token: string, amount: number, bookingId: string) =>
    apiFetch<any>('/payments/khalti/verify', { method: 'POST', body: JSON.stringify({ token, amount, bookingId }) }),
  verifyImepay: (paymentId: string, transactionId: string) =>
    apiFetch<any>('/payments/imepay/verify', { method: 'POST', body: JSON.stringify({ paymentId, transactionId }) }),
  markCashPaid: (bookingId: string) =>
    apiFetch<any>(`/payments/${bookingId}/cash-paid`, { method: 'POST' }),
  byBooking: (bookingId: string) => apiFetch<any[]>(`/payments/booking/${bookingId}`),
  refund: (paymentId: string, reason: string, partialAmount?: number) =>
    apiFetch<any>(`/payments/${paymentId}/refund`, { method: 'PATCH', body: JSON.stringify({ reason, partialAmount }) }),
};

export const reviewsApi = {
  create: (bookingId: string, rating: number, comment?: string) =>
    apiFetch<any>('/reviews', { method: 'POST', body: JSON.stringify({ bookingId, rating, comment }) }),
  byWorker: (workerUserId: string, skip?: number, take?: number, minRating?: number) => {
    const qp = new URLSearchParams();
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    if (minRating) qp.append('minRating', String(minRating));
    return apiFetch<any[]>(`/reviews/worker/${workerUserId}?${qp.toString()}`);
  },
  byBooking: (bookingId: string) => apiFetch<any[]>(`/reviews/booking/${bookingId}`),
  remove: (id: string) => apiFetch<any>(`/reviews/${id}`, { method: 'DELETE' }),
};

export const notificationsApi = {
  list: (isRead?: boolean, skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (isRead !== undefined) qp.append('isRead', String(isRead));
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<any[]>(`/notifications?${qp.toString()}`);
  },
  unreadCount: () => apiFetch<number>('/notifications/unread-count'),
  markRead: (id: string) => apiFetch<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => apiFetch<any>('/notifications/read-all', { method: 'PATCH' }),
};

export const usersApi = {
  me: () => apiFetch<any>('/users/me'),
  updateMe: (dto: any) => apiFetch<any>('/users/me', { method: 'PUT', body: JSON.stringify(dto) }),
  list: (role?: string, q?: string, skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (role) qp.append('role', role);
    if (q) qp.append('q', q);
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<PaginatedResponse<any>>(`/users?${qp.toString()}`);
  },
  setActive: (id: string, isActive: boolean) =>
    apiFetch<any>(`/users/${id}/active`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  remove: (id: string) => apiFetch<any>(`/users/${id}`, { method: 'DELETE' }),
};

export const customersApi = {
  dashboard: () => apiFetch<any>('/customers/me/dashboard'),
  history: (skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<any[]>(`/customers/me/history?${qp.toString()}`);
  },
};

export const addressesApi = {
  list: () => apiFetch<any[]>('/addresses'),
  get: (id: string) => apiFetch<any>(`/addresses/${id}`),
  create: (dto: any) => apiFetch<any>('/addresses', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch<any>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  remove: (id: string) => apiFetch<any>(`/addresses/${id}`, { method: 'DELETE' }),
  setDefault: (id: string) => apiFetch<any>(`/addresses/${id}/default`, { method: 'PATCH' }),
};

export const documentsApi = {
  list: () => apiFetch<any[]>('/documents'),
  upload: async (files: File[], types: string[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    fd.append('types', types.join(','));
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    return res.json();
  },
  verify: (id: string, isVerified: boolean, notes?: string) =>
    apiFetch<any>(`/documents/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ isVerified, notes }) }),
  remove: (id: string) => apiFetch<any>(`/documents/${id}`, { method: 'DELETE' }),
};

export const earningsApi = {
  mine: (from?: string, to?: string) => {
    const qp = new URLSearchParams();
    if (from) qp.append('from', from);
    if (to) qp.append('to', to);
    return apiFetch<any>(`/earnings/me?${qp.toString()}`);
  },
  payouts: (skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<any[]>(`/earnings/me/payouts?${qp.toString()}`);
  },
  request: (amount?: number) =>
    apiFetch<any>('/earnings/me/request', { method: 'POST', body: JSON.stringify({ amount }) }),
  processPayout: (payoutId: string, status: string, referenceId?: string, notes?: string) =>
    apiFetch<any>(`/earnings/admin/payouts/${payoutId}`, { method: 'PATCH', body: JSON.stringify({ status, referenceId, notes }) }),
};

export const favoritesApi = {
  list: () => apiFetch<any[]>('/favorites'),
  add: (workerProfileId: string) =>
    apiFetch<any>('/favorites', { method: 'POST', body: JSON.stringify({ workerProfileId }) }),
  removeByWorker: (workerProfileId: string) =>
    apiFetch<any>(`/favorites/by-worker/${workerProfileId}`, { method: 'DELETE' }),
  remove: (id: string) => apiFetch<any>(`/favorites/${id}`, { method: 'DELETE' }),
};

export const chatApi = {
  sessions: () => apiFetch<any[]>('/chat/sessions'),
  getOrCreateSession: (otherUserId: string, bookingId?: string) =>
    apiFetch<any>('/chat/session', { method: 'POST', body: JSON.stringify({ otherUserId, bookingId }) }),
  messages: (sessionId: string, skip?: number, take?: number) => {
    const qp = new URLSearchParams();
    if (skip) qp.append('skip', String(skip));
    if (take) qp.append('take', String(take));
    return apiFetch<any[]>(`/chat/sessions/${sessionId}/messages?${qp.toString()}`);
  },
  sendMessage: (sessionId: string, content: string, type?: string, mediaUrl?: string) =>
    apiFetch<any>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type, mediaUrl }),
    }),
};

export const adminApi = {
  dashboardOverview: () => apiFetch<any>('/admin/dashboard/overview'),
  systemHealth: () => apiFetch<any>('/admin/system/health'),
  reports: (type: string, from?: string, to?: string, format?: string) => {
    const qp = new URLSearchParams();
    qp.append('type', type);
    if (from) qp.append('from', from);
    if (to) qp.append('to', to);
    if (format) qp.append('format', format);
    return apiFetch<any>(`/admin/reports?${qp.toString()}`);
  },
};

export const auditApi = {
  list: (params?: { action?: string; entityType?: string; userId?: string; skip?: number; take?: number }) => {
    const qp = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && qp.append(k, String(v)));
    return apiFetch<any>(`/audit?${qp.toString()}`);
  },
};
