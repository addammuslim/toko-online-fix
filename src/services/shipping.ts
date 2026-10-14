import { CourierOption, WebSettings } from '../types';

export interface LocationData {
  province: string;
  cities: {
    city: string;
    subdistricts: string[];
  }[];
}

export const INDONESIA_LOCATIONS: LocationData[] = [
  {
    province: 'DKI Jakarta',
    cities: [
      {
        city: 'Jakarta Selatan',
        subdistricts: ['Kebayoran Baru', 'Kebayoran Lama', 'Cilandak', 'Pasar Minggu', 'Tebet', 'Setiabudi', 'Pancoran']
      },
      {
        city: 'Jakarta Pusat',
        subdistricts: ['Gambir', 'Menteng', 'Tanah Abang', 'Senen', 'Cempaka Putih', 'Johar Baru']
      },
      {
        city: 'Jakarta Barat',
        subdistricts: ['Kebon Jeruk', 'Palmerah', 'Grogol Petamburan', 'Kembangan', 'Kalideres']
      },
      {
        city: 'Jakarta Timur',
        subdistricts: ['Matraman', 'Pulo Gadung', 'Jatinegara', 'Duren Sawit', 'Kramat Jati']
      },
      {
        city: 'Jakarta Utara',
        subdistricts: ['Kelapa Gading', 'Tanjung Priok', 'Penjaringan', 'Pademangan']
      }
    ]
  },
  {
    province: 'Jawa Barat',
    cities: [
      {
        city: 'Kota Bandung',
        subdistricts: ['Coblong', 'Cicendo', 'Sumur Bandung', 'Lengkong', 'Buahbatu', 'Cidadap']
      },
      {
        city: 'Kota Bekasi',
        subdistricts: ['Bekasi Barat', 'Bekasi Timur', 'Bekasi Selatan', 'Bekasi Utara', 'Pondok Gede']
      },
      {
        city: 'Kota Bogor',
        subdistricts: ['Bogor Tengah', 'Bogor Utara', 'Bogor Selatan', 'Bogor Timur', 'Bogor Barat']
      },
      {
        city: 'Kota Depok',
        subdistricts: ['Pancoran Mas', 'Sukmajaya', 'Beji', 'Cimanggis', 'Cinere']
      }
    ]
  },
  {
    province: 'D.I. Yogyakarta',
    cities: [
      {
        city: 'Kota Yogyakarta',
        subdistricts: ['Gedong Tengen', 'Danurejan', 'Kraton', 'Gondomanan', 'Mantrijeron', 'Umbulharjo', 'Kotagede']
      },
      {
        city: 'Kabupaten Sleman',
        subdistricts: ['Depok', 'Mlati', 'Ngaglik', 'Gamping', 'Kalasan', 'Sleman']
      },
      {
        city: 'Kabupaten Bantul',
        subdistricts: ['Bantul', 'Banguntapan', 'Sewon', 'Kasihan', 'Piyungan']
      }
    ]
  },
  {
    province: 'Jawa Tengah',
    cities: [
      {
        city: 'Kota Semarang',
        subdistricts: ['Semarang Tengah', 'Semarang Barat', 'Semarang Selatan', 'Semarang Timur', 'Banyumanik']
      },
      {
        city: 'Kota Surakarta (Solo)',
        subdistricts: ['Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon', 'Serengan']
      },
      {
        city: 'Kota Pekalongan',
        subdistricts: ['Pekalongan Barat', 'Pekalongan Timur', 'Pekalongan Utara', 'Pekalongan Selatan']
      }
    ]
  },
  {
    province: 'Jawa Timur',
    cities: [
      {
        city: 'Kota Surabaya',
        subdistricts: ['Tegalsari', 'Genteng', 'Gubeng', 'Wonokromo', 'Rungkut', 'Sukolilo']
      },
      {
        city: 'Kota Malang',
        subdistricts: ['Klojen', 'Blimbing', 'Lowokwaru', 'Sukun', 'Kedungkandang']
      }
    ]
  },
  {
    province: 'Bali',
    cities: [
      {
        city: 'Kota Denpasar',
        subdistricts: ['Denpasar Selatan', 'Denpasar Barat', 'Denpasar Utara', 'Denpasar Timur']
      },
      {
        city: 'Kabupaten Badung',
        subdistricts: ['Kuta', 'Kuta Utara', 'Kuta Selatan', 'Mengwi']
      }
    ]
  }
];

export function calculateShippingOptions(
  settings: WebSettings,
  destProvince: string,
  destCity: string,
  totalWeightGrams: number,
  subtotal: number
): CourierOption[] {
  const isFreeEligible = settings.enableFreeShipping && subtotal >= settings.freeShippingMinSpend;
  const weightKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));

  let baseRatePerKg = 18000;
  if (destProvince === settings.originProvince) {
    baseRatePerKg = 10000;
    if (destCity === settings.originCity) {
      baseRatePerKg = 8000;
    }
  } else if (['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur'].includes(destProvince)) {
    baseRatePerKg = 16000;
  } else if (destProvince === 'Bali') {
    baseRatePerKg = 24000;
  } else {
    baseRatePerKg = 32000;
  }

  if (settings.enableFlatRate) {
    return [
      {
        code: 'flatrate',
        name: 'Ekspedisi Reguler',
        service: 'Flat Rate',
        description: 'Tarif Pengiriman Tetap Toko',
        cost: isFreeEligible ? 0 : settings.flatRateShipping,
        etd: '2-3 Hari'
      }
    ];
  }

  const options: CourierOption[] = [];

  if (isFreeEligible) {
    options.push({
      code: 'free-shipping',
      name: 'Bebas Ongkir Promo',
      service: 'Gratis Ongkir Seluruh ID',
      description: 'Promo Spesial Belanja di atas Rp ' + settings.freeShippingMinSpend.toLocaleString('id-ID'),
      cost: 0,
      etd: '2-4 Hari'
    });
  }

  if (settings.activeCouriers.includes('jne')) {
    options.push({
      code: 'jne-reg',
      name: 'JNE',
      service: 'REG (Reguler)',
      description: 'Layanan reguler terpercaya seluruh Indonesia',
      cost: baseRatePerKg * weightKg,
      etd: '2-3 Hari'
    });
    options.push({
      code: 'jne-yes',
      name: 'JNE',
      service: 'YES (Yakin Esok Sampai)',
      description: 'Layanan cepat estimasi 1 hari sampai',
      cost: Math.round(baseRatePerKg * 1.65 * weightKg),
      etd: '1 Hari'
    });
  }

  if (settings.activeCouriers.includes('jnt')) {
    options.push({
      code: 'jnt-ez',
      name: 'J&T Express',
      service: 'EZ (Reguler)',
      description: 'Layanan reguler tracking realtime 24 jam',
      cost: Math.round(baseRatePerKg * 0.95 * weightKg),
      etd: '2-3 Hari'
    });
  }

  if (settings.activeCouriers.includes('sicepat')) {
    options.push({
      code: 'sicepat-suntik',
      name: 'SiCepat',
      service: 'SIUNTUNG',
      description: 'Tarif hemat dengan pengiriman cepat',
      cost: Math.round(baseRatePerKg * 0.9 * weightKg),
      etd: '2-3 Hari'
    });
  }

  if (settings.activeCouriers.includes('anteraja')) {
    options.push({
      code: 'anteraja-reg',
      name: 'AnterAja',
      service: 'Reguler',
      description: 'Layanan pengiriman kurir Satria terpercaya',
      cost: Math.round(baseRatePerKg * 0.92 * weightKg),
      etd: '2-3 Hari'
    });
  }

  return options;
}
