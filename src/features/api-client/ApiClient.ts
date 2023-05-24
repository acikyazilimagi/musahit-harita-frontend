import { API_URL } from "@/env";

const dataFetcher = async <T>(url: string | URL) => {
  const response = await fetch(url);
  return (await response.json()) as T;
};

interface ApiResponseFeeds {
  count: number;
  results: ApiResponseIntensity[];
}

interface ApiResponseIntensity {
  neighborhood_id: number;
  volunteer_data: number;
}

export interface IntensityData {
  neighborhoodID: number;
  intensity: number;
}

const transformResponse = (response: ApiResponseIntensity): IntensityData => ({
  neighborhoodID: response.neighborhood_id,
  intensity: response.volunteer_data,
});

interface ApiClientProps {
  url?: string;
  mock?: true;
}

export class ApiClient {
  readonly url: string;
  readonly mock: boolean;

  constructor(props: ApiClientProps = {}) {
    this.url = props.url ?? API_URL;
    this.mock = !!props.mock;
  }

  async fetchFeeds() {
    const url = this.mock
      ? new URL(this.url + "/feeds/mock")
      : new URL(this.url + "/feeds");
    const { results } = await dataFetcher<ApiResponseFeeds>(url);
    return results.map(transformResponse);
  }
}
