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

interface FeedDetail {
  buildingName: string;
  ballotBoxNos: number[];
}

interface ApiResponseFeed {
  neighborhoodId: number;
  lastUpdateTime: string;
  intensity: number;
  details: FeedDetail[];
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
}

export class ApiClient {
  readonly url: string;

  constructor(props: ApiClientProps = {}) {
    this.url = props.url ?? API_URL;
  }

  async fetchFeeds() {
    const url = new URL(this.url + "/mock/feeds");
    const data = await dataFetcher<ApiResponseFeeds>(url);
    return data ? data.results.map(transformResponse) : null;
  }

  async fetchDetail(id: string) {
    const url = new URL(this.url + "/mock/feed/" + id);
    const data = await dataFetcher<ApiResponseFeed>(url);
    return data ? transformDetailResponse(data) : null;
  }
}
