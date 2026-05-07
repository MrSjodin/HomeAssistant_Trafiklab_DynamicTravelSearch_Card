import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { localize } from './localize';
import type { DynamicTravelCardConfig } from './types';

type HomeAssistant = any;

export class TrafiklabDynamicTravelCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: DynamicTravelCardConfig;

  setConfig(config: DynamicTravelCardConfig) {
    const base: DynamicTravelCardConfig = {
      type: 'custom:trafiklab-dynamic-travel-card',
      home_zone: 'zone.home',
      max_items: 3,
      max_legs: 12,
      include_platform: false,
      max_walking_distance: 1000,
    };
    this._config = { ...base, ...config };
  }

  private _valueChanged(ev: Event) {
    if (!this._config) return;
    const target = ev.currentTarget as any;
    const detail = (ev as CustomEvent).detail;
    const key = target?.configValue ?? target?.dataset?.configValue;
    if (!key) return;

    const newConfig = { ...this._config } as any;
    let value = detail?.value ?? target.value ?? target.checked;

    if (target?.type === 'checkbox') {
      value = target.checked;
    } else if (key === 'max_legs' || key === 'max_items' || key === 'max_walking_distance') {
      const n = Number(value);
      if (!Number.isNaN(n)) value = n;
    }

    if (value !== undefined) newConfig[key] = value;

    if (JSON.stringify(newConfig) !== JSON.stringify(this._config)) {
      this._config = newConfig;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    }
  }

  private _haFormValueChanged(e: CustomEvent) {
    const value = (e.detail as any)?.value || {};
    const next: DynamicTravelCardConfig = {
      ...(this._config || { type: 'custom:trafiklab-dynamic-travel-card' }),
      title: value.title,
      config_entry_id: value.config_entry_id,
      api_key: value.api_key,
      my_location_entity: value.my_location_entity,
      home_zone: value.home_zone || 'zone.home',
      max_legs: typeof value.max_legs === 'number' ? value.max_legs : Number(value.max_legs) || 12,
      include_platform: !!value.include_platform,
      max_items: typeof value.max_items === 'number' ? value.max_items : Number(value.max_items) || 3,
      max_walking_distance: typeof value.max_walking_distance === 'number' ? value.max_walking_distance : Number(value.max_walking_distance) || 1000,
      show_persons: value.show_persons !== false,
      show_zones: value.show_zones !== false,
    };
    // Drop legacy config fields that are now auto-fetched from HA
    delete (next as any).persons;
    delete (next as any).zones;
    if (JSON.stringify(next) !== JSON.stringify(this._config)) {
      this._config = next;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: next } }));
    }
  }

  render() {
    const t = (p: string) => localize(this.hass, p);
    const cfg = this._config;
    if (!cfg) return html``;

    const hasHaForm = !!customElements.get('ha-form');
    const hasTextfield = !!customElements.get('ha-textfield');

    if (hasHaForm) {
      const schema = [
        { name: 'title', selector: { text: {} } },
        { name: 'config_entry_id', selector: { config_entry: { integration: 'trafiklab' } } },
        { name: 'my_location_entity', selector: { entity: { domain: ['person', 'device_tracker'] } } },
        { name: 'home_zone', selector: { entity: { domain: 'zone' } } },
        { name: 'max_items', selector: { number: { min: 1, max: 10, mode: 'box' } } },
        { name: 'max_legs', selector: { number: { min: 1, max: 20, mode: 'box' } } },
        { name: 'max_walking_distance', selector: { number: { min: 0, max: 5000, step: 100, mode: 'slider', unit_of_measurement: 'm' } } },
        { name: 'include_platform', selector: { boolean: {} } },
        { name: 'show_persons', selector: { boolean: {} } },
        { name: 'show_zones', selector: { boolean: {} } },
      ] as any;

      const data: any = {
        title: cfg.title ?? '',
        config_entry_id: cfg.config_entry_id ?? '',
        my_location_entity: cfg.my_location_entity ?? '',
        home_zone: cfg.home_zone ?? 'zone.home',
        max_items: cfg.max_items ?? 3,
        max_legs: cfg.max_legs ?? 12,
        max_walking_distance: cfg.max_walking_distance ?? 1000,
        include_platform: cfg.include_platform ?? false,
        show_persons: cfg.show_persons !== false,
        show_zones: cfg.show_zones !== false,
      };

      return html`
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${(s: any) => {
            switch (s.name) {
              case 'title': return 'Card title';
              case 'config_entry_id': return t('editor.config_entry_id');
              case 'my_location_entity': return t('editor.my_location_entity');
              case 'home_zone': return t('editor.home_zone');
              case 'max_items': return t('editor.max_items');
              case 'max_legs': return t('editor.max_legs');
              case 'max_walking_distance': return t('editor.max_walking_distance');
              case 'include_platform': return t('editor.include_platform');
              case 'show_persons': return t('editor.show_persons');
              case 'show_zones': return t('editor.show_zones');
              default: return String(s.name);
            }
          }}
          .computeHelper=${(s: any) => {
            switch (s.name) {
              case 'config_entry_id': return t('editor.help_config_entry_id');
              case 'my_location_entity': return t('editor.help_my_location_entity');
              case 'home_zone': return t('editor.help_home_zone');
              case 'max_items': return t('editor.help_max_items');
              case 'max_legs': return t('editor.help_max_legs');
              case 'max_walking_distance': return t('editor.help_max_walking_distance');
              case 'include_platform': return t('editor.help_include_platform');
              case 'show_persons': return t('editor.help_show_persons');
              case 'show_zones': return t('editor.help_show_zones');
              default: return undefined;
            }
          }}
          @value-changed=${this._haFormValueChanged}
        ></ha-form>

      `;
    }

    // Fallback when ha-form is not available
    return html`
      <div class="card-config">
        <div class="field">
          <label class="lbl">Card title
            <input type="text" .value=${cfg.title ?? ''} data-config-value="title" @input=${(e: Event) => this._valueChanged(e)} />
          </label>
        </div>
        <div class="field">
          <label class="lbl">${t('editor.config_entry_id')}
            <input type="text" .value=${cfg.config_entry_id ?? ''} data-config-value="config_entry_id" @input=${(e: Event) => this._valueChanged(e)} />
          </label>
          <div class="help">${t('editor.help_config_entry_id')}</div>
        </div>
        <div class="field">
          <label class="lbl">${t('editor.my_location_entity')}
            <input type="text" .value=${cfg.my_location_entity ?? ''} placeholder="person.john" data-config-value="my_location_entity" @input=${(e: Event) => this._valueChanged(e)} />
          </label>
          <div class="help">${t('editor.help_my_location_entity')}</div>
        </div>
        <div class="field">
          <label class="lbl">${t('editor.home_zone')}
            <input type="text" .value=${cfg.home_zone ?? 'zone.home'} data-config-value="home_zone" @input=${(e: Event) => this._valueChanged(e)} />
          </label>
          <div class="help">${t('editor.help_home_zone')}</div>
        </div>
        <div class="field">
          ${hasTextfield
            ? html`<ha-textfield .label=${t('editor.max_items')} .value=${String(cfg.max_items ?? 3)} .configValue=${'max_items'} type="number" min="1" max="10" @value-changed=${this._valueChanged} @input=${this._valueChanged}></ha-textfield>`
            : html`<label class="lbl">${t('editor.max_items')}<input type="number" min="1" max="10" .value=${String(cfg.max_items ?? 3)} data-config-value="max_items" @input=${(e: Event) => this._valueChanged(e)} /></label>`}
        </div>
        <div class="field">
          ${hasTextfield
            ? html`<ha-textfield .label=${t('editor.max_legs')} .value=${String(cfg.max_legs ?? 12)} .configValue=${'max_legs'} type="number" min="1" max="20" @value-changed=${this._valueChanged} @input=${this._valueChanged}></ha-textfield>`
            : html`<label class="lbl">${t('editor.max_legs')}<input type="number" min="1" max="20" .value=${String(cfg.max_legs ?? 12)} data-config-value="max_legs" @input=${(e: Event) => this._valueChanged(e)} /></label>`}
        </div>
        <div class="field">
          ${hasTextfield
            ? html`<ha-textfield .label=${t('editor.max_walking_distance')} .value=${String(cfg.max_walking_distance ?? 1000)} .configValue=${'max_walking_distance'} type="number" min="0" max="5000" @value-changed=${this._valueChanged} @input=${this._valueChanged}></ha-textfield>`
            : html`<label class="lbl">${t('editor.max_walking_distance')}<input type="number" min="0" max="5000" .value=${String(cfg.max_walking_distance ?? 1000)} data-config-value="max_walking_distance" @input=${(e: Event) => this._valueChanged(e)} /></label>`}
        </div>
        <div class="field">
          <label class="lbl"><input type="checkbox" ?checked=${cfg.include_platform ?? false} data-config-value="include_platform" @change=${(e: Event) => this._valueChanged(e)} /> ${t('editor.include_platform')}</label>
          <div class="help">${t('editor.help_include_platform')}</div>
        </div>
        <div class="field">
          <label class="lbl"><input type="checkbox" ?checked=${cfg.show_persons !== false} data-config-value="show_persons" @change=${(e: Event) => this._valueChanged(e)} /> ${t('editor.show_persons')}</label>
          <div class="help">${t('editor.help_show_persons')}</div>
        </div>
        <div class="field">
          <label class="lbl"><input type="checkbox" ?checked=${cfg.show_zones !== false} data-config-value="show_zones" @change=${(e: Event) => this._valueChanged(e)} /> ${t('editor.show_zones')}</label>
          <div class="help">${t('editor.help_show_zones')}</div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .card-config, .extra-fields { display: grid; gap: 12px; margin-top: 8px; }
    .field { display: grid; gap: 4px; }
    .lbl { display: grid; gap: 4px; font: inherit; color: var(--primary-text-color); }
    .help { font-size: 0.8em; color: var(--secondary-text-color); }
    input[type="text"], input[type="number"] {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      width: 100%;
      box-sizing: border-box;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
  `;
}

customElements.define('trafiklab-dynamic-travel-card-editor', TrafiklabDynamicTravelCardEditor);
