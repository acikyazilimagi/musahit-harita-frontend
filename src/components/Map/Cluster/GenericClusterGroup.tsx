import L from "leaflet";
import { Marker, useMap } from "react-leaflet";
import useSupercluster from "use-supercluster";
import { findTagByClusterCount } from "../../Tag/Tag.types";
import { ChannelData } from "@/types";
import { useVisitedMarkersStore } from "@/stores/visitedMarkersStore";

const fetchIcon = (count: number) => {
  const tag = findTagByClusterCount(count);

  return L.divIcon({
    html: `<div class="cluster-inner"><span>${count}</span></div>`,
    className: `leaflet-marker-icon marker-cluster leaflet-interactive leaflet-custom-cluster-${tag.id}`,
  });
};

function getMarkerWithIntensity(intensity: number, isVisited: boolean) {
  if (isVisited) {
    return getSVGMarker({ color: "#353535", secondaryColor: "#FFFFFF" });
  }
  switch (intensity) {
    case 1:
      return getSVGMarker({ color: "#FAF7BF", secondaryColor: "#000000" });
    case 2:
      return getSVGMarker({ color: "#FCD73F", secondaryColor: "#FFFFFF" });
    case 3:
      return getSVGMarker({ color: "#FDAE33", secondaryColor: "#FFFFFF" });
    case 4:
      return getSVGMarker({ color: "#FE8427", secondaryColor: "#FFFFFF" });
    case 5:
      return getSVGMarker({ color: "#FE591D", secondaryColor: "#FFFFFF" });
    default:
      return getSVGMarker({ color: "#193866", secondaryColor: "#FFFFFF" });
  }
}

function getSVGMarker(
  { color, secondaryColor }: { color: string; secondaryColor: string } = {
    color: "#FF6E6E",
    secondaryColor: "#FFFFFF",
  }
) {
  // icon URL: https://www.svgrepo.com/svg/302636/map-marker
  return L.divIcon({
    html: `
      <svg
      viewBox="-4 0 36 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)">
          <g id="Icons" transform="translate(37.000000, 169.000000)">
            <g id="map-marker" transform="translate(78.000000, 468.000000)">
              <g transform="translate(10.000000, 6.000000)">
                <path
                  d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"
                  id="Shape"
                  fill=${color}
                ></path>
                <circle
                  id="Oval"
                  fill=${secondaryColor}
                  fill-rule="nonzero"
                  cx="14"
                  cy="14"
                  r="7"
                ></circle>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  `,
    className: "svg-marker-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

type Props = {
  data: ChannelData[];
  onMarkerClick: (_event: any, _markerData: ChannelData) => void;
};

export const GenericClusterGroup = ({ data, onMarkerClick }: Props) => {
  const map = useMap();
  const bounds = map.getBounds();
  const { setVisited, isVisited } = useVisitedMarkersStore();

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
    options: { radius: 150, maxZoom: 17 },
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
                  setVisited(cluster.item.reference);
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
