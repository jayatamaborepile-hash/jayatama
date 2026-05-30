/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CLIENT DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Business-specific copy: name, phone, email, address, socials.
 * Imported by Header, Footer, Contact page, and Head/SEO components.
 *
 * No component should hardcode a business name or phone number —
 * everything comes from this file or brand.ts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const client = {
  name: 'Jayatama Bore Pile',
  email: 'info@jayatamaborepile.com',
  phoneForTel: '+6288215714841',
  phoneFormatted: '0882-1571-4841',
  /** Business / contractor license number. Displayed in the header and footer
   *  as a trust signal. Set to an empty string to hide it. */
  license: '',
  address: {
    lineOne: 'DKI Jakarta',
    lineTwo: 'Seluruh Kecamatan',
    city: 'Jakarta',
    state: 'DKI Jakarta',
    zip: '',
    country: 'ID',
    mapLink: 'https://maps.google.com',
  },
  socials: {
    facebook: '',
    instagram: '',
    google: 'https://www.google.com/maps',
  },
  domain: 'https://jayatamaborepile.com',
} as const;

export type Client = typeof client;
