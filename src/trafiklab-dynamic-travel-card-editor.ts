import { LitElement, html, css } from 'lit';
import { localize } from './localize';
import type { DynamicTravelCardConfig } from './types';

type HomeAssistant = any;

export class TrafiklabDynamicTravelCardEditor extends LitElement {
  public hass?: HomeAssistant;
  private _config?: DynamicTravelCardConfig;

  setConfig(config: DynamicTravelCardConfig) {
    const base: DynamicTravelCardConfig = {
      type: 'custom:trafiklab-dynamic-travel-card',
      home_zone: 'zone.home',
      max_items: 3,
      max_legs: 12,
      show_details: false,
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
    } else if (key === 'persons' || key === 'zones') {
      // Convert comma-separated string to array
      value = String(value).split(',').map((s: string) => s.trim()).filter(Boolean);
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
      ...(this._config || { type: 'trafiklab-dynamic-travel-card' }),
      title: value.title,
      config_entry_id: value.config_entry_id,
      api_key: value.api_key,
      my_location_entity: value.my_location_entity,
      home_zone: value.home_zone || 'zone.home',
      show_details: !!value.show_details,
      max_legs: typeof value.max_legs === 'number' ? value.max_legs : Number(value.max_legs) || 12,
      max_items: typeof value.max_items === 'number' ? value.max_items : Number(value.max_items) || 3,
      max_walking_distance: typeof value.max_walking_distance === 'number' ? value.max_walking_distance : Number(value.max_walking_distance) || 1000,
    };
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
    const hasSwitch = !!customElements.get('ha-switch');
    const hasTextfield = !!customElements.get('ha-textfield');

    const personsStr = Array.isArray(cfg.persons) ? cfg.persons.join(', ') : (cfg.persons ?? '');
    const zonesStr = Array.isArray(cfg.zones) ? cfg.zones.join(', ') : (cfg.zones ?? '');

    if (hasHaForm) {
      const schema = [
        { name: 'title', selector: { text: {} } },
        { name: 'config_entry_id', selector: { config_entry: { integration: 'trafiklab' } } },
        { name: 'my_location_entity', selector: { entity: { domain: ['person', 'device_tracker'] } } },
        { name: 'home_zone', selector: { entity: { domain: 'zone' } } },
        { name: 'show_details', selector: { boolean: {} } },
        { name: 'max_items', selector: { number: { min: 1, max: 10, mode: 'box' } } },
        { name: 'max_legs', selector: { number: { min: 1, max: 20, mode: 'box' } } },
        { name: 'max_walking_distance', selector: { number: { min: 0, max: 5000, step: 100, mode: 'slider', unit_of_measurement: 'm' } } },
      ] as any;

      const data: any = {
        title: cfg.title ?? '',
        config_entry_id: cfg.config_entry_id ?? '',
        my_location_entity: cfg.my_location_entity ?? '',
        home_zone: cfg.home_zone ?? 'zone.home',
        show_details: cfg.show_details ?? false,
        max_items: cfg.max_items ?? 3,
        max_legs: cfg.max_legs ?? 12,
        max_walking_distance: cfg.max_walking_distance ?? 1000,
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
              case 'show_details': return t('editor.show_details');
              case 'max_items': return t('editor.max_items');
              case 'max_legs': return t('editor.max_legs');
              case 'max_walking_distance': return t('editor.max_walking_distance');
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
              default: return undefined;
            }
          }}
          @value-changed=${this._haFormValueChanged}
        ></ha-form>

        <!-- Person and zone lists cannot be represented with ha-form entity-list selector easily,
             so we fall back to text fields for those even in ha-form mode -->
        <div class="extra-fields">
          <div class="field">
            <label class="lbl">
              ${t('editor.persons')}
              <input
                type="text"
                .value=${personsStr}
                placeholder="person.john, person.jane"
                data-config-value="persons"
                @input=${(e: Event) => this._valueChanged(e)}
              />
            </label>
            <div class="help">${t('editor.help_persons')}</div>
          </div>
          <div class="field">
            <label class="lbl">
              ${t('editor.zones')}
              <input
                type="text"
                .value=${zonesStr}
                placeholder="zone.work, zone.gym"
                data-config-value="zones"
                @input=${(e: Event) => this._valueChanged(e)}
              />
            </label>
            <div class="help">${t('editor.help_zones')}</div>
          </div>
        </div>
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
          <label class="lbl">${t('editor.persons')}
            <input type="text" .value=${personsStr} placeholder="person.john, person.jane" data-config-value="persons" @input=${(e: Event) => this._valueChanged(e)} />
          </label>
          <div class="help">${t('editor.help_persons')}</div>
        </div>
        <div class="field">
          <label class="lbl">${t('editor.zones')}
            <input type="text" .value=${zonesStr} placeholder="zone.work, zone.gym" data-config-value="zones" @input=${(e: Event) => this._valueChanged(e)} />
          </label>
          <div class="help">${t('editor.help_zones')}</div>
        </div>
        <div class="field">
          ${hasSwitch
            ? html`<ha-formfield .label=${t('editor.show_details')}>
                <ha-switch .checked=${cfg.show_details ?? false} .configValue=${'show_details'} @change=${this._valueChanged}></ha-switch>
              </ha-formfield>`
            : html`<label class="lbl"><input type="checkbox" ?checked=${cfg.show_details} data-config-value="show_details" @change=${(e: Event) => this._valueChanged(e)} /> ${t('editor.show_details')}</label>`}
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
