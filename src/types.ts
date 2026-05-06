// Types for the Trafiklab Dynamic Travel Search Card

export interface DynamicTravelCardConfig {
  type: string;
  title?: string;
  /** Config entry ID of a Resrobot travel sensor (used to resolve the API key). */
  config_entry_id?: string;
  /** Direct Resrobot API key (alternative to config_entry_id). */
  api_key?: string;
  /**
   * Person or device_tracker entity to use as "My Location".
   * If omitted the card still shows a "My Location" button but will require
   * the user to enter coordinates manually.
   */
  my_location_entity?: string;
  /** Zone entity ID for the Home quick-button (default: zone.home). */
  home_zone?: string;
  /** Show HA-defined person buttons as quick destination options (default: true). */
  show_persons?: boolean;
  /** Show zone buttons as quick destination/origin options (default: true). */
  show_zones?: boolean;

  /** Maximum number of trips to display. */
  max_items?: number;
  /** Maximum number of legs rendered per trip. */
  max_legs?: number;
  /** Request platform information from the search service. */
  include_platform?: boolean;
  /** Maximum walking distance at origin / destination in metres. */
  max_walking_distance?: number;
}

export interface Hass {
  states: Record<string, HassEntity>;
  locale?: { language?: string };
  language?: string;
  user?: {
    /** HA user ID — matches person entity's user_id attribute. */
    id: string;
    name: string;
  };
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
    returnResponse?: boolean
  ): Promise<any>;
  connection: {
    sendMessagePromise(msg: Record<string, unknown>): Promise<any>;
  };
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
}

export type Leg = {
  category?: string;
  type?: string;
  mode?: string;
  line?: string | number;
  line_number?: string | number;
  number?: string | number;
  product?: {
    line?: string | number;
    category?: string;
    mode?: string;
  };
  from?: StopLike;
  origin?: StopLike;
  to?: StopLike;
  destination?: StopLike;
  /** Flat string origin name (used by Trafiklab integration response). */
  origin_name?: string;
  /** Flat string destination name (used by Trafiklab integration response). */
  dest_name?: string;
  /** Headsign / direction of the vehicle. */
  direction?: string;
  departure?: string;
  origin_time?: string;
  arrival?: string;
  dest_time?: string;
  duration?: number;
  distance?: number;
  platform?: string;
};

export type StopLike = {
  name?: string;
  id?: string | number;
  lat?: number;
  lon?: number;
  lng?: number;
};

export interface Trip {
  legs?: Leg[];
  duration?: number;
  /** Total duration in minutes (used by Trafiklab integration response). */
  duration_total?: number;
}

export interface StopSuggestion {
  id: string;
  name: string;
  area_type?: string;
  transport_modes?: string[];
  child_stops?: Array<{ id: string; name: string; lat?: number; lon?: number }>;
}
