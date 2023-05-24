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

interface IntensityData {
  neighborhoodID: number;
  intensity: number;
}

const transformResponse = (response: ApiResponseIntensity): IntensityData => ({
  neighborhoodID: response.neighborhood_id,
  intensity: response.volunteer_data,
});

interface ApiClientProps {
  url?: string;
}

export class ApiClient {
  url: string;

  constructor(props: ApiClientProps) {
    this.url = props.url ?? API_URL;
  }

  async fetchFeeds() {
    const url = new URL(this.url + "/feeds/mock");
    const { results } = await dataFetcher<ApiResponseFeeds>(url);
    return results.map(transformResponse);
  }
}
