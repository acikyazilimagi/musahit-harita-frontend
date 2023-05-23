import { useMTMLView } from "@/components/MTMLView/MTMLView";
import { useDevice, useMapActions } from "@/stores/mapStore";
import {
  DEFAULT_IMPORTANCY,
  DEFAULT_MIN_ZOOM_DESKTOP,
  DEFAULT_MIN_ZOOM_MOBILE,
} from "@/components/Map/utils";
import { CooldownButtonComponent } from "@/components/Button/Cooldown";
import { Map } from "@/components/Map/Map";
import { MapControls } from "./Controls/index";
import { TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import { ChannelData } from "@/types";
import { useRouter } from "next/router";
import { useMapEvents } from "@/hooks/useMapEvents";
import { MapClusterStyle } from "@/components/Map/Cluster/ClusterStyle";
import { latLng, latLngBounds } from "leaflet";
import { LayerControl } from "./LayerControl";
import { useMapGeographyStore } from "@/stores/mapGeographyStore";
import { getAllNeighborhoods } from "@/data/models";
import useSWR from "swr";
import { useEffect, useState } from "react";

const MapEvents = () => {
  useMapEvents();
  return null;
};

type IntensityData = {
  neighborhood_id: number;
  volunteer_data: number;
};
const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export const MapContent = () => {
  const { mapType } = useMTMLView();
  const { setDrawerData } = useMapActions();
  const { data: intensityData } = useSWR<{
    results: IntensityData[];
    count: number;
  }>("http://18.194.199.255/feeds/mock", fetcher);

  const [locations, setLocations] = useState<ChannelData[]>([]);

  const { coordinates, zoom } = useMapGeographyStore();
  const { setEventType } = useMapActions();
  const device = useDevice();
  const router = useRouter();

  useEffect(() => {
    if (intensityData) {
      const channelData: ChannelData[] = getAllNeighborhoods().map(
        (hood): ChannelData => ({
          properties: {
            name: hood.name,
            description: null,
          },
          intensity:
            (intensityData.results.find(
              (data: IntensityData) => data.neighborhood_id === hood.id
            )?.volunteer_data as number) / 10 || DEFAULT_IMPORTANCY,
          location: {
            lat: hood.lng,
            lng: hood.lat,
          },
          reference: hood.id,
        })
      );

      setLocations(channelData);
    }
  }, [intensityData, setDrawerData]);

  const onMarkerClick = (_e: any, markerData: ChannelData) => {
    setDrawerData(markerData);
    const query = { ...router.query, id: markerData.reference };
    router.push({ query, hash: location.hash }, { query, hash: location.hash });
  };

  const mapBoundaries = {
    southWest: latLng(34.025514, 25.584519),
    northEast: latLng(42.211024, 44.823563),
  };

  const bounds = latLngBounds(mapBoundaries.southWest, mapBoundaries.northEast);

  const dpr = window.devicePixelRatio;
  const baseMapUrl = `https://mt0.google.com/vt/lyrs=${mapType}&scale=${dpr}&hl=tr&x={x}&y={y}&z={z}&apistyle=s.t%3A3%7Cs.e%3Ag%7Cs.e%3Al.i%7Cp.v%3Aoff%2Cs.t%3A3%7Cs.e%3Ag%7Clabels%3Aon`;

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

        <LayerControl locations={locations} onMarkerClick={onMarkerClick} />
      </Map>
      <Box sx={styles.fixedMidBottom}>
        <CooldownButtonComponent />
      </Box>
    </>
  );
};

const styles = {
  fixedMidBottom: () => ({
    position: "fixed",
    bottom: "0px",
    left: "0px",
    width: "100%",
    height: "110px",
    zIndex: 1030,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  }),
};
