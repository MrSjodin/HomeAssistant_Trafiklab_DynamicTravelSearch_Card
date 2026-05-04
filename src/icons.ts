// Icon helpers for the Trafiklab Dynamic Travel Card

export function modeIcon(typeRaw?: string): string {
  const type = (typeRaw || '').toLowerCase();
  if (/(walk|foot|gå)/.test(type)) return 'mdi:walk';
  if (/(bus|buss)/.test(type)) return 'mdi:bus';
  if (/(train|tå|rail)/.test(type)) return 'mdi:train';
  if (/(metro|subway|tunnelbana)/.test(type)) return 'mdi:subway';
  if (/(tram|spårvagn)/.test(type)) return 'mdi:tram';
  if (/(ferry|boat|båt)/.test(type)) return 'mdi:ferry';
  if (/(car|bil|taxi)/.test(type)) return 'mdi:car';
  return 'mdi:map-marker-path';
}

export const arrowRight = 'mdi:chevron-right';
export const arrowSwap = 'mdi:swap-vertical';
export const iconHome = 'mdi:home';
export const iconPerson = 'mdi:account';
export const iconZone = 'mdi:map-marker';
export const iconSearch = 'mdi:magnify';
export const iconStop = 'mdi:bus-stop';
export const mapMarker = 'mdi:map-marker';
export const iconLoading = 'mdi:loading';

// Render an HA icon element
export function haIcon(name: string) {
  const el = document.createElement('ha-icon');
  el.setAttribute('icon', name);
  return el;
}
