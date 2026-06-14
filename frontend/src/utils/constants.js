export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Velura Events';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/packages', label: 'Packages' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
];

export const EVENT_TYPES = ['Wedding', 'Corporate Event', 'Debut', 'Birthday', 'Other'];

export const CONTACT_INFO = {
  address: '123 Luxury Lane, BGC, Taguig City, Metro Manila',
  phone: '+63 917 000 0000',
  email: 'hello@velura.ph',
  hours: 'Monday–Saturday, 9:00 AM – 6:00 PM',
};
