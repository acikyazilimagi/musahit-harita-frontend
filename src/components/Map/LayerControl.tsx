import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import { GenericClusterGroup } from "@/components/Map/Cluster/GenericClusterGroup";
import { MapLayer } from "../MTMLView/types";
import { memo, useMemo } from "react";
import { ChannelData } from "@/types";
import { useMTMLView } from "../MTMLView/MTMLView";

const HeatmapLayer = memo(HeatmapLayerFactory<Point>());

type Point = [lng: number, lat: number, intensity: number];

const longitudeExtractor = (p: Point) => p[0];
const latitudeExtractor = (p: Point) => p[1];
const intensityExtractor = (p: Point) => p[2];

type Props = {
  locations: ChannelData[];
  onMarkerClick: (_event: any, _markerData: ChannelData) => void;
};

const getIntensity = (data: ChannelData): number => data.intensity;

const useHeatmapPoints = (locations: ChannelData[]) => {
  return useMemo(
    () =>
      locations.map(
        (item) =>
          [item.location.lng, item.location.lat, getIntensity(item)] as Point
      ),
    [locations]
  );
};

export const LayerControl = ({ locations, onMarkerClick }: Props) => {
  const { mapLayers } = useMTMLView();
  const points = useHeatmapPoints(locations);

  return (
    <>
      {mapLayers.map((layer, idx) => {
        if (layer === MapLayer.Heatmap) {
          return (
            <HeatmapLayer
              key={idx}
              fitBoundsOnUpdate
              radius={15}
              max={5}
              points={points}
              longitudeExtractor={longitudeExtractor}
              latitudeExtractor={latitudeExtractor}
              intensityExtractor={intensityExtractor}
              useLocalExtrema={false}
            />
          );
        }
        return (
          <GenericClusterGroup
            key={idx}
            data={locations}
            onMarkerClick={onMarkerClick}
          />
        );
      })}
    </>
  );
};
