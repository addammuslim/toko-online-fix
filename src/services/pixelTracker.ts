import { StorageService } from './storage';

const trackedPurchases = new Set<string>();

export interface TrackEventParams {
  content_name?: string;
  content_id?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  [key: string]: any;
}

export function trackEvent(eventName: string, params: TrackEventParams = {}): void {
  const settings = StorageService.getSettings();

  // Deduplication for Purchase event
  if (eventName === 'Purchase' && params.order_id) {
    if (trackedPurchases.has(params.order_id)) {
      console.warn(`[Pixel Tracker] Purchase event for order ${params.order_id} already tracked. Skipping deduplicate.`);
      return;
    }
    trackedPurchases.add(params.order_id);
  }

  // 1. Meta / Facebook Pixel
  if (settings.fbPixelId) {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', eventName, params);
    } else {
      console.log(`[FB Pixel Sim] ID:${settings.fbPixelId} -> track('${eventName}',`, params, `)`);
    }
  }

  // 2. TikTok Pixel
  if (settings.tiktokPixelId) {
    if (typeof (window as any).ttq === 'function') {
      (window as any).ttq.track(eventName, params);
    } else {
      console.log(`[TikTok Pixel Sim] ID:${settings.tiktokPixelId} -> track('${eventName}',`, params, `)`);
    }
  }

  // 3. Google Analytics / GTM
  if (settings.gaMeasurementId) {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, params);
    } else {
      console.log(`[GA4 Sim] ID:${settings.gaMeasurementId} -> event('${eventName}',`, params, `)`);
    }
  }

  // 4. Internal Activity Logger
  let category: 'page_view' | 'product_view' | 'cart' | 'checkout' | 'payment' | 'whatsapp' | 'admin_action' = 'page_view';
  if (eventName === 'ViewContent') category = 'product_view';
  else if (eventName === 'AddToCart') category = 'cart';
  else if (eventName === 'InitiateCheckout') category = 'checkout';
  else if (eventName === 'Purchase') category = 'payment';
  else if (eventName === 'Contact' || eventName === 'WhatsAppClick') category = 'whatsapp';

  const details = `${eventName}: ${params.content_name || params.order_id || params.search_string || 'Action'}${
    params.value ? ` (Rp ${params.value.toLocaleString('id-ID')})` : ''
  }`;

  StorageService.addLog(eventName, category, details, params);
}
