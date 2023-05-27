import { useDevice, useDrawerData, useMapActions } from "@/stores/mapStore";
import {
  DEFAULT_IMPORTANCY,
  DEFAULT_MIN_ZOOM_DESKTOP,
  DEFAULT_MIN_ZOOM_MOBILE,
} from "@/components/Map/utils";
import { Map } from "@/components/Map/Map";
import { MapControls } from "./Controls/index";
import { TileLayer, useMap } from "react-leaflet";
import { ChannelData } from "@/types";
import { useRouter } from "next/router";
import { useMapEvents } from "@/hooks/useMapEvents";
import { MapClusterStyle } from "@/components/Map/Cluster/ClusterStyle";
import { latLng, latLngBounds } from "leaflet";
import { LayerControl } from "./LayerControl";
import { useMapGeographyStore } from "@/stores/mapGeographyStore";
import { useEffect, useState } from "react";
import {
  NeighborhoodIntensity,
  useNeighborhoodIntensityData,
} from "@/features/intensity-data";
import { getAllNeighborhoodsWithAllData } from "@/data/models";
import { ZOOM_LEVEL_NEIGHBORHOOD } from "@/features/map/constants";
import { usePrevious } from "@/hooks/usePrevious";
import { useVisitedMarkersStore } from "@/stores/visitedMarkersStore";

const MapEvents = () => {
  useMapEvents();
  return null;
};

const transformToChannelData = ({
  neighborhood,
  intensity,
}: NeighborhoodIntensity): ChannelData => ({
  reference: neighborhood.id,
  properties: {
    name: neighborhood.name,
    description: null,
  },
  intensity: intensity.intensity ?? DEFAULT_IMPORTANCY,
  location: {
    lat: neighborhood.lat,
    lng: neighborhood.lng,
  },
});

const ZoomToDetailContent = () => {
  const map = useMap();
  const drawerData = useDrawerData();
  const prevDrawerData = usePrevious(drawerData);
  const { setVisited } = useVisitedMarkersStore();

  useEffect(() => {
    if (drawerData && drawerData.reference !== prevDrawerData?.reference) {
      const { lat, lng } = drawerData.location;
      map.setView([lat, lng], ZOOM_LEVEL_NEIGHBORHOOD, { animate: true });
      setVisited(drawerData.reference);
    }
  }, [drawerData, map, prevDrawerData?.reference, setVisited]);

  return null;
};

export const MapContent = () => {
  const router = useRouter();
  const { setDrawerData } = useMapActions();
  const { data } = useNeighborhoodIntensityData();

  const [locations, setLocations] = useState<ChannelData[]>([]);

  const { coordinates, zoom } = useMapGeographyStore();
  const { setEventType } = useMapActions();
  const device = useDevice();

  useEffect(() => {
    if (data) {
      const channelData: ChannelData[] = data.map(transformToChannelData);
      setLocations(channelData);
    }
  }, [data, setDrawerData]);

  const onMarkerClick = (_e: any, markerData: ChannelData) => {
    const neighborhood = getAllNeighborhoodsWithAllData()[markerData.reference];
    setDrawerData({
      reference: markerData.reference,
      intensity: markerData.intensity,
      location: {
        lat: neighborhood.lat,
        lng: neighborhood.lng,
      },
      properties: {
        name: neighborhood.name,
        description: `${neighborhood.districtName}, ${neighborhood.cityName}`,
      },
    });
    const query = { ...router.query, id: markerData.reference };
    router.push({ query, hash: location.hash }, { query, hash: location.hash });
  };

  const mapBoundaries = {
    southWest: latLng(34.025514, 25.584519),
    northEast: latLng(42.211024, 44.823563),
  };

  const bounds = latLngBounds(mapBoundaries.southWest, mapBoundaries.northEast);
  const baseMapUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`;

  if (!locations) {
    return <div> Loading...</div>;
  }

  return (
    <>
      <MapClusterStyle />
      <Map
        zoomControl={false}
        attributionControl={false}
        center={coordinates}
        zoom={zoom}
        minZoom={
          device === "desktop"
            ? DEFAULT_MIN_ZOOM_DESKTOP
            : DEFAULT_MIN_ZOOM_MOBILE
        }
        zoomSnap={1}
        zoomDelta={1}
        whenReady={(map: any) => {
          setTimeout(() => {
            setEventType("ready");
            map.target.invalidateSize();
          }, 100);
        }}
        preferCanvas
        maxBoundsViscosity={1}
        maxBounds={bounds}
        maxZoom={18}
      >
        <MapEvents />
        <MapControls />
        <TileLayer url={baseMapUrl} />
        <ZoomToDetailContent />

        <LayerControl locations={locations} onMarkerClick={onMarkerClick} />
      </Map>
    </>
  );
};
