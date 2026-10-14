import { WebSettings, Product } from '../types';

export function updatePageSeo(
  settings: WebSettings,
  pageTitle?: string,
  pageDescription?: string,
  pageImage?: string,
  product?: Product
): void {
  const storeName = settings.storeName || 'Nusantara Heritage Store';
  const tagline = settings.tagline || 'Toko Online, POS & Laporan Keuangan';
  const finalTitle = pageTitle
    ? `${pageTitle} | ${storeName}`
    : `${storeName} - ${tagline}`;

  const finalDesc =
    pageDescription ||
    settings.metaDescription ||
    'Platform Toko Online & POS Lengkap dengan Laporan Laba Rugi, Manajemen Pengeluaran, Promo & Loyalty Bertingkat, Pelacakan Resi RajaOngkir, dan Akun Member.';

  const finalImage =
    pageImage ||
    settings.logoImageUrl ||
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200&auto=format&fit=crop&q=80';

  const currentUrl = window.location.href;

  // 1. Update Title
  document.title = finalTitle;

  // 2. Helper to set/create meta tag
  const setMetaTag = (attribute: string, attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, attrValue);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  // Standard Meta Tags
  setMetaTag('name', 'description', finalDesc);
  setMetaTag(
    'name',
    'keywords',
    settings.metaKeywords ||
      'toko online, batik nusantara, kopi single origin, moka pos, pos kasir, rajaongkir, promo voucher, loyalty reward, laporan laba rugi, umkm indonesia'
  );
  setMetaTag('name', 'author', storeName);
  setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMetaTag('name', 'theme-color', settings.primaryColor || '#059669');

  // OpenGraph Tags
  setMetaTag('property', 'og:type', product ? 'product' : 'website');
  setMetaTag('property', 'og:site_name', storeName);
  setMetaTag('property', 'og:title', finalTitle);
  setMetaTag('property', 'og:description', finalDesc);
  setMetaTag('property', 'og:image', finalImage);
  setMetaTag('property', 'og:url', currentUrl);
  setMetaTag('property', 'og:locale', 'id_ID');

  // Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', finalTitle);
  setMetaTag('name', 'twitter:description', finalDesc);
  setMetaTag('name', 'twitter:image', finalImage);

  // Canonical Link
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = currentUrl.split('#')[0];

  // Dynamic Favicon
  if (settings.faviconUrl) {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = settings.faviconUrl;
  }

  // Schema.org JSON-LD Structured Data
  updateStructuredData(settings, product, currentUrl);
}

function updateStructuredData(settings: WebSettings, product?: Product, currentUrl: string = ''): void {
  const storeName = settings.storeName || 'Nusantara Heritage Store';
  const scriptId = 'schema-jsonld-dynamic';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OnlineStore',
        '@id': `${currentUrl}#store`,
        name: storeName,
        description: settings.metaDescription || settings.tagline || 'Toko Online & POS Terpadu Warisan Budaya Nusantara',
        url: window.location.origin,
        telephone: `+${settings.whatsappNumber || '628123456789'}`,
        currenciesAccepted: 'IDR',
        paymentAccepted: 'Cash, QRIS, Bank Transfer, Midtrans, Credit Card',
        priceRange: 'Rp 20.000 - Rp 5.000.000',
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address || 'Jl. Malioboro No. 88',
          addressLocality: settings.originCity || 'Kota Yogyakarta',
          addressRegion: settings.originProvince || 'D.I. Yogyakarta',
          postalCode: settings.originPostalCode || '55271',
          addressCountry: 'ID'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${currentUrl}#website`,
        url: window.location.origin,
        name: storeName,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/#/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  if (product) {
    structuredData['@graph'].push({
      '@type': 'Product',
      '@id': `${currentUrl}#product`,
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: storeName
      },
      offers: {
        '@type': 'Offer',
        url: currentUrl,
        priceCurrency: 'IDR',
        price: product.promoPrice || product.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: storeName
        }
      }
    });
  }

  script.textContent = JSON.stringify(structuredData);
}
