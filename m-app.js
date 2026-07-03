/* ===================================================================
   Flee — prototipo mobile (iPhone 17). Helpers compartidos.
   Usado por: m-catalogo.html, m-scheda.html, m-preventivo.html, m-grazie.html
   Depende de: flee-library/data/cars.js (window.FLEE_CARS)
   =================================================================== */
window.MF = (function () {
  /* ---------- vehículos broker ----------
     Datos reales de promo.driveflee.com/noleggio (Supabase QuotationShowcaseView,
     representante Privato: rata = flatMonthlyRateTax iva incl., anticipo = advanceTax). */
  const BROKER_CARS = [
    {
      slug: 'peugeot-208-ii-2023', kind: 'broker',
      brand: 'Peugeot', name: '208 II 2023', modification: '208 1.2 turbo Edition 100cv',
      typology: 'Compatta', doors: 5, seats: 5, gearbox: 'Manuale', fuel: 'Benzina',
      power: 100, displacement: 1199,
      duration: '36', advance: 3660, distance: '10000', priceFlat: 254.98,
      priceFix: 254.98, priceVariable: 0.24,
      secondhand: false, fastDelivery: false, deliveryEta: null, newLicense: false,
      promo: false, label: null,
      image: 'https://vehicles-img.moov-drive.com/6aa3f2bf-f2dd-44e1-8396-41b97d95823e/2026-04-10T12%3A45%3A53.178Z-59046.507-TGF0ZXJhbGUgU2luaXN0cmE%3D',
      shortDescription: '5 porte | Manuale | Benzina',
    },
    {
      slug: 'fiat-pandina-iii-2024', kind: 'broker',
      brand: 'Fiat', name: 'Pandina III 2024', modification: 'Pandina 1.0 firefly hybrid Icon s&s 65cv 5p.ti',
      typology: 'Citycar', doors: 5, seats: 5, gearbox: 'Manuale', fuel: 'Ibrido benzina',
      power: 65, displacement: 999,
      duration: '36', advance: 2440, distance: '10000', priceFlat: 267.18,
      priceFix: 267.18, priceVariable: 0.24,
      secondhand: false, fastDelivery: false, deliveryEta: null, newLicense: true,
      promo: false, label: null,
      image: 'https://vehicles-img.moov-drive.com/fd46847a-38ba-4655-8515-5cbcc9f6488a/2025-11-06T08%3A52%3A06.237Z-370104.377-TGF0ZXJhbGUgU2luaXN0cmE%3D',
      shortDescription: '5 porte | Manuale | Ibrido benzina',
    },
    {
      slug: 'citroen-c3-iv-2024', kind: 'broker',
      brand: 'Citroen', name: 'C3 IV 2024', modification: 'C3 1.2 puretech turbo Plus 100cv s&s',
      typology: 'Citycar', doors: 5, seats: 5, gearbox: 'Manuale', fuel: 'Benzina',
      power: 100, displacement: 1199,
      duration: '36', advance: 3050, distance: '10000', priceFlat: 279.38,
      priceFix: 279.38, priceVariable: 0.24,
      secondhand: false, fastDelivery: false, deliveryEta: null, newLicense: false,
      promo: false, label: null,
      image: 'https://vehicles-img.moov-drive.com/82d64968-52a1-462b-a6eb-a701e7fc31eb/2025-09-03T07%3A53%3A29.692Z-1405004.196-TGF0ZXJhbGUgU2luaXN0cmE%3D',
      shortDescription: '5 porte | Manuale | Benzina',
    },
    {
      slug: 'opel-corsa-vi-2023', kind: 'broker',
      brand: 'Opel', name: 'Corsa VI 2023', modification: 'Corsa 1.2 Edition s&s 100cv',
      typology: 'Berlina', doors: 5, seats: 5, gearbox: 'Manuale', fuel: 'Benzina',
      power: 100, displacement: 1199,
      duration: '48', advance: 3050, distance: '10000', priceFlat: 291.58,
      priceFix: 291.58, priceVariable: 0.24,
      secondhand: false, fastDelivery: false, deliveryEta: null, newLicense: false,
      promo: false, label: null,
      image: 'https://vehicles-img.moov-drive.com/d1c8df75-7157-4bfb-8452-45380217dbee/2025-09-18T10%3A35%3A50.501Z-1035037.661-T1BFTCBDT1JTQS5wbmc%3D',
      shortDescription: '5 porte | Manuale | Benzina',
    },
  ];

  /* Catálogo = coches de la librería (todos PPU) + los 4 broker reales intercalados */
  const cars = (window.FLEE_CARS || []).slice();
  [[1, 0], [5, 1], [9, 2], [14, 3]].forEach(([pos, i]) => cars.splice(Math.min(pos, cars.length), 0, BROKER_CARS[i]));

  /* ---------- formato ---------- */
  const nf = (v, d = 0) => Number(v).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur0 = (v) => nf(Math.round(v));            // 2.500
  const money = (v) => nf(v, 2);                     // 0,24
  const monthly = (v) => nf(Math.round(v));         // 169

  /* ---------- formula (broker | ppu) ----------
     Broker = solo los vehículos reales de promo.driveflee.com; el resto PPU. */
  function kindOf(c) {
    return c.kind || 'ppu';
  }

  function carById(id) { return cars.find(c => c.slug === id) || null; }

  /* ---------- precio según formula ----------
     ppu:    priceFix €/mese + priceVariable €/km
     broker: priceFlat €/mese (incluye distance km/anno) */
  function pricing(c, kind = kindOf(c)) {
    if (kind === 'broker') {
      const base = c.priceFlat;
      const disc = c.promo && c.label ? (c.label.discount || 0) : 0;
      return { kind, monthly: base, monthlyPromo: base - disc, perKm: null, disc };
    }
    const base = c.priceFix;
    const disc = c.promo && c.label ? (c.label.discount || 0) : 0;
    return { kind, monthly: base, monthlyPromo: base - disc, perKm: c.priceVariable, disc };
  }

  /* ---------- iconos (inline svg) ---------- */
  const I = {
    car: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.25 14H5.75M18.25 14H15.75M22 9L19.4 10L18.55 6C18.3 4.85 17.3 4 16.1 4H8C6.85 4 5.85 4.8 5.55 5.95L4.65 10L2 9M3.25 20H5.5C6.35 20 7 19.35 7 18.5V17.5H17V18.5C17 19.35 17.65 20 18.5 20H20.75C21.45 20 22 19.45 22 18.75V13C22 11.35 20.65 10 19 10H5C3.35 10 2 11.35 2 13V18.75C2 19.45 2.55 20 3.25 20Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 6C5.33 6 6 5.33 6 4.5C6 3.67 5.33 3 4.5 3C3.67 3 3 3.67 3 4.5C3 5.33 3.67 6 4.5 6ZM4.5 6V18M4.5 18C3.67 18 3 18.67 3 19.5C3 20.33 3.67 21 4.5 21C5.33 21 6 20.33 6 19.5C6 18.67 5.33 18 4.5 18ZM19.5 6C20.33 6 21 5.33 21 4.5C21 3.67 20.33 3 19.5 3C18.67 3 18 3.67 18 4.5C18 5.33 18.67 6 19.5 6ZM19.5 6V9C19.5 10.66 18.16 12 16.5 12H4.5M12 6C12.83 6 13.5 5.33 13.5 4.5C13.5 3.67 12.83 3 12 3C11.17 3 10.5 3.67 10.5 4.5C10.5 5.33 11.17 6 12 6ZM12 6V18M12 18C11.17 18 10.5 18.67 10.5 19.5C10.5 20.33 11.17 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 18.67 12.83 18 12 18Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 5H13.3C14.4 5 15.4 5.4 16.1 6.2L18.8 8.9C19.6 9.6 20 10.6 20 11.7V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V7C4 5.9 4.9 5 6 5ZM6 5V3C6 2.4 6.4 2 7 2H11C11.6 2 12 2.4 12 3V5H6ZM8 14H10M8 17H12M16.6 12.6C16.1 13.1 15.3 13.1 14.8 12.6L12.3 10.1C11.8 9.6 11.8 8.8 12.3 8.3C12.8 7.8 13.6 7.8 14.1 8.3L16.6 10.8C17.1 11.3 17.1 12.1 16.6 12.6Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 8.2A8 8 0 0 1 18.4 6.4"/><path d="M4 3.6V8.2H8.6"/><path d="M19.5 15.8A8 8 0 0 1 5.6 17.6"/><path d="M20 20.4V15.8H15.4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    filter: '<svg viewBox="1535.13 802.29 16.95 16.95" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1548.48 805.079H1550.91" stroke="currentColor" stroke-width="1.05504" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1536.3 805.079H1545.23" stroke="currentColor" stroke-width="1.05504" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1541.99 810.76H1550.91" stroke="currentColor" stroke-width="1.05504" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1536.3 810.76H1538.74" stroke="currentColor" stroke-width="1.05504" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1548.48 816.441H1550.91" stroke="currentColor" stroke-width="1.05504" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1536.3 816.441H1545.23" stroke="currentColor" stroke-width="1.05504" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1546.85 806.702C1547.75 806.702 1548.48 805.975 1548.48 805.079C1548.48 804.182 1547.75 803.456 1546.85 803.456C1545.96 803.456 1545.23 804.182 1545.23 805.079C1545.23 805.975 1545.96 806.702 1546.85 806.702Z" stroke="currentColor" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1540.36 812.383C1541.26 812.383 1541.99 811.656 1541.99 810.76C1541.99 809.863 1541.26 809.137 1540.36 809.137C1539.47 809.137 1538.74 809.863 1538.74 810.76C1538.74 811.656 1539.47 812.383 1540.36 812.383Z" stroke="currentColor" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1546.85 818.064C1547.75 818.064 1548.48 817.337 1548.48 816.441C1548.48 815.544 1547.75 814.818 1546.85 814.818C1545.96 814.818 1545.23 815.544 1545.23 816.441C1545.23 817.337 1545.96 818.064 1546.85 818.064Z" stroke="currentColor" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spark: '<svg viewBox="32.66 3848.66 19.08 19.09" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M42.5426 3850.86L44.75 3850.15C45.2694 3849.98 45.8375 3850.22 46.0891 3850.7L47.1442 3852.77C47.2497 3852.98 47.4201 3853.15 47.6311 3853.26L49.6763 3854.31C50.1794 3854.57 50.4229 3855.15 50.2525 3855.69L49.5464 3857.87C49.4734 3858.1 49.4734 3858.33 49.5464 3858.56L50.2606 3860.77C50.431 3861.29 50.1957 3861.85 49.7087 3862.11L47.6392 3863.16C47.4282 3863.27 47.2578 3863.44 47.1523 3863.65L46.0972 3865.72C45.8457 3866.2 45.2776 3866.44 44.7582 3866.27L42.5507 3865.55C42.3234 3865.48 42.0881 3865.48 41.8608 3865.55L39.6534 3866.27C39.134 3866.44 38.5659 3866.2 38.3143 3865.72L37.2592 3863.65C37.1537 3863.44 36.9833 3863.27 36.7723 3863.16L34.7028 3862.11C34.2158 3861.85 33.9805 3861.29 34.1509 3860.77L34.8651 3858.56C34.9381 3858.33 34.9381 3858.1 34.8651 3857.87L34.1509 3855.66C33.9805 3855.14 34.2158 3854.57 34.7028 3854.32L36.7723 3853.27C36.9833 3853.16 37.1537 3852.99 37.2592 3852.78L38.3143 3850.71C38.5659 3850.22 39.134 3849.99 39.6534 3850.16L41.8608 3850.87C42.0881 3850.95 42.3234 3850.95 42.5507 3850.87L42.5426 3850.86Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M39.767 3860.64L44.6364 3855.77" stroke="currentColor" stroke-width="1.05504" stroke-linecap="round" stroke-linejoin="round"/><path d="M39.9699 3856.71C39.5641 3856.71 39.2395 3856.38 39.2395 3855.98C39.2395 3855.78 39.3125 3855.6 39.4505 3855.47C39.5884 3855.33 39.7751 3855.25 39.9699 3855.25C40.3757 3855.25 40.7003 3855.57 40.7003 3855.98C40.7003 3856.38 40.3757 3856.71 39.9699 3856.71Z" fill="currentColor"/><path d="M44.4335 3861.17C44.0277 3861.17 43.7031 3860.85 43.7031 3860.44C43.7031 3860.25 43.7762 3860.07 43.9141 3859.93C44.0521 3859.79 44.2387 3859.71 44.4335 3859.71C44.8393 3859.71 45.1639 3860.04 45.1639 3860.44C45.1639 3860.85 44.8393 3861.17 44.4335 3861.17Z" fill="currentColor"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l-4 4-4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3 3L21 21M21 3L3 21"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C12 21 2.25 15.75 2.25 9.56C2.25 8.22 2.78 6.93 3.73 5.98C4.68 5.03 5.97 4.5 7.31 4.5C9.43 4.5 11.24 5.65 12 7.5C12.76 5.65 14.57 4.5 16.69 4.5C18.03 4.5 19.32 5.03 20.27 5.98C21.22 6.93 21.75 8.22 21.75 9.56C21.75 15.75 12 21 12 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.56" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V4.5M15.7 5.5L16.5 4.2M18.5 8.3L19.8 7.5M19.5 12H21M3 12H4.5M5.5 8.3L4.2 7.5M8.3 5.5L7.5 4.2M12 19.5V21M7.5 19.8L8.3 18.5M5.5 15.7L4.2 16.5M19.8 16.5L18.5 15.7M12 11.6994V8.39941M12 14.649V14.499M15.7 18.5L16.5 19.8"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M7.27239 14.3989C6.93321 13.6365 6.80088 12.8691 6.80088 12.1637C6.80088 9.22107 9.12804 6.79895 12.0009 6.79895C14.8737 6.79895 17.2009 9.22107 17.2009 12.1637C17.2009 12.8691 17.0686 13.6365 16.7294 14.3989M12.0004 4V4.8M20.0001 12.0004H19.2001M4.8 12.0004H4M17.6563 6.34387L17.0906 6.90956M6.34385 6.34374L6.90954 6.90943"/><path d="M9.18221 15.6923H14.8583C15.0836 15.6923 15.2634 15.8888 15.238 16.0988C15.1343 16.9447 14.7343 17.4673 14.0143 17.8442H9.9635C9.1587 17.4315 8.89169 16.9474 8.79213 16.1189C8.76477 15.8916 8.95694 15.6923 9.18221 15.6923ZM14.0143 17.8442C13.9166 19.4057 13.5237 19.9992 12.0062 19.9992C10.4888 19.9992 10.0928 19.4057 9.9635 17.8442"/></svg>',
    expand: '<svg viewBox="44.14 1012.75 17.23 17.23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.6506 1023.68C59.3665 1023.68 59.123 1023.92 59.123 1024.2V1026.64C59.123 1027.25 58.6361 1027.73 58.0274 1027.73H55.5927C55.3087 1027.73 55.0652 1027.98 55.0652 1028.26C55.0652 1028.54 55.3087 1028.79 55.5927 1028.79H58.0274C59.2042 1028.79 60.1781 1027.81 60.1781 1026.64V1024.2C60.1781 1023.92 59.9346 1023.68 59.6506 1023.68Z" fill="currentColor"/><path d="M52.3058 1020.47H46.6654C45.935 1020.47 45.3263 1021.08 45.3263 1021.81V1027.45C45.3263 1028.18 45.935 1028.79 46.6654 1028.79H52.3058C53.0363 1028.79 53.6449 1028.18 53.6449 1027.45V1021.81C53.6449 1021.08 53.0363 1020.47 52.3058 1020.47ZM52.5899 1027.45C52.5899 1027.61 52.4682 1027.73 52.3058 1027.73H46.6654C46.5031 1027.73 46.3814 1027.61 46.3814 1027.45V1021.81C46.3814 1021.65 46.5031 1021.52 46.6654 1021.52H52.3058C52.4682 1021.52 52.5899 1021.65 52.5899 1021.81V1027.45Z" fill="currentColor"/><path d="M45.8539 1019.05C46.1379 1019.05 46.3814 1018.81 46.3814 1018.52V1016.09C46.3814 1015.48 46.8683 1014.99 47.477 1014.99H49.9117C50.1958 1014.99 50.4392 1014.75 50.4392 1014.46C50.4392 1014.18 50.1958 1013.94 49.9117 1013.94H47.477C46.3002 1013.94 45.3263 1014.91 45.3263 1016.09V1018.52C45.3263 1018.81 45.5698 1019.05 45.8539 1019.05Z" fill="currentColor"/><path d="M58.0274 1013.94H55.5927C55.3087 1013.94 55.0652 1014.18 55.0652 1014.46C55.0652 1014.75 55.3087 1014.99 55.5927 1014.99H58.0274C58.6361 1014.99 59.123 1015.48 59.123 1016.09V1018.52C59.123 1018.81 59.3665 1019.05 59.6506 1019.05C59.9346 1019.05 60.1781 1018.81 60.1781 1018.52V1016.09C60.1781 1014.91 59.2042 1013.94 58.0274 1013.94Z" fill="currentColor"/></svg>',
  };

  /* ---------- chrome mobile (header + footer + drawer) ----------
     Se renderiza SIEMPRE en versión mobile (no depende del viewport),
     porque el lienzo del prototipo es siempre de ancho iPhone. */
  const LOGO = '<svg width="100%" viewBox="0 0 120 62" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="url(#flogo)" d="M119.667 41.1909C119.387 39.9375 118.6 38.8442 117.493 38.2042C116.387 37.5642 115.053 37.4042 113.84 37.7909C111.573 38.5642 110.253 40.9242 110.747 43.2709C111.453 46.7909 108.547 49.9775 105.48 51.1909C102.747 52.1775 99.76 52.1775 97.0267 51.2175C95.8533 50.8309 94.72 50.3509 93.6267 49.7775C96.76 45.9509 98.5067 41.1509 98.5867 36.1909C98.5867 26.6842 92.5467 21.7109 86.5867 21.7109C80.6267 21.7109 74.5867 26.6842 74.5867 36.1909C74.68 41.3109 76.5333 46.2309 79.84 50.1242C75.9333 51.7509 71.5733 51.8975 67.56 50.5509C67.0267 50.3642 66.4933 50.1509 65.9733 49.8975C69.1733 46.0442 70.96 41.2042 71.04 36.1909C71.04 26.6842 65 21.7109 59.04 21.7109C53.08 21.7109 47.04 26.6842 47.04 36.1909C47.08 41.2175 48.8133 46.0975 51.9467 50.0175C51.3867 50.3509 50.8 50.6442 50.2133 50.9242C48.7467 51.4175 47.1867 51.4709 45.6933 51.0842C42.9067 50.1775 41.0267 47.5509 41.0533 44.6042V17.5375C41.0667 8.19088 33.6933 0.337545 24.6267 0.00421143C24.44 0.00421143 24.2133 0.00421143 24.04 0.00421143C14.6133 0.00421143 6.97333 7.68421 6.94667 17.1509V24.6575H5.14667C2.29333 24.6975 0 27.0309 0 29.8975C0 32.7642 2.29333 35.1109 5.14667 35.1375H6.94667V55.6442C6.98667 58.7509 9.50667 61.2575 12.6 61.2575C15.6933 61.2575 18.2133 58.7509 18.2533 55.6442V35.1375H20.0533C22.9067 35.0975 25.2 32.7642 25.2 29.8975C25.2 27.0309 22.9067 24.6842 20.0533 24.6575H18.2533V18.2842C18.2 15.1775 20.5333 12.5509 23.6133 12.2709C23.6933 12.2709 23.7733 12.2709 23.8533 12.2709H24C27.1733 12.2709 29.7333 14.8575 29.7467 18.0442V43.8042C29.7467 53.1375 37.12 61.0042 46.1733 61.3242C46.3867 61.3242 46.5867 61.3242 46.8 61.3242C51.4533 61.3242 55.96 59.6575 59.5067 56.6309C63.9467 59.3242 69.0667 60.6575 74.2533 60.4842C79.2533 60.2975 83.6933 58.9242 86.9067 56.5909C95.9333 62.8575 110.147 63.0975 116.987 53.4842C119.587 49.9509 120.56 45.4709 119.653 41.1775L119.667 41.1909ZM58.9333 30.9775C60.3067 30.9775 61.6933 32.8042 61.6933 36.2842C61.6 39.1642 60.6 41.9242 58.8533 44.1642C57.1867 41.8975 56.2533 39.1375 56.16 36.2842C56.16 32.8042 57.5467 30.9775 58.92 30.9775H58.9333ZM86.56 30.9775C87.9333 30.9775 89.32 32.7775 89.32 36.2042C89.2533 39.0042 88.2667 41.6975 86.52 43.8575C84.8133 41.6842 83.8533 38.9909 83.8 36.2042C83.8 32.7775 85.1867 30.9775 86.56 30.9775Z"></path><defs><linearGradient id="flogo" x1="0" y1="30.5" x2="120" y2="30.5" gradientUnits="userSpaceOnUse"><stop stop-color="#0AF96B"></stop><stop offset="1" stop-color="#14D9D7"></stop></linearGradient></defs></svg>';
  const I_BURGER = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7h20M2 12h20M2 17h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const I_IG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/></svg>';
  const I_YT = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor"/></svg>';
  const I_FB = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 8.5h2V5.5h-2c-1.7 0-3 1.3-3 3V11H9v3h2v6h3v-6h2.2l.3-3H14V9c0-.3.2-.5.5-.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  const svg24 = (d) => `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`;
  const I_CHATGPT = svg24('M9.78735 9.43903V7.65013C9.78735 7.49947 9.8439 7.38645 9.97565 7.31117L13.5724 5.23987C14.0619 4.95742 14.6457 4.82567 15.2482 4.82567C17.5078 4.82567 18.939 6.57694 18.939 8.44107C18.939 8.57286 18.939 8.72352 18.9202 8.87418L15.1917 6.68981C14.9658 6.55802 14.7397 6.55802 14.5138 6.68981L9.78735 9.43903ZM18.1857 16.4063V12.1317C18.1857 11.868 18.0727 11.6798 17.8468 11.548L13.1203 8.79875L14.6644 7.91366C14.7962 7.83843 14.9092 7.83843 15.041 7.91366L18.6377 9.98501C19.6735 10.5877 20.3701 11.868 20.3701 13.1108C20.3701 14.5419 19.5228 15.86 18.1857 16.4062V16.4063ZM8.67637 12.6403L7.13228 11.7365C7.00053 11.6612 6.94398 11.5482 6.94398 11.3975V7.25486C6.94398 5.24002 8.48807 3.71465 10.5783 3.71465C11.3693 3.71465 12.1035 3.97838 12.7251 4.44908L9.01548 6.59586C8.78959 6.7276 8.67656 6.9159 8.67656 7.17959V12.6404L8.67637 12.6403ZM12 14.5609L9.78735 13.3182V10.682L12 9.43923L14.2125 10.682V13.3182L12 14.5609ZM13.4217 20.2855C12.6307 20.2855 11.8965 20.0218 11.2749 19.551L14.9845 17.4043C15.2104 17.2726 15.3234 17.0843 15.3234 16.8205V11.3597L16.8864 12.2635C17.0182 12.3388 17.0747 12.4518 17.0747 12.6024V16.7451C17.0747 18.7599 15.5117 20.2853 13.4217 20.2853V20.2855ZM8.95881 16.0863L5.36209 14.015C4.32634 13.4123 3.62971 12.1319 3.62971 10.8892C3.62971 9.43923 4.49592 8.13995 5.8328 7.59382V11.8871C5.8328 12.1508 5.94586 12.3391 6.17176 12.4709L10.8795 15.2012L9.33537 16.0863C9.20362 16.1615 9.09056 16.1615 8.95881 16.0863ZM8.7518 19.1745C6.62394 19.1745 5.06097 17.5739 5.06097 15.5967C5.06097 15.446 5.07984 15.2954 5.09856 15.1447L8.80815 17.2914C9.03405 17.4232 9.26013 17.4232 9.48603 17.2914L14.2125 14.5611V16.35C14.2125 16.5007 14.1559 16.6137 14.0242 16.6889L10.4275 18.7603C9.93786 19.0427 9.35409 19.1745 8.7516 19.1745H8.7518ZM13.4217 21.4152C15.7002 21.4152 17.602 19.7958 18.0352 17.6491C20.1442 17.103 21.5 15.1258 21.5 13.111C21.5 11.7928 20.9351 10.5124 19.9183 9.5897C20.0124 9.19422 20.0689 8.79875 20.0689 8.40348C20.0689 5.71077 17.8846 3.69577 15.3612 3.69577C14.8529 3.69577 14.3633 3.77101 13.8737 3.94058C13.0262 3.11201 11.8587 2.58479 10.5783 2.58479C8.29981 2.58479 6.39804 4.20411 5.96478 6.35085C3.8558 6.89698 2.5 8.87418 2.5 10.889C2.5 12.2072 3.06485 13.4875 4.08173 14.4103C3.98758 14.8057 3.93107 15.2012 3.93107 15.5965C3.93107 18.2892 6.11544 20.3042 8.63873 20.3042C9.14707 20.3042 9.63669 20.229 10.1263 20.0594C10.9736 20.888 12.1411 21.4152 13.4217 21.4152Z');
  const I_CLAUDE = svg24('M5.92329 15.3081L9.85873 13.1L9.92491 12.9082L9.85873 12.8015H9.66696L9.00925 12.761L6.76062 12.7003L4.81045 12.6192L2.92106 12.5179L2.44568 12.4166L2 11.8292L2.04592 11.5361L2.44568 11.2673L3.0183 11.3173L4.28375 11.4037L6.18259 11.5347L7.56013 11.6158L9.60078 11.8278H9.92491L9.97083 11.6968L9.86009 11.6158L9.77365 11.5347L7.80863 10.2031L5.68155 8.79587L4.56736 7.98555L3.96502 7.57499L3.66115 7.19009L3.53015 6.35006L4.07711 5.74772L4.8118 5.79769L4.99953 5.84766L5.74367 6.42029L7.33324 7.65062L9.40901 9.17942L9.71288 9.43197L9.83443 9.34554L9.84928 9.28476L9.71288 9.05652L8.58383 7.01587L7.37916 4.9401L6.843 4.07982L6.70119 3.56391C6.65123 3.35188 6.61476 3.17361 6.61476 2.95618L7.23736 2.11074L7.58174 2L8.41232 2.11074L8.7621 2.41461L9.27801 3.59498L10.114 5.45331L11.4105 7.98015L11.79 8.72969L11.9926 9.42386L12.0682 9.6359H12.1992V9.51435L12.3059 8.09089L12.5031 6.34331L12.6948 4.09467L12.761 3.46127L13.0743 2.70228L13.6969 2.29171L14.1831 2.52401L14.5829 3.09663L14.5275 3.46668L14.2898 5.01168L13.8239 7.43183L13.52 9.05247H13.6969L13.8995 8.84989L14.7193 7.76136L16.0968 6.03944L16.7046 5.35607L17.4136 4.60112L17.8687 4.24188H18.729L19.3624 5.1832L19.0788 6.15558L18.1929 7.27922L17.4582 8.23135L16.4048 9.6494L15.747 10.7838L15.8078 10.8743L15.9645 10.8595L18.3441 10.353L19.6298 10.1207L21.164 9.85738L21.8582 10.1815L21.9338 10.511L21.661 11.185L20.0201 11.5901L18.0956 11.975L15.2298 12.653L15.1947 12.6786L15.2352 12.7286L16.5263 12.8502L17.0787 12.8799H18.4305L20.9479 13.0676L21.6056 13.5025L22 14.0346L21.9338 14.4397L20.9209 14.9556L19.5542 14.6315L16.3642 13.8725L15.2703 13.5997H15.1191V13.6902L16.0307 14.5815L17.7013 16.0901L19.7932 18.0348L19.8999 18.5156L19.6312 18.8951L19.3476 18.8546L17.5095 17.4717L16.8005 16.8491L15.1947 15.4972H15.088V15.639L15.458 16.1806L17.4122 19.118L17.5135 20.0188L17.3717 20.3118L16.8653 20.4888L16.3089 20.3875L15.165 18.7817L13.9846 16.9733L13.0325 15.3527L12.9163 15.4189L12.3545 21.4706L12.0912 21.7799L11.4834 22.0122L10.977 21.6273L10.7082 21.0047L10.977 19.7743L11.3011 18.1685L11.5645 16.8923L11.8021 15.3068L11.944 14.7801L11.9345 14.745L11.8184 14.7598L10.6231 16.4007L8.80532 18.8573L7.36701 20.3969L7.02262 20.5333L6.42569 20.2241L6.48106 19.6717L6.81464 19.1801L8.80532 16.6478L10.0059 15.0785L10.7811 14.1723L10.7757 14.0413H10.7298L5.4425 17.4744L4.50118 17.5959L4.09602 17.2164L4.14599 16.5938L4.33777 16.3912L5.92734 15.2973L5.92194 15.3027L5.92329 15.3081Z');
  const I_GEMINI = svg24('M19.05 11.0465C17.6632 10.4495 16.4499 9.63057 15.4094 8.59059C14.3695 7.55064 13.5505 6.33675 12.9535 4.94998C12.7243 4.4185 12.5402 3.87217 12.399 3.31204C12.353 3.12891 12.1888 3 12 3C11.8112 3 11.647 3.12891 11.601 3.31204C11.4598 3.87217 11.2757 4.41798 11.0465 4.94998C10.4495 6.33675 9.63057 7.55064 8.59059 8.59059C7.55064 9.63057 6.33675 10.4495 4.94998 11.0465C4.41849 11.2757 3.87217 11.4598 3.31204 11.601C3.12891 11.647 3 11.8112 3 12C3 12.1888 3.12891 12.353 3.31204 12.399C3.87217 12.5402 4.41798 12.7243 4.94998 12.9535C6.33675 13.5505 7.55014 14.3695 8.59059 15.4094C9.63107 16.4494 10.4495 17.6632 11.0465 19.05C11.2757 19.5815 11.4598 20.1278 11.601 20.688C11.647 20.8711 11.8112 21 12 21C12.1888 21 12.353 20.8711 12.399 20.688C12.5402 20.1278 12.7243 19.582 12.9535 19.05C13.5505 17.6632 14.3695 16.4499 15.4094 15.4094C16.4494 14.3695 17.6632 13.5505 19.05 12.9535C19.5815 12.7243 20.1278 12.5402 20.688 12.399C20.8711 12.353 21 12.1888 21 12C21 11.8112 20.8711 11.647 20.688 11.601C20.1278 11.4598 19.582 11.2757 19.05 11.0465Z');
  const I_PERPLEXITY = svg24('M18.1875 7.60637H20.5898V16.4999H18.1875V22.7333L12.5771 17.3173V22.4648H11.3984V17.3417L5.8125 22.7333V16.4999H3.41016V7.60637H5.8125V1.40617L11.3984 6.7968V1.99992H12.5771V6.82121L18.1875 1.40617V7.60637ZM6.99219 13.8486V19.956L11.3984 15.703V9.5966L6.99219 13.8486ZM12.5898 15.6904L17.0088 19.956V16.4999L17.0078 13.8495L12.5898 9.58488V15.6904ZM18.1875 8.78703H13.4619L18.0078 13.1747L18.1875 13.3486V15.3212H19.4102V8.78605L18.1875 8.78703ZM4.58984 15.3212H5.8125V13.3486L5.99316 13.1747L10.5391 8.78703H5.8125L4.58984 8.78605V15.3212ZM13.4619 7.60637H17.0088V4.18254L13.4619 7.60637ZM6.99121 7.60637H10.5381L6.99121 4.18254V7.60637Z');
  const I_SOS_ARROW = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 9H15M15 9V13.5M15 9L9 15M18.4 18.4C14.9 21.9 9.2 21.9 5.7 18.4C2.2 14.9 2.2 9.2 5.7 5.7C9.2 2.2 14.9 2.2 18.4 5.7C21.9 9.2 21.9 14.8 18.4 18.4Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const NAV = [
    { label: 'Noleggio a Lungo Termine', href: 'm-catalogo.html' },
    { label: 'Muoviti con Flee', href: '#' },
    { label: 'Chi Siamo', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contatti', href: '#' },
  ];
  const ico = (svg) => `<span class="icon">${svg}</span>`;

  function renderChrome() {
    const header = document.getElementById('flee-header');
    if (header && !header.dataset.ready) {
      header.dataset.ready = '1';
      header.innerHTML =
        '<header class="m-header">' +
          '<a class="m-logo" href="m-catalogo.html" aria-label="Flee">' + LOGO + '</a>' +
          '<button class="m-burger" aria-label="Menu">' + ico(I_BURGER) + '</button>' +
        '</header>';
    }

    const footer = document.getElementById('flee-footer');
    if (footer && !footer.dataset.ready) {
      footer.dataset.ready = '1';
      const links = (arr) => arr.map(t => `<a href="#">${t}</a>`).join('');
      footer.innerHTML =
        '<footer class="m-footer">' +
          '<span class="mf-logo">' + LOGO + '</span>' +
          '<div class="mf-group"><p class="mf-label">Seguici su</p>' +
            '<div class="mf-icons">' + ico(I_IG) + ico(I_YT) + ico(I_FB) + '</div></div>' +
          '<div class="mf-group"><p class="mf-label">Chiedi all’AI di Flee</p>' +
            '<div class="mf-icons mf-icons-ai">' + ico(I_CHATGPT) + ico(I_CLAUDE) + ico(I_GEMINI) + ico(I_PERPLEXITY) + '</div></div>' +
          '<nav class="mf-menu"><h4>Esplora Flee</h4>' +
            links(['Diventa partner', 'Domande frequenti', 'Guida al noleggio', 'Il nostro podcast', 'Contatti']) + '</nav>' +
          '<nav class="mf-menu"><h4>Legal &amp; privacy</h4>' +
            links(['Privacy Policy', 'Cookie Policy', 'Gestione cookie', 'Accessibilità']) + '</nav>' +
          '<a class="mf-sos" href="#">S.O.S. ' + ico(I_SOS_ARROW) + '</a>' +
          '<p class="mf-legal">MOOV - Tech S.r.l. - Via Po, 42, 00198 ROMA (RM) | P.Iva 17132741004 Numero REA RM - 1697990 - Cap. Soc. Euro 148.493,79 – int. vers.<br>Flee è un marchio di esclusiva proprietà di Moov-Tech S.r.l.</p>' +
        '</footer>';
    }

    // Drawer del burger
    const burger = document.querySelector('.m-burger');
    if (burger && !burger.dataset.ready) {
      burger.dataset.ready = '1';
      const host = document.querySelector('.app') || document.body;
      const overlay = document.createElement('div');
      overlay.className = 'mnav-overlay';
      const drawer = document.createElement('nav');
      drawer.className = 'mnav';
      drawer.innerHTML =
        '<button class="mnav-close" aria-label="Chiudi menu">' + I.close + '</button>' +
        NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('') +
        '<a class="mnav-area" href="#">Area Riservata</a>';
      host.appendChild(overlay);
      host.appendChild(drawer);
      const open = () => { overlay.classList.add('open'); drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
      const close = () => { overlay.classList.remove('open'); drawer.classList.remove('open'); document.body.style.overflow = ''; };
      burger.addEventListener('click', open);
      overlay.addEventListener('click', close);
      drawer.querySelector('.mnav-close').addEventListener('click', close);
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderChrome);
  else renderChrome();

  return { cars, kindOf, carById, pricing, nf, eur0, money, monthly, I, LOGO, renderChrome };
})();
