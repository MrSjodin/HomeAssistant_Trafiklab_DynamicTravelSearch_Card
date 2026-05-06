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

type OriginMode = 'my_location' | 'gps' | 'home' | 'zone' | 'text';
type DestMode = 'home' | 'my_location' | 'gps' | 'person' | 'zone' | 'text';

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
  @state() private _originZoneEntity = '';
  @state() private _originSuggestions: StopSuggestion[] = [];
  @state() private _originSuggestionsOpen = false;

  @state() private _destMode: DestMode = 'home';
  @state() private _destPersonEntity = '';
  @state() private _destZoneEntity = '';
  @state() private _destText = '';
  @state() private _destStopId: string | null = null;
  @state() private _destSuggestions: StopSuggestion[] = [];
  @state() private _destSuggestionsOpen = false;

  // ── GPS / device location state ──
  @state() private _gpsCoords: { lat: number; lon: number } | null = null;
  @state() private _gpsLoading = false;
  private _gpsInitDone = false;

  // ── Results state ──
  @state() private _trips: Trip[] = [];
  @state() private _loading = false;
  @state() private _error: string | null = null;
  @state() private _hasSearched = false;
  @state() private _expandedTripIndex: number | null = null;
  @state() private _originLabel = '';
  @state() private _destLabel = '';

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

  connectedCallback() {
    super.connectedCallback();
    // GPS init runs in updated() once hass (and entity attributes) are available.
  }

  protected updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (!changed.has('hass') || !this.hass || this._gpsInitDone) return;
    this._gpsInitDone = true;

    // Primary path (companion app): read coordinates directly from the HA entity.
    // The companion app sends device location to HA via device_tracker/person
    // entities — their attributes are reliable, unlike navigator.geolocation
    // inside the companion app's WebView.
    const entityCoords = this._coordsFromEntity();
    if (entityCoords) {
      this._gpsCoords = entityCoords;
      if (this._originMode === 'my_location' || this._originMode === 'gps') {
        this._originMode = 'gps';
      }
      return;
    }

    // Fallback: browser geolocation (regular browser with permission already granted).
    if (typeof navigator === 'undefined' || !navigator.permissions) return;
    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then(result => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            pos => {
              this._gpsCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
              if (this._originMode === 'my_location' || this._originMode === 'gps') {
                this._originMode = 'gps';
              }
            },
            () => {},
          );
        }
      })
      .catch(() => {});
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

  /**
   * Returns coordinates from the configured my_location_entity attributes.
   * This is the primary source in the HA companion app (device_tracker/person
   * entities carry live lat/lon from the app's own location tracking).
   */
  private _coordsFromEntity(): { lat: number; lon: number } | null {
    const entityId = this._config?.my_location_entity || this._findCurrentUserEntity();
    if (!entityId || !this.hass?.states?.[entityId]) return null;
    const { latitude, longitude } = this.hass.states[entityId].attributes;
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      return { lat: latitude, lon: longitude };
    }
    return null;
  }

  /**
   * Finds the person.* entity linked to the currently logged-in HA user.
   * person entities carry a user_id attribute that matches hass.user.id.
   * Returns null if no match is found.
   */
  private _findCurrentUserEntity(): string | null {
    const userId = this.hass?.user?.id;
    if (!userId || !this.hass?.states) return null;
    const match = Object.keys(this.hass.states).find(
      id => id.startsWith('person.') &&
        this.hass.states[id].attributes?.user_id === userId,
    );
    return match ?? null;
  }

  /**
   * Returns true if device location can be obtained — either via an HA entity
   * (companion app) or via the browser Geolocation API.
   */
  private _hasGeolocation(): boolean {
    if (this._config?.my_location_entity) return true;
    if (this._findCurrentUserEntity()) return true;
    return typeof navigator !== 'undefined' && !!navigator.geolocation;
  }

  /**
   * Resolve the current device location and activate GPS mode for the given
   * field. Entity attributes are tried first (companion app); browser
   * geolocation is used as a fallback for regular browsers.
   */
  private _requestGps(target: 'origin' | 'dest') {
    const setMode = () => {
      if (target === 'origin') this._originMode = 'gps';
      else this._destMode = 'gps';
    };

    // Preferred: read from HA entity (works in companion app WebView).
    const entityCoords = this._coordsFromEntity();
    if (entityCoords) {
      this._gpsCoords = entityCoords;
      setMode();
      return;
    }

    // Fallback: browser Geolocation API.
    if (!navigator?.geolocation) {
      this._error = this.t('error.gps_unavailable');
      return;
    }
    if (this._gpsCoords) {
      setMode();
      return;
    }
    this._gpsLoading = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this._gpsCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        this._gpsLoading = false;
        setMode();
      },
      () => {
        this._gpsLoading = false;
        this._error = this.t('error.gps_unavailable');
      },
      { timeout: 15000 },
    );
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
    const prevOriginMode = this._originMode;
    const prevOriginText = this._originText;
    const prevOriginStopId = this._originStopId;
    const prevOriginZoneEntity = this._originZoneEntity;

    const prevDestMode = this._destMode;
    const prevDestText = this._destText;
    const prevDestStopId = this._destStopId;
    const prevDestPersonEntity = this._destPersonEntity;
    const prevDestZoneEntity = this._destZoneEntity;

    // Map destination mode → origin mode
    if (prevDestMode === 'text') {
      this._originMode = 'text';
      this._originText = prevDestText;
      this._originStopId = prevDestStopId;
    } else if (prevDestMode === 'zone') {
      this._originMode = 'zone';
      this._originZoneEntity = prevDestZoneEntity;
    } else if (prevDestMode === 'home') {
      this._originMode = 'home';
    } else if (prevDestMode === 'gps') {
      this._originMode = 'gps';
    } else {
      // my_location / person → origin my_location
      this._originMode = 'my_location';
    }
    this._originSuggestions = [];
    this._originSuggestionsOpen = false;

    // Map origin mode → destination mode
    if (prevOriginMode === 'text') {
      this._destMode = 'text';
      this._destText = prevOriginText;
      this._destStopId = prevOriginStopId;
    } else if (prevOriginMode === 'zone') {
      this._destMode = 'zone';
      this._destZoneEntity = prevOriginZoneEntity;
    } else if (prevOriginMode === 'home') {
      this._destMode = 'home';
    } else if (prevOriginMode === 'gps') {
      this._destMode = 'gps';
    } else {
      // my_location → dest my_location
      this._destMode = 'my_location';
    }
    this._destSuggestions = [];
    this._destSuggestionsOpen = false;

    this._destPersonEntity = prevDestPersonEntity;
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
    } else if (this._originMode === 'home') {
      originValue = this._config.home_zone || 'zone.home';
      originType = 'zone';
    } else if (this._originMode === 'gps') {
      // Always refresh from entity at search time so coordinates are current.
      const fresh = this._coordsFromEntity();
      if (fresh) this._gpsCoords = fresh;
      if (!this._gpsCoords) {
        this._error = this.t('error.gps_unavailable');
        return;
      }
      originValue = `${this._gpsCoords.lat},${this._gpsCoords.lon}`;
      originType = 'coordinates';
    } else if (this._originMode === 'zone') {
      if (!this._originZoneEntity) {
        this._error = this.t('error.origin_required');
        return;
      }
      originValue = this._originZoneEntity;
      originType = 'zone';
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
    } else if (this._destMode === 'my_location') {
      const entity = this._config.my_location_entity;
      if (!entity) {
        this._error = this.t('error.my_location_not_configured');
        return;
      }
      destinationValue = entity;
      destinationType = 'person';
    } else if (this._destMode === 'gps') {
      // Always refresh from entity at search time so coordinates are current.
      const freshDest = this._coordsFromEntity();
      if (freshDest) this._gpsCoords = freshDest;
      if (!this._gpsCoords) {
        this._error = this.t('error.gps_unavailable');
        return;
      }
      destinationValue = `${this._gpsCoords.lat},${this._gpsCoords.lon}`;
      destinationType = 'coordinates';
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

    // Compute display labels so coordinate-only names can be replaced in results
    if (this._originMode === 'my_location') {
      this._originLabel = this.t('search.my_location');
    } else if (this._originMode === 'home') {
      this._originLabel = this._zoneName(this._config.home_zone || 'zone.home');
    } else if (this._originMode === 'gps') {
      this._originLabel = this.t('search.gps_location');
    } else if (this._originMode === 'zone') {
      this._originLabel = this._zoneName(this._originZoneEntity);
    } else {
      this._originLabel = this._originText.trim();
    }
    if (this._destMode === 'home') {
      this._destLabel = this._zoneName(this._config.home_zone || 'zone.home');
    } else if (this._destMode === 'my_location') {
      this._destLabel = this.t('search.my_location');
    } else if (this._destMode === 'gps') {
      this._destLabel = this.t('search.gps_location');
    } else if (this._destMode === 'person') {
      this._destLabel = this._entityName(this._destPersonEntity);
    } else if (this._destMode === 'zone') {
      this._destLabel = this._zoneName(this._destZoneEntity);
    } else {
      this._destLabel = this._destText.trim();
    }

    this._loading = true;
    this._trips = [];
    this._hasSearched = false;
    this._expandedTripIndex = null;

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
  // Zone helpers
  // ─────────────────────────────────────────

  /** Returns all zone.* entities from HA, sorted by friendly name. */
  private _availableZones(): Array<{ entity_id: string; name: string }> {
    if (!this.hass?.states) return [];
    return Object.keys(this.hass.states)
      .filter(id => id.startsWith('zone.'))
      .map(id => ({
        entity_id: id,
        name: this.hass.states[id].attributes?.friendly_name || id.split('.').pop() || id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
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
        </div>

        ${this._renderDestinationSection()}

        <div class="search-row">
          <button
            class="search-btn"
            ?disabled=${this._loading}
            @click=${this._search}
          >
            ${this._renderIcon(this._loading ? iconLoading : iconSearch)}
            ${this._loading ? t('search.searching') : t('search.search_btn')}
          </button>
        </div>

        ${this._error
          ? html`<div class="error-row">${this._error}</div>`
          : nothing}

        ${this._hasSearched ? this._renderResults() : nothing}
      </ha-card>
    `;
  }

  private _renderOriginSection() {
    const t = (p: string) => this.t(p);
    const hasMyLocation = !!this._config.my_location_entity;
    const zones = this._availableZones();

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
          ${this._hasGeolocation()
            ? html`<button
                class="quick-btn ${this._originMode === 'gps' ? 'active' : ''}"
                ?disabled=${this._gpsLoading}
                @click=${() => this._requestGps('origin')}
              >${this._renderIcon(this._gpsLoading ? iconLoading : mapMarker)}
              ${this._gpsCoords ? t('search.gps_location') : t('search.get_gps')}</button>`
            : nothing}
          <button
            class="quick-btn ${this._originMode === 'home' ? 'active' : ''}"
            @click=${() => { this._originMode = 'home'; }}
          >${this._renderIcon(iconHome)} ${t('search.home')}</button>
          <button
            class="quick-btn ${this._originMode === 'zone' ? 'active' : ''}"
            @click=${() => { this._originMode = 'zone'; }}
          >${this._renderIcon(iconZone)} ${t('search.zone')}</button>
          <button
            class="quick-btn ${this._originMode === 'text' ? 'active' : ''}"
            @click=${() => { this._originMode = 'text'; }}
          >${this._renderIcon(iconSearch)} ${t('search.type_stop')}</button>
        </div>

        ${this._originMode === 'zone'
          ? html`
            <select
              class="stop-input"
              @change=${(e: Event) => { this._originZoneEntity = (e.target as HTMLSelectElement).value; }}
            >
              <option value="" ?selected=${!this._originZoneEntity}>${t('search.select_zone')}</option>
              ${zones.map(z => html`
                <option value=${z.entity_id} ?selected=${this._originZoneEntity === z.entity_id}>${z.name}</option>
              `)}
            </select>`
          : nothing}

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
    const hasMyLocation = !!this._config.my_location_entity;
    const persons = this._config.persons ?? [];
    const zones = this._availableZones();

    return html`
      <div class="search-section">
        <div class="section-label">${t('search.destination_label')}</div>
        <div class="quick-buttons">
          ${hasMyLocation
            ? html`<button
                class="quick-btn ${this._destMode === 'my_location' ? 'active' : ''}"
                @click=${() => { this._destMode = 'my_location'; }}
              >${this._renderIcon(iconPerson)} ${t('search.my_location')}</button>`
            : nothing}
          ${this._hasGeolocation()
            ? html`<button
                class="quick-btn ${this._destMode === 'gps' ? 'active' : ''}"
                ?disabled=${this._gpsLoading}
                @click=${() => this._requestGps('dest')}
              >${this._renderIcon(this._gpsLoading ? iconLoading : mapMarker)}
              ${this._gpsCoords ? t('search.gps_location') : t('search.get_gps')}</button>`
            : nothing}
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

          <button
            class="quick-btn ${this._destMode === 'zone' ? 'active' : ''}"
            @click=${() => { this._destMode = 'zone'; }}
          >${this._renderIcon(iconZone)} ${t('search.zone')}</button>

          <button
            class="quick-btn ${this._destMode === 'text' ? 'active' : ''}"
            @click=${() => { this._destMode = 'text'; }}
          >${this._renderIcon(iconSearch)} ${t('search.type_stop')}</button>
        </div>

        ${this._destMode === 'zone'
          ? html`
            <select
              class="stop-input"
              @change=${(e: Event) => { this._destZoneEntity = (e.target as HTMLSelectElement).value; }}
            >
              <option value="" ?selected=${!this._destZoneEntity}>${t('search.select_zone')}</option>
              ${zones.map(z => html`
                <option value=${z.entity_id} ?selected=${this._destZoneEntity === z.entity_id}>${z.name}</option>
              `)}
            </select>`
          : nothing}

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
          ${this._trips.map((trip, index) => this._renderTrip(trip, maxLegs, index))}
        </div>
      </div>
    `;
  }

  private _renderTrip(trip: Trip, maxLegs: number, index: number) {
    const legs = (trip.legs ?? []).filter(Boolean);
    const shown = legs.length > maxLegs
      ? [...legs.slice(0, Math.ceil(maxLegs / 2)), null, ...legs.slice(legs.length - Math.floor(maxLegs / 2))]
      : legs;

    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    const depTime = firstLeg ? (firstLeg.departure || firstLeg.origin_time) : undefined;
    const arrTime = lastLeg ? (lastLeg.arrival || lastLeg.dest_time) : undefined;
    const isExpanded = this._expandedTripIndex === index;

    return html`
      <div class="trip ${isExpanded ? 'trip--expanded' : ''}" @click=${() => this._toggleTripExpand(index)}>
        ${shown.map((leg, i) => {
          if (leg === null) return html`<span class="arrow">${this._renderIcon('mdi:dots-horizontal')}</span>`;
          if (i === 0) {
            return html`
              ${depTime ? html`<span class="trip-time">${this._shortTime(depTime)}</span>` : nothing}
              ${this._renderLeg(leg as Leg)}
            `;
          }
          return html`
            <span class="arrow">${this._renderIcon(arrowRight)}</span>
            ${this._renderLeg(leg as Leg)}
          `;
        })}

        ${arrTime ? html`<span class="trip-time">${this._shortTime(arrTime)}</span>` : nothing}

        <div class="trip-meta">
          ${(trip.duration ?? trip.duration_total) != null ? html`<span>${this._formatDuration(trip.duration ?? trip.duration_total!)}</span>` : nothing}
          <span class="trip-chevron ${isExpanded ? 'open' : ''}">${this._renderIcon('mdi:chevron-down')}</span>
        </div>

        ${this._config.show_details && !isExpanded ? this._renderTripDetail(legs) : nothing}

        ${isExpanded ? this._renderTripExpanded(legs) : nothing}
      </div>
    `;
  }

  private _toggleTripExpand(index: number) {
    this._expandedTripIndex = this._expandedTripIndex === index ? null : index;
  }

  private _renderTripStops(legs: Leg[]) {
    if (!legs.length) return nothing;
    const stops: string[] = [];
    const firstFrom = TrafiklabDynamicTravelCard._fromStop(legs[0]);
    if (firstFrom?.name) stops.push(firstFrom.name);
    for (const leg of legs) {
      const to = TrafiklabDynamicTravelCard._toStop(leg);
      if (to?.name) stops.push(to.name);
    }
    if (stops.length < 2) return nothing;
    const last = stops.length - 1;
    return html`
      <div class="trip-stops">
        ${stops.map((name, i) => html`
          ${i > 0 ? html`<span class="trip-stops-sep">›</span>` : nothing}
          <span class="trip-stop-name ${i === 0 || i === last ? 'trip-stop-endpoint' : ''}">${name}</span>
        `)}
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

  private _renderTripExpanded(legs: Leg[]) {
    if (!legs.length) return nothing;

    const firstLeg = legs[0];
    const firstFrom = TrafiklabDynamicTravelCard._fromStop(firstLeg);
    const firstDep = firstLeg.departure || firstLeg.origin_time;

    return html`
      <div class="trip-expand">
        <div class="tl">
          <!-- start stop -->
          <div class="tl-time">${firstDep ? this._shortTime(firstDep) : ''}</div>
          <div class="tl-node">
            <div class="tl-dot tl-dot-start"></div>
            <div class="tl-line-seg"></div>
          </div>
          <div class="tl-stop-cell">
            <span class="tl-stop-name">${this._resolveStopDisplay(firstFrom?.name, 'origin')}</span>
          </div>

          ${legs.map((leg, i) => {
            const isLast = i === legs.length - 1;
            const to = TrafiklabDynamicTravelCard._toStop(leg);
            const arr = leg.arrival || leg.dest_time;
            const nextLeg = !isLast ? legs[i + 1] : undefined;
            const nextDep = nextLeg ? (nextLeg.departure || nextLeg.origin_time) : undefined;
            const transferMin = !isLast ? this._calcTransfer(arr, nextDep) : null;

            const type = TrafiklabDynamicTravelCard._legType(leg);
            const line = TrafiklabDynamicTravelCard._legLine(leg);
            const isWalk = /walk|foot|gå/.test(type);
            const distance = (leg as any).distance as number | undefined;
            const duration = leg.duration;

            return html`
              <!-- leg connector -->
              <div class="tl-time"></div>
              <div class="tl-node tl-node-line">
                <div class="tl-line-seg"></div>
              </div>
              <div class="tl-leg-cell">
                ${this._renderIcon(modeIcon(type))}
                ${line ? html`<span class="tl-leg-line">${line}</span>` : nothing}
                ${leg.direction ? html`<span class="tl-leg-meta tl-leg-dir">→ ${leg.direction}</span>` : nothing}
                ${isWalk && distance ? html`<span class="tl-leg-meta">${this._formatDistance(distance)}</span>` : nothing}
                ${duration != null ? html`<span class="tl-leg-meta">${this._formatDuration(duration)}</span>` : nothing}
              </div>

              <!-- arrival / intermediate stop -->
              <div class="tl-time">${arr ? this._shortTime(arr) : ''}</div>
              <div class="tl-node">
                <div class="tl-dot ${isLast ? 'tl-dot-end' : 'tl-dot-mid'}"></div>
                ${!isLast ? html`<div class="tl-line-seg"></div>` : nothing}
              </div>
              <div class="tl-stop-cell">
                <span class="tl-stop-name">${this._resolveStopDisplay(to?.name, isLast ? 'dest' : undefined)}</span>
                ${transferMin != null && transferMin > 0
                  ? html`<span class="tl-transfer-badge">${this.t('label.transfer')} · ${this._formatDuration(transferMin)}</span>`
                  : nothing}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _resolveStopDisplay(name?: string, role?: 'origin' | 'dest'): string {
    if (!name) return '—';
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(name.trim())) {
      if (role === 'origin') return this._originLabel || name;
      if (role === 'dest') return this._destLabel || name;
    }
    return name;
  }

  private _calcTransfer(arrStr?: string, depStr?: string): number | null {
    if (!arrStr || !depStr) return null;
    try {
      const arr = new Date(arrStr).getTime();
      const dep = new Date(depStr).getTime();
      if (isNaN(arr) || isNaN(dep)) return null;
      const diff = Math.round((dep - arr) / 60000);
      return diff > 0 ? diff : null;
    } catch (_) {
      return null;
    }
  }

  private _formatDistance(m: number): string {
    if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
    return `${Math.round(m)} m`;
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
    const obj = (leg as any).from || leg.origin;
    if (obj && typeof obj === 'object') return TrafiklabDynamicTravelCard._stop(obj);
    if (leg.origin_name) return { name: leg.origin_name };
    return undefined;
  }

  private static _toStop(leg: Leg): StopLike | undefined {
    const obj = (leg as any).to || leg.destination;
    if (obj && typeof obj === 'object') return TrafiklabDynamicTravelCard._stop(obj);
    if (leg.dest_name) return { name: leg.dest_name };
    return undefined;
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
