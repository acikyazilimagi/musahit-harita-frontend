import { API_URL } from "@/env";
import { ChannelDetailData } from "@/types";

const dataFetcher = async <T>(url: string | URL) => {
  const response = await fetch(url);
  try {
    return (await response.json()) as T;
  } catch (e) {
    return null;
  }
};

interface ApiResponseFeeds {
  count: number;
  results: ApiResponseIntensity[];
}

interface ApiResponseFeed {
  neighborhoodId: number;
  lastUpdateTime: string;
  intensity: number;
  details: string[];
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

const transformDetailResponse = (
  response: ApiResponseFeed
): ChannelDetailData => ({
  details: response.details,
  intensity: response.intensity,
  neighbourhoodId: response.neighborhoodId,
  lastUpdateTime: response.lastUpdateTime,
  name: "null",
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
    const data = await dataFetcher<ApiResponseFeeds>(url);
    return data ? data.results.map(transformResponse) : null;
  }

  async fetchDetail(id: string) {
    const url = this.mock
      ? new URL(this.url + "/feed/mock/" + id)
      : new URL(this.url + "/feed/" + id);
    const data = await dataFetcher<ApiResponseFeed>(url);
    return data ? transformDetailResponse(data) : null;
  }
}
