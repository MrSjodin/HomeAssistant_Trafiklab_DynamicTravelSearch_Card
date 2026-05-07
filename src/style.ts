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
  .search-box {
    background: var(--secondary-background-color, rgba(128,128,128,0.08));
    border-radius: 10px;
    padding: 10px 12px;
  }
  .search-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    border: 1px solid var(--divider-color, rgba(128,128,128,0.18));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    font-size: 0.85em;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .quick-btn:hover {
    background: var(--secondary-background-color, rgba(128,128,128,0.10));
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
    border: 1px solid var(--divider-color, rgba(128,128,128,0.18));
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
    border: 1px solid var(--divider-color, rgba(128,128,128,0.18));
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
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
    border-bottom: 1px solid var(--divider-color, rgba(128,128,128,0.12));
  }
  .suggestion-item:last-child {
    border-bottom: none;
  }
  .suggestion-item:hover {
    background: var(--secondary-background-color, rgba(128,128,128,0.08));
  }
  .suggestion-name {
    font-weight: 500;
  }
  .suggestion-meta {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  /* ── Swap row ── */
  .action-row {
    display: flex;
    align-items: center;
    margin: 6px 0;
  }
  /* ── Search row ── */
  .search-row {
    display: flex;
    margin: 12px 0 8px 0;
  }
  .swap-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex: 1;
    width: 100%;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }
  .swap-btn:hover {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .swap-btn ha-icon {
    --mdc-icon-size: 18px;
  }
  .search-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
    width: 100%;
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
    color: var(--text-primary-color, #fff);
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
    background: var(--secondary-background-color, rgba(128,128,128,0.08));
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }
  .trip:hover {
    background: var(--secondary-background-color, rgba(128,128,128,0.12));
  }
  .trip--expanded {
    background: var(--secondary-background-color, rgba(128,128,128,0.10));
  }
  .leg {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-pill-padding-y, 4px) var(--tl-pill-padding-x, 8px);
    border-radius: var(--tl-pill-radius, 12px);
    background: var(--tl-leg-pill-bg, var(--ha-card-background, rgba(128,128,128,0.12)));
    box-shadow: inset 0 0 0 1px var(--divider-color, rgba(128,128,128,0.15));
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
    color: var(--text-primary-color, #fff);
  }
  .leg-endpoint.end {
    background: var(--tl-end-pill-bg, var(--primary-color));
    color: var(--text-primary-color, #fff);
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
  .trip-time {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: var(--tl-font-size-leg, 0.85em);
    font-weight: 600;
    color: var(--secondary-text-color);
    padding: 0 2px;
  }
  .trip-time ha-icon {
    --mdc-icon-size: 13px;
    opacity: 0.65;
  }
  .trip-time--dep ha-icon {
    color: var(--success-color, #43a047);
    opacity: 0.8;
  }
  .trip-time--arr ha-icon {
    color: var(--primary-color);
    opacity: 0.8;
  }
  .trip-meta {
    width: 100%;
    font-size: var(--tl-font-size-details, 0.8em);
    color: var(--secondary-text-color);
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .trip-chevron {
    display: inline-flex;
    align-items: center;
    color: var(--secondary-text-color);
    opacity: 0.6;
    transition: transform 0.2s ease;
    margin-left: auto;
  }
  .trip-chevron ha-icon {
    --mdc-icon-size: 16px;
  }
  .trip-chevron.open {
    transform: rotate(180deg);
  }
  .trip-stops {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0px 1px;
    font-size: 0.78em;
    color: var(--secondary-text-color);
    margin-top: 5px;
    line-height: 1.5;
  }
  .trip-stops-sep {
    color: var(--secondary-text-color);
    opacity: 0.45;
    padding: 0 2px;
    flex-shrink: 0;
  }
  .trip-stop-name {
    white-space: nowrap;
  }
  .trip-stop-endpoint {
    font-weight: 600;
    color: var(--primary-text-color);
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

  /* ── Trip expanded timeline ── */
  .trip-expand {
    width: 100%;
    margin-top: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15));
    animation: tl-slide-in 0.18s ease;
    overflow: hidden;
  }
  @keyframes tl-slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tl {
    display: grid;
    grid-template-columns: 42px 14px 1fr;
  }
  .tl-time {
    font-size: 0.78em;
    font-weight: 600;
    color: var(--primary-text-color);
    text-align: right;
    padding-right: 7px;
    padding-top: 4px;
    line-height: 1;
  }
  .tl-node {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tl-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
  }
  .tl-dot-start {
    background: var(--success-color, #43a047);
  }
  .tl-dot-end {
    background: var(--primary-color);
  }
  .tl-dot-mid {
    background: var(--secondary-text-color);
    opacity: 0.5;
    width: 8px;
    height: 8px;
    margin-top: 4px;
  }
  .tl-line-seg {
    width: 2px;
    flex: 1;
    background: var(--divider-color, rgba(128,128,128,0.30));
    min-height: 8px;
  }
  .tl-stop-cell {
    padding: 1px 0 7px 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
  }
  .tl-stop-name {
    font-size: 0.88em;
    font-weight: 500;
    line-height: 1.3;
    color: var(--primary-text-color);
  }
  .tl-leg-cell {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 0 2px 8px;
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .tl-leg-cell ha-icon {
    --mdc-icon-size: 15px;
  }
  .tl-leg-line {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .tl-leg-meta {
    color: var(--secondary-text-color);
  }
  .tl-leg-dir {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
  }
  .tl-transfer-badge {
    display: inline-block;
    font-size: 0.78em;
    font-weight: 500;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color, rgba(128,128,128,0.12));
    border-radius: 10px;
    padding: 1px 7px;
  }
  .tl-platform-badge {
    display: inline-block;
    font-size: 0.78em;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, rgba(128,128,128,0.12));
    border-radius: 10px;
    padding: 1px 7px;
  }
  .attribution {
    font-size: 0.72em;
    color: var(--disabled-text-color, rgba(128,128,128,0.55));
    text-align: left;
    padding-top: 8px;
  }
`;
