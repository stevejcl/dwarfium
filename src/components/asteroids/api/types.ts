export interface ApiNasaResponse {
  links?: {
    next: string;
    prev: string;
    self: string;
  };
  element_count?: number;
  near_earth_objects?: {
    [key: string]: AsteroidData[];
  };
}

export interface AsteroidData {
  links?: {
    self: string;
  };
  id?: number;
  neo_reference_id?: number;
  name?: string;
  nasa_jpl_url?: string;
  absolute_magnitude_h?: number;
  estimated_diameter?: {
    kilometers?: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters?: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles?: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet?: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid?: boolean;
  close_approach_data?: AsteroidApproach[];
  is_sentry_object?: boolean;
}

export interface AsteroidApproach {
  close_approach_date?: string;
  close_approach_date_full?: string;
  epoch_date_close_approach?: number;
  relative_velocity?: {
    kilometers_per_second: number;
    kilometers_per_hour: number;
    miles_per_hour: number;
  };
  miss_distance?: {
    astronomical: number;
    lunar: number;
    kilometers: number;
    miles: number;
  };
  orbiting_body?: OrbitingBody | string;
}

export enum OrbitingBody {
  Earth,
}
