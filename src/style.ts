import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    padding: 12px 12px 8px 12px;
  }
  .card-header {
    font-weight: 600;
    font-size: 1.1em;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  /* ── Search form ── */
  .search-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
  .section-label {
    font-size: 0.8em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }
  .quick-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .quick-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 20px;
    border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    font-size: 0.85em;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .quick-btn:hover {
    background: var(--secondary-background-color, rgba(0,0,0,0.05));
  }
  .quick-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .quick-btn ha-icon {
    --mdc-icon-size: 16px;
  }

  .text-input-wrap {
    position: relative;
  }
  .stop-input,
  select.stop-input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    font-size: 0.9em;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }
  .stop-input:focus,
  select.stop-input:focus {
    border-color: var(--primary-color);
  }
  .suggestions {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 2px);
    z-index: 100;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    max-height: 200px;
    overflow-y: auto;
  }
  .suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.88em;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.06));
  }
  .suggestion-item:last-child {
    border-bottom: none;
  }
  .suggestion-item:hover {
    background: var(--secondary-background-color, rgba(0,0,0,0.04));
  }
  .suggestion-name {
    font-weight: 500;
  }
  .suggestion-meta {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  /* ── Swap & Search row ── */
  .action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 4px 0 12px 0;
  }
  .swap-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    cursor: pointer;
    transition: background 0.15s;
  }
  .swap-btn:hover {
    background: var(--secondary-background-color, rgba(0,0,0,0.05));
  }
  .search-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: inherit;
  }
  .search-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .search-btn ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ── Status ── */
  .status-row {
    text-align: center;
    padding: 12px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .error-row {
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--error-color, #db4437);
    color: #fff;
    font-size: 0.88em;
    margin-bottom: 8px;
  }

  /* ── Results ── */
  .results-header {
    font-weight: 600;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }
  .trip-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .trip {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--tl-trip-gap, 4px);
    padding: 8px 10px;
    border-radius: 10px;
    background: var(--secondary-background-color, rgba(0,0,0,0.03));
  }
  .leg {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-pill-padding-y, 4px) var(--tl-pill-padding-x, 8px);
    border-radius: var(--tl-pill-radius, 12px);
    background: var(--tl-leg-pill-bg, var(--ha-card-background, rgba(0,0,0,0.06)));
    box-shadow: inset 0 0 0 1px var(--divider-color, rgba(0,0,0,0.1));
    font-size: var(--tl-font-size-leg, 0.85em);
  }
  .leg ha-icon {
    --mdc-icon-size: var(--tl-icon-size, 16px);
  }
  .leg .line {
    font-weight: 600;
  }
  .leg-endpoint {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-pill-padding-y, 4px) var(--tl-pill-padding-x, 8px);
    border-radius: var(--tl-pill-radius, 12px);
    font-size: var(--tl-font-size-leg, 0.85em);
    font-weight: 500;
  }
  .leg-endpoint.start {
    background: var(--tl-start-pill-bg, var(--success-color, #43a047));
    color: #fff;
  }
  .leg-endpoint.end {
    background: var(--tl-end-pill-bg, var(--primary-color));
    color: #fff;
  }
  .leg-endpoint ha-icon {
    --mdc-icon-size: var(--tl-icon-size, 16px);
  }
  .arrow {
    color: var(--tl-arrow-color, var(--secondary-text-color));
    display: inline-flex;
    align-items: center;
  }
  .arrow ha-icon {
    --mdc-icon-size: 16px;
  }
  .trip-meta {
    width: 100%;
    font-size: var(--tl-font-size-details, 0.8em);
    color: var(--secondary-text-color);
    margin-top: 2px;
  }
  .trip-detail {
    margin-top: 6px;
    font-size: var(--tl-font-size-details, 0.8em);
    color: var(--secondary-text-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .muted {
    opacity: 0.7;
  }
  .map-link a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted currentColor;
  }
  .no-trips {
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 0.9em;
    padding: 8px;
  }
`;
