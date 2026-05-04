/*
  Trafiklab Dynamic Travel Search Card
  Home Assistant Lovelace custom card that allows users to search for public transport journeys
  dynamically using the Trafiklab integration's travel_search service.

  Features:
  - Quick-search from My Location → Home
  - Quick-search from My Location → a configured person / zone
  - Free-text stop search (origin and/or destination) with autocomplete
  - Swap origin ↔ destination
  - Displays trips returned by the trafiklab.travel_search service
*/

import { html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { cardStyles } from './style';
import {
  arrowRight,
  arrowSwap,
  haIcon,
  iconHome,
  iconLoading,
  iconPerson,
  iconSearch,
  iconZone,
  mapMarker,
  modeIcon,
} from './icons';
import { localize } from './localize';
import type { DynamicTravelCardConfig, Hass, Leg, StopLike, StopSuggestion, Trip } from './types';

// Import editor (bundled by Vite)
import './trafiklab-dynamic-travel-card-editor';

const CARD_TYPE = 'trafiklab-dynamic-travel-card';
const CARD_NAME = 'Trafiklab Dynamic Travel Search';
const CARD_DESC = 'Dynamically search for public transport journeys using the Trafiklab integration.';

type OriginMode = 'my_location' | 'text';
type DestMode = 'home' | 'person' | 'zone' | 'text';

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export class TrafiklabDynamicTravelCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass!: Hass;
  @state() private _config!: DynamicTravelCardConfig;

  // ── Search state ──
  @state() private _originMode: OriginMode = 'my_location';
  @state() private _originText = '';
  @state() private _originStopId: string | null = null;
  @state() private _originSuggestions: StopSuggestion[] = [];
  @state() private _originSuggestionsOpen = false;

  @state() private _destMode: DestMode = 'home';
  @state() private _destPersonEntity = '';
  @state() private _destZoneEntity = '';
  @state() private _destText = '';
  @state() private _destStopId: string | null = null;
  @state() private _destSuggestions: StopSuggestion[] = [];
  @state() private _destSuggestionsOpen = false;

  // ── Results state ──
  @state() private _trips: Trip[] = [];
  @state() private _loading = false;
  @state() private _error: string | null = null;
  @state() private _hasSearched = false;

  private _originLookup = debounce((q: string) => this._stopLookup(q, 'origin'), 500);
  private _destLookup = debounce((q: string) => this._stopLookup(q, 'dest'), 500);

  // ─────────────────────────────────────────
  // Lovelace API
  // ─────────────────────────────────────────

  setConfig(config: DynamicTravelCardConfig) {
    if (!config) throw new Error('Configuration required');
    this._config = {
      home_zone: 'zone.home',
      max_items: 3,
      max_legs: 12,
      show_details: false,
      max_walking_distance: 1000,
      ...config,
    };
    // If persons are configured, default destination to first person; otherwise use home
    if (this._config.persons?.length) {
      this._destPersonEntity = this._config.persons[0];
    }
    if (this._config.zones?.length) {
      this._destZoneEntity = this._config.zones[0];
    }
  }

  getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement('trafiklab-dynamic-travel-card-editor');
  }

  static getStubConfig(): DynamicTravelCardConfig {
    return {
      type: CARD_TYPE,
      home_zone: 'zone.home',
      max_items: 3,
      max_legs: 12,
      show_details: false,
      max_walking_distance: 1000,
    };
  }

  // ─────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────

  private t(path: string, vars?: Record<string, any>): string {
    return localize(this.hass, path, vars);
  }

  private _renderIconEl(name: string) {
    if (customElements?.get?.('ha-icon')) return haIcon(name);
    return html`<span class="icon-fallback">${name}</span>`;
  }

  private _renderIcon(name: string) {
    return html`${this._renderIconEl(name)}`;
  }

  /** Friendly name for a HA entity */
  private _entityName(entityId: string): string {
    const state = this.hass?.states?.[entityId];
    return state?.attributes?.friendly_name || entityId.split('.').pop() || entityId;
  }

  /** Resolve a zone entity to a display name */
  private _zoneName(zoneEntityId: string): string {
    return this._entityName(zoneEntityId);
  }

  // ─────────────────────────────────────────
  // Stop lookup (autocomplete)
  // ─────────────────────────────────────────

  private async _stopLookup(query: string, field: 'origin' | 'dest') {
    if (query.length < 2) {
      if (field === 'origin') { this._originSuggestions = []; this._originSuggestionsOpen = false; }
      else { this._destSuggestions = []; this._destSuggestionsOpen = false; }
      return;
    }
    try {
      const serviceData: Record<string, unknown> = { search_query: query };
      if (this._config.config_entry_id) serviceData['config_entry_id'] = this._config.config_entry_id;
      if (this._config.api_key) serviceData['api_key'] = this._config.api_key;

      const response = await this.hass.connection.sendMessagePromise({
        type: 'call_service',
        domain: 'trafiklab',
        service: 'stop_lookup',
        service_data: serviceData,
        return_response: true,
      });
      const stops: StopSuggestion[] = (response as any)?.response?.stops_found || (response as any)?.stops_found || [];
      if (field === 'origin') {
        this._originSuggestions = stops.slice(0, 8);
        this._originSuggestionsOpen = stops.length > 0;
      } else {
        this._destSuggestions = stops.slice(0, 8);
        this._destSuggestionsOpen = stops.length > 0;
      }
    } catch (_) {
      // Silently fail autocomplete
    }
  }

  private _selectOriginSuggestion(stop: StopSuggestion) {
    this._originText = stop.name;
    this._originStopId = stop.id;
    this._originSuggestions = [];
    this._originSuggestionsOpen = false;
  }

  private _selectDestSuggestion(stop: StopSuggestion) {
    this._destText = stop.name;
    this._destStopId = stop.id;
    this._destSuggestions = [];
    this._destSuggestionsOpen = false;
  }

  // ─────────────────────────────────────────
  // Swap origin ↔ destination
  // ─────────────────────────────────────────

  private _swap() {
    // We only swap when both are in text/stop mode; for quick buttons we swap modes
    const prevOriginMode = this._originMode;
    const prevOriginText = this._originText;
    const prevOriginStopId = this._originStopId;

    const prevDestMode = this._destMode;
    const prevDestText = this._destText;
    const prevDestStopId = this._destStopId;
    const prevDestPersonEntity = this._destPersonEntity;
    const prevDestZoneEntity = this._destZoneEntity;

    // Map destination mode to origin mode
    if (prevDestMode === 'text') {
      this._originMode = 'text';
      this._originText = prevDestText;
      this._originStopId = prevDestStopId;
    } else {
      // home / person / zone → switch origin to 'my_location' or text
      this._originMode = 'my_location';
    }
    this._originSuggestions = [];
    this._originSuggestionsOpen = false;

    // Map origin mode to destination mode
    if (prevOriginMode === 'my_location') {
      this._destMode = 'text';
      this._destText = '';
      this._destStopId = null;
    } else {
      this._destMode = 'text';
      this._destText = prevOriginText;
      this._destStopId = prevOriginStopId;
    }
    this._destSuggestions = [];
    this._destSuggestionsOpen = false;

    // Reset unused destination fields
    this._destPersonEntity = prevDestPersonEntity;
    this._destZoneEntity = prevDestZoneEntity;
  }

  // ─────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────

  private async _search() {
    this._error = null;

    // Build origin
    let originValue: string;
    let originType: string;

    if (this._originMode === 'my_location') {
      const entity = this._config.my_location_entity;
      if (!entity) {
        this._error = this.t('error.my_location_not_configured');
        return;
      }
      originValue = entity;
      originType = 'person';
    } else {
      if (!this._originText.trim()) {
        this._error = this.t('error.origin_required');
        return;
      }
      if (this._originStopId) {
        originValue = this._originStopId;
        originType = 'stop_id';
      } else {
        originValue = this._originText.trim();
        originType = 'name';
      }
    }

    // Build destination
    let destinationValue: string;
    let destinationType: string;

    if (this._destMode === 'home') {
      destinationValue = this._config.home_zone || 'zone.home';
      destinationType = 'zone';
    } else if (this._destMode === 'person') {
      if (!this._destPersonEntity) {
        this._error = this.t('error.destination_required');
        return;
      }
      destinationValue = this._destPersonEntity;
      destinationType = 'person';
    } else if (this._destMode === 'zone') {
      if (!this._destZoneEntity) {
        this._error = this.t('error.destination_required');
        return;
      }
      destinationValue = this._destZoneEntity;
      destinationType = 'zone';
    } else {
      if (!this._destText.trim()) {
        this._error = this.t('error.destination_required');
        return;
      }
      if (this._destStopId) {
        destinationValue = this._destStopId;
        destinationType = 'stop_id';
      } else {
        destinationValue = this._destText.trim();
        destinationType = 'name';
      }
    }

    this._loading = true;
    this._trips = [];
    this._hasSearched = false;

    try {
      const serviceData: Record<string, unknown> = {
        origin: originValue,
        origin_type: originType,
        destination: destinationValue,
        destination_type: destinationType,
        max_walking_distance: this._config.max_walking_distance ?? 1000,
      };
      if (this._config.config_entry_id) serviceData['config_entry_id'] = this._config.config_entry_id;
      if (this._config.api_key) serviceData['api_key'] = this._config.api_key;

      const raw = await this.hass.connection.sendMessagePromise({
        type: 'call_service',
        domain: 'trafiklab',
        service: 'travel_search',
        service_data: serviceData,
        return_response: true,
      });

      // HA wraps the response in { response: { ... } }
      const result: any = (raw as any)?.response ?? raw ?? {};
      if (result.error) {
        this._error = this.t('error.search_failed', { message: result.error });
      } else {
        const trips: Trip[] = result.trips ?? [];
        this._trips = trips.slice(0, this._config.max_items ?? 3);
      }
    } catch (err: any) {
      this._error = this.t('error.search_failed', { message: String(err?.message ?? err) });
    } finally {
      this._loading = false;
      this._hasSearched = true;
    }
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  protected render() {
    const t = (p: string, v?: Record<string, any>) => this.t(p, v);

    return html`
      <ha-card>
        ${this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : nothing}

        ${this._renderOriginSection()}

        <div class="action-row">
          <button
            class="swap-btn"
            title="${t('search.swap_tooltip')}"
            @click=${this._swap}
          >${this._renderIcon(arrowSwap)}</button>
          <button
            class="search-btn"
            ?disabled=${this._loading}
            @click=${this._search}
          >
            ${this._renderIcon(this._loading ? iconLoading : iconSearch)}
            ${this._loading ? t('search.searching') : t('search.search_btn')}
          </button>
        </div>

        ${this._renderDestinationSection()}

        ${this._error
          ? html`<div class="error-row">${this._error}</div>`
          : nothing}

        ${this._hasSearched ? this._renderResults() : nothing}
      </ha-card>
    `;
  }

  private _renderOriginSection() {
    const t = (p: string) => this.t(p);
    const persons = this._config.persons ?? [];
    const zones = this._config.zones ?? [];
    const hasMyLocation = !!this._config.my_location_entity;

    return html`
      <div class="search-section">
        <div class="section-label">${t('search.origin_label')}</div>
        <div class="quick-buttons">
          ${hasMyLocation
            ? html`<button
                class="quick-btn ${this._originMode === 'my_location' ? 'active' : ''}"
                @click=${() => { this._originMode = 'my_location'; }}
              >${this._renderIcon(iconPerson)} ${t('search.my_location')}</button>`
            : nothing}
          <button
            class="quick-btn ${this._originMode === 'text' ? 'active' : ''}"
            @click=${() => { this._originMode = 'text'; }}
          >${this._renderIcon(iconSearch)} ${t('search.type_stop')}</button>
        </div>

        ${this._originMode === 'text'
          ? html`
            <div class="text-input-wrap">
              <input
                class="stop-input"
                type="text"
                .value=${this._originText}
                placeholder="${t('search.placeholder_origin')}"
                autocomplete="off"
                @input=${(e: Event) => {
                  const v = (e.target as HTMLInputElement).value;
                  this._originText = v;
                  this._originStopId = null;
                  this._originLookup(v);
                }}
                @blur=${() => setTimeout(() => { this._originSuggestionsOpen = false; }, 200)}
                @focus=${() => { if (this._originSuggestions.length) this._originSuggestionsOpen = true; }}
              />
              ${this._originSuggestionsOpen && this._originSuggestions.length
                ? html`<div class="suggestions">
                    ${this._originSuggestions.map(s => html`
                      <div class="suggestion-item" @mousedown=${() => this._selectOriginSuggestion(s)}>
                        <span class="suggestion-name">${s.name}</span>
                        ${s.transport_modes?.length
                          ? html`<span class="suggestion-meta">${s.transport_modes.join(', ')}</span>`
                          : nothing}
                      </div>
                    `)}
                  </div>`
                : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderDestinationSection() {
    const t = (p: string) => this.t(p);
    const persons = this._config.persons ?? [];
    const zones = this._config.zones ?? [];

    return html`
      <div class="search-section">
        <div class="section-label">${t('search.destination_label')}</div>
        <div class="quick-buttons">
          <button
            class="quick-btn ${this._destMode === 'home' ? 'active' : ''}"
            @click=${() => { this._destMode = 'home'; }}
          >${this._renderIcon(iconHome)} ${t('search.home')}</button>

          ${persons.map(p => html`
            <button
              class="quick-btn ${this._destMode === 'person' && this._destPersonEntity === p ? 'active' : ''}"
              @click=${() => { this._destMode = 'person'; this._destPersonEntity = p; }}
            >${this._renderIcon(iconPerson)} ${this._entityName(p)}</button>
          `)}

          ${zones.map(z => html`
            <button
              class="quick-btn ${this._destMode === 'zone' && this._destZoneEntity === z ? 'active' : ''}"
              @click=${() => { this._destMode = 'zone'; this._destZoneEntity = z; }}
            >${this._renderIcon(iconZone)} ${this._zoneName(z)}</button>
          `)}

          <button
            class="quick-btn ${this._destMode === 'text' ? 'active' : ''}"
            @click=${() => { this._destMode = 'text'; }}
          >${this._renderIcon(iconSearch)} ${t('search.type_stop')}</button>
        </div>

        ${this._destMode === 'text'
          ? html`
            <div class="text-input-wrap">
              <input
                class="stop-input"
                type="text"
                .value=${this._destText}
                placeholder="${t('search.placeholder_destination')}"
                autocomplete="off"
                @input=${(e: Event) => {
                  const v = (e.target as HTMLInputElement).value;
                  this._destText = v;
                  this._destStopId = null;
                  this._destLookup(v);
                }}
                @blur=${() => setTimeout(() => { this._destSuggestionsOpen = false; }, 200)}
                @focus=${() => { if (this._destSuggestions.length) this._destSuggestionsOpen = true; }}
              />
              ${this._destSuggestionsOpen && this._destSuggestions.length
                ? html`<div class="suggestions">
                    ${this._destSuggestions.map(s => html`
                      <div class="suggestion-item" @mousedown=${() => this._selectDestSuggestion(s)}>
                        <span class="suggestion-name">${s.name}</span>
                        ${s.transport_modes?.length
                          ? html`<span class="suggestion-meta">${s.transport_modes.join(', ')}</span>`
                          : nothing}
                      </div>
                    `)}
                  </div>`
                : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderResults() {
    const t = (p: string, v?: Record<string, any>) => this.t(p, v);

    if (this._trips.length === 0) {
      return html`<div class="no-trips">${t('search.no_results')}</div>`;
    }

    const maxLegs = this._config.max_legs ?? 12;

    return html`
      <div>
        <div class="results-header">${t('search.results_title')}</div>
        <div class="trip-list">
          ${this._trips.map(trip => this._renderTrip(trip, maxLegs))}
        </div>
      </div>
    `;
  }

  private _renderTrip(trip: Trip, maxLegs: number) {
    const legs = (trip.legs ?? []).filter(Boolean);
    const shown = legs.length > maxLegs
      ? [...legs.slice(0, Math.ceil(maxLegs / 2)), null, ...legs.slice(legs.length - Math.floor(maxLegs / 2))]
      : legs;

    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    const startStop = firstLeg ? TrafiklabDynamicTravelCard._fromStop(firstLeg) : undefined;
    const endStop = lastLeg ? TrafiklabDynamicTravelCard._toStop(lastLeg) : undefined;
    const depTime = firstLeg ? (firstLeg.departure || firstLeg.origin_time) : undefined;
    const arrTime = lastLeg ? (lastLeg.arrival || lastLeg.dest_time) : undefined;

    return html`
      <div class="trip">
        ${startStop
          ? html`<span class="leg-endpoint start">
              ${this._renderIcon(mapMarker)}
              ${startStop.name || this.t('label.start')}
              ${depTime ? html` <span class="muted">${this._shortTime(depTime)}</span>` : nothing}
            </span>`
          : nothing}

        ${shown.map((leg, i) => {
          if (leg === null) return html`<span class="arrow">${this._renderIcon('mdi:dots-horizontal')}</span>`;
          return html`
            <span class="arrow">${this._renderIcon(arrowRight)}</span>
            ${this._renderLeg(leg as Leg)}
          `;
        })}

        ${endStop
          ? html`
            <span class="arrow">${this._renderIcon(arrowRight)}</span>
            <span class="leg-endpoint end">
              ${this._renderIcon(mapMarker)}
              ${endStop.name || this.t('label.end')}
              ${arrTime ? html` <span class="muted">${this._shortTime(arrTime)}</span>` : nothing}
            </span>`
          : nothing}

        ${trip.duration != null
          ? html`<div class="trip-meta">${this._formatDuration(trip.duration)}</div>`
          : nothing}

        ${this._config.show_details ? this._renderTripDetail(legs) : nothing}
      </div>
    `;
  }

  private _renderLeg(leg: Leg) {
    const type = TrafiklabDynamicTravelCard._legType(leg);
    const line = TrafiklabDynamicTravelCard._legLine(leg);
    const label = [this._prettyType(type), line ? ` ${line}` : undefined].filter(Boolean).join('');

    return html`
      <span class="leg">
        ${this._renderIcon(modeIcon(type))}
        <span class="line">${label || '—'}</span>
      </span>
    `;
  }

  private _renderTripDetail(legs: Leg[]) {
    return html`
      <div class="trip-detail">
        ${legs.map(l => {
          const from = TrafiklabDynamicTravelCard._fromStop(l);
          const to = TrafiklabDynamicTravelCard._toStop(l);
          const dep = (l.departure || l.origin_time) ? this._shortTime(l.departure || l.origin_time!) : undefined;
          const arr = (l.arrival || l.dest_time) ? this._shortTime(l.arrival || l.dest_time!) : undefined;
          const type = this._prettyType(TrafiklabDynamicTravelCard._legType(l));
          const line = TrafiklabDynamicTravelCard._legLine(l);
          return html`<div>• ${type}${line ? ` ${line}` : ''}: ${from?.name || '—'} ${dep ? `(${dep})` : ''} → ${to?.name || '—'} ${arr ? `(${arr})` : ''}</div>`;
        })}
      </div>
    `;
  }

  // ─────────────────────────────────────────
  // Static helpers (leg data extraction)
  // ─────────────────────────────────────────

  private static _stop(obj?: StopLike | Record<string, any>): StopLike | undefined {
    if (!obj || typeof obj !== 'object') return undefined;
    const s = obj as any;
    return {
      name: s.name ?? s.stop_name ?? s.stop ?? undefined,
      id: s.id ?? s.stop_id ?? undefined,
      lat: s.lat ?? s.latitude ?? undefined,
      lon: s.lon ?? s.lng ?? s.longitude ?? undefined,
    };
  }

  private static _legType(leg: Leg): string {
    const t = (leg.category || leg.type || leg.mode || leg.product?.category || leg.product?.mode || '').toString();
    return t.toLowerCase();
  }

  private static _legLine(leg: Leg): string | undefined {
    const l = leg.line ?? leg.line_number ?? leg.number ?? leg.product?.line;
    return l !== undefined && l !== null ? String(l) : undefined;
  }

  private static _fromStop(leg: Leg): StopLike | undefined {
    return TrafiklabDynamicTravelCard._stop((leg as any).from || (leg as any).origin);
  }

  private static _toStop(leg: Leg): StopLike | undefined {
    return TrafiklabDynamicTravelCard._stop((leg as any).to || (leg as any).destination);
  }

  private _prettyType(t?: string): string {
    if (!t) return '';
    const s = t.toLowerCase();
    if (/walk|foot|gå/.test(s)) return this.t('label.mode_walk');
    if (/bus|buss/.test(s)) return this.t('label.mode_bus');
    if (/train|tå|rail/.test(s)) return this.t('label.mode_train');
    if (/metro|subway|tunnelbana/.test(s)) return this.t('label.mode_metro');
    if (/tram|spårvagn/.test(s)) return this.t('label.mode_tram');
    if (/ferry|boat|båt/.test(s)) return this.t('label.mode_boat');
    if (/car|bil|taxi/.test(s)) return this.t('label.mode_taxi');
    if (/transfer|byte/.test(s)) return this.t('label.transfer');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  private _shortTime(s?: string): string {
    if (!s) return '';
    try {
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      // Handle "YYYY-MM-DD HH:MM" or "HH:MM" formats
      const m = /(\d{2}:\d{2})/.exec(s);
      if (m) return m[1];
    } catch (_) {}
    return s;
  }

  private _formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return this.t('label.duration', { h, m });
    return this.t('label.duration_min', { m });
  }
}

// Register custom element
customElements.define(CARD_TYPE, TrafiklabDynamicTravelCard);

// Register with HA Lovelace UI
// @ts-ignore
window.customCards = window.customCards || [];
// @ts-ignore
window.customCards.push({
  type: CARD_TYPE,
  name: CARD_NAME,
  description: CARD_DESC,
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    [CARD_TYPE]: TrafiklabDynamicTravelCard;
  }
}
