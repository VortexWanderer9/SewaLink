import { useEffect, useRef, useState, useCallback } from 'react';

type RealtimeSocketEvent =
  | { kind: 'notification:new'; payload: any }
  | { kind: 'message:new'; payload: any }
  | { kind: 'typing:update'; payload: { userId: string; isTyping: boolean } }
  | { kind: 'socket:connected' }
  | { kind: 'socket:disconnected' };

export type RealtimeListener = (event: RealtimeSocketEvent) => void;

export class SewaLinkRealtime {
  private notificationsSocket: any = null;
  private chatSocket: any = null;
  private listeners = new Set<RealtimeListener>();
  private userId: string | null = null;
  private baseUrl: string;
  private ioClient: any = null;
  private initialized = false;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      (typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : 'http://localhost:3001');
  }

  async ensureIO() {
    if (!this.ioClient) {
      const mod: any = await import('socket.io-client');
      this.ioClient = mod.io ?? mod.default?.io ?? mod.default ?? mod;
    }
    return this.ioClient;
  }

  subscribe(listener: RealtimeListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: RealtimeSocketEvent) {
    for (const l of this.listeners) l(event);
  }

  async connect(userId: string, token?: string, sessionIds: string[] = []) {
    if (this.initialized && this.userId === userId) return;
    this.userId = userId;
    const io = await this.ensureIO();

    this.notificationsSocket = io(`${this.baseUrl}/notifications`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: { userId },
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });

    this.notificationsSocket.on('connect', () => this.emit({ kind: 'socket:connected' }));
    this.notificationsSocket.on('disconnect', () => this.emit({ kind: 'socket:disconnected' }));
    this.notificationsSocket.on('notification:new', (p: any) =>
      this.emit({ kind: 'notification:new', payload: p }),
    );

    this.chatSocket = io(`${this.baseUrl}/chat`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: { userId },
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });

    this.chatSocket.on('message:new', (p: any) => this.emit({ kind: 'message:new', payload: p }));
    this.chatSocket.on('typing:update', (p: any) => this.emit({ kind: 'typing:update', payload: p }));

    for (const sid of sessionIds) this.joinSession(sid);
    this.initialized = true;
  }

  disconnect() {
    if (this.notificationsSocket) {
      this.notificationsSocket.disconnect();
      this.notificationsSocket = null;
    }
    if (this.chatSocket) {
      this.chatSocket.disconnect();
      this.chatSocket = null;
    }
    this.initialized = false;
    this.userId = null;
  }

  joinSession(sessionId: string) {
    this.chatSocket?.emit('session:join', { sessionId });
  }

  sendTyping(sessionId: string, isTyping: boolean) {
    this.chatSocket?.emit('typing', { sessionId, isTyping });
  }

  sendPing() {
    this.notificationsSocket?.emit('ping', { ts: Date.now() });
  }
}

let sharedInstance: SewaLinkRealtime | null = null;
export function getRealtime(): SewaLinkRealtime {
  if (!sharedInstance) sharedInstance = new SewaLinkRealtime();
  return sharedInstance;
}

export function useRealtime(userId: string | undefined | null, token?: string | null) {
  const [connected, setConnected] = useState(false);
  const lastEvent = useRef<RealtimeSocketEvent | null>(null);
  const [, forceRender] = useState(0);

  const onEvent = useCallback((ev: RealtimeSocketEvent) => {
    lastEvent.current = ev;
    if (ev.kind === 'socket:connected') setConnected(true);
    if (ev.kind === 'socket:disconnected') setConnected(false);
    forceRender(n => n + 1);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const realtime = getRealtime();
    const unsub = realtime.subscribe(onEvent);
    realtime.connect(userId, token ?? undefined);
    return () => {
      unsub();
    };
  }, [userId, token, onEvent]);

  return { connected, lastEvent: lastEvent.current, getRealtime };
}
