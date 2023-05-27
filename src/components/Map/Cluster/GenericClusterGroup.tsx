import L from "leaflet";
import { Marker, useMap } from "react-leaflet";
import useSupercluster from "use-supercluster";
import { findTagByClusterCount } from "../../Tag/Tag.types";
import { ChannelData } from "@/types";
import { useVisitedMarkersStore } from "@/stores/visitedMarkersStore";
import { ZOOM_LEVEL_NEIGHBORHOOD } from "@/features/map/constants";

const fetchIcon = (count: number) => {
  const tag = findTagByClusterCount(count);

  return L.divIcon({
    html: `<div class="cluster-inner"><span>${count}</span></div>`,
    className: `leaflet-marker-icon marker-cluster leaflet-interactive leaflet-custom-cluster-${tag.id}`,
  });
};

function getMarkerWithIntensity(intensity: number, isVisited: boolean) {
  switch (intensity) {
    case 1:
      if (isVisited)
        return getSVGMarker({ color: "#353535", secondaryColor: "#FAF7BF" });
      return getSVGMarker({ color: "#FAF7BF", secondaryColor: "#000000" });
    case 2:
      if (isVisited)
        return getSVGMarker({ color: "#353535", secondaryColor: "#FCD73F" });
      return getSVGMarker({ color: "#FCD73F", secondaryColor: "#FFFFFF" });
    case 3:
      if (isVisited)
        return getSVGMarker({ color: "#353535", secondaryColor: "#FDAE33" });
      return getSVGMarker({ color: "#FDAE33", secondaryColor: "#FFFFFF" });
    case 4:
      if (isVisited)
        return getSVGMarker({ color: "#353535", secondaryColor: "#FE8427" });
      return getSVGMarker({ color: "#FE8427", secondaryColor: "#FFFFFF" });
    case 5:
      if (isVisited)
        return getSVGMarker({ color: "#353535", secondaryColor: "#FE591D" });
      return getSVGMarker({ color: "#FE591D", secondaryColor: "#FFFFFF" });
    default:
      if (isVisited)
        return getSVGMarker({ color: "#353535", secondaryColor: "#FFFFFF" });
      return getSVGMarker({ color: "#193866", secondaryColor: "#FFFFFF" });
  }
}

function getSVGMarker(
  { color }: { color: string; secondaryColor: string } = {
    color: "#FF6E6E",
    secondaryColor: "#0d0d0d",
  }
) {
  // icon URL: https://www.svgrepo.com/svg/302636/map-marker
  return L.divIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="32" height="32" viewBox="0 0 200 200" xml:space="preserve">
      <g transform="matrix(0.39 0 0 0.39 100.2 100.2)">
      <path style="stroke: rgba(0,0,0, 0.24); stroke-width: 24; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4;  fill: ${color}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-256, -256)" d="M 256 0 C 162.928 0 86.552 76.376 86.552 169.448 C 86.552 310.856 256 512 256 512 C 256 512 425.448 310.856 425.448 169.448 C 425.448 76.376 349.072 0 256 0 Z M 256 246.552 C 224.928 246.552 199.448 221.072 199.448 190 C 199.448 158.928 224.928 133.448 256 133.448 C 287.072 133.448 312.552 158.928 312.552 190 C 312.552 221.072 287.072 246.552 256 246.552 Z" stroke-linecap="round" />
      </g>
    </svg>
    `,
    className: "svg-marker-icon",
    iconAnchor: [16, 16],
  });
}

type Props = {
  data: ChannelData[];
  onMarkerClick: (_event: any, _markerData: ChannelData) => void;
};

export const GenericClusterGroup = ({ data, onMarkerClick }: Props) => {
  const map = useMap();
  const bounds = map.getBounds();
  const { isVisited } = useVisitedMarkersStore();

  const geoJSON = data.map((item) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [item.location.lng, item.location.lat],
      },
      item,
      properties: item.properties,
    };
  });

  const { clusters, supercluster } = useSupercluster({
    points: geoJSON,
    bounds: [
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat,
    ],
    zoom: map.getZoom(),
    options: { radius: 150, maxZoom: ZOOM_LEVEL_NEIGHBORHOOD - 1 },
  });

  return (
    <>
      {clusters.map((cluster, idx) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        // the point may be either a cluster or a crime point
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(pointCount)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    18
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true,
                  });
                },
              }}
            />
          );
        }

        return (
          <Marker
            key={`cluster-${idx}`}
            position={[latitude, longitude]}
            icon={
              cluster.properties.icon
                ? getSVGMarker()
                : getMarkerWithIntensity(
                    cluster.item.intensity,
                    isVisited(cluster.item.reference)
                  )
            }
            eventHandlers={{
              click: (e) => {
                if (cluster.item.reference) {
                  onMarkerClick(e, cluster.item);
                }
              },
            }}
          />
        );
      })}
    </>
  );
};
