"use client";

import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const WMSMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) {
      console.error("Map container not found.");
      return;
    }

    const map: any = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new TileWMS({
            url: "https://wms.geonorge.no/skwms1/wms.reguleringsplaner",
            params: {
              LAYERS: "default",
              FORMAT: "image/png",
              TRANSPARENT: true,
            },
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([8.468, 60.472]),
        zoom: 6,
      }),
    });

    return () => map.setTarget(null);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default WMSMap;
