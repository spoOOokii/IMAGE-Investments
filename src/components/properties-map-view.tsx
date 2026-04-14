"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";

import { localizedPath, pickLocale, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/site-data";

type PropertiesMapViewProps = {
  locale: Locale;
  properties: Property[];
};

export function PropertiesMapView({ locale, properties }: PropertiesMapViewProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(properties[0]?.slug ?? "");
  const selectedProperty =
    properties.find((property) => property.slug === selectedSlug) ?? properties[0];

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!mapElementRef.current || mapRef.current) {
        return;
      }

      const L = await import("leaflet");

      if (cancelled || !mapElementRef.current) {
        return;
      }

      const map = L.map(mapElementRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([29.9, 30.9], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
    }

    void setupMap();

    return () => {
      cancelled = true;
      setMapReady(false);
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    async function renderMarkers() {
      const map = mapRef.current;
      const markersLayer = markersLayerRef.current;

      if (!map || !markersLayer) {
        return;
      }

      const L = await import("leaflet");
      markersLayer.clearLayers();

      const bounds = L.latLngBounds([]);

      for (const property of properties) {
        const isSelected = property.slug === selectedProperty?.slug;
        const marker = L.circleMarker(
          [property.coordinates.lat, property.coordinates.lng],
          {
            radius: isSelected ? 9 : 7,
            weight: 2,
            color: isSelected ? "#ebd2a5" : "#ffffff",
            fillColor: isSelected ? "#cda86d" : "#081728",
            fillOpacity: 0.95,
          },
        );

        marker.bindPopup(`
          <div style="direction:${locale === "ar" ? "rtl" : "ltr"};min-width:220px">
            <div style="font-weight:700;margin-bottom:6px;">${pickLocale(property.title, locale)}</div>
            <div style="font-size:12px;color:#44576b;">${pickLocale(property.locationName, locale)} • ${pickLocale(property.compound, locale)}</div>
          </div>
        `);
        marker.on("click", () => setSelectedSlug(property.slug));
        marker.addTo(markersLayer);
        bounds.extend([property.coordinates.lat, property.coordinates.lng]);
      }

      if (selectedProperty) {
        map.flyTo(
          [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng],
          11,
          { duration: 0.8 },
        );
      } else if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2));
      }
    }

    void renderMarkers();
  }, [locale, mapReady, properties, selectedProperty]);

  if (!selectedProperty) {
    return (
      <div className="luxury-surface p-8 text-center text-[var(--color-ink-soft)]">
        {locale === "ar" ? "لا توجد وحدات متاحة." : "No properties available."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_0.95fr]" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="luxury-surface overflow-hidden p-3">
        <div ref={mapElementRef} className="h-[560px] w-full rounded-[1.5rem]" />
      </div>

      <aside className="space-y-4">
        <div className="luxury-surface p-5">
          <div className="text-xs font-semibold text-[var(--color-muted)]">
            {locale === "ar"
              ? `${properties.length} وحدة على الخريطة`
              : `${properties.length} properties on the map`}
          </div>
          <h3 className="mt-2 text-xl font-bold text-[var(--color-ink)]">
            {pickLocale(selectedProperty.title, locale)}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
            {pickLocale(selectedProperty.locationName, locale)} •{" "}
            {pickLocale(selectedProperty.compound, locale)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-3">
              <div className="text-xs text-[var(--color-muted)]">
                {locale === "ar" ? "السعر" : "Price"}
              </div>
              <div className="mt-1 font-bold text-[var(--color-ink)]">
                {pickLocale(selectedProperty.priceLabel, locale)}
              </div>
            </div>
            <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-3">
              <div className="text-xs text-[var(--color-muted)]">
                {locale === "ar" ? "المساحة" : "Size"}
              </div>
              <div className="mt-1 font-bold text-[var(--color-ink)]">
                {selectedProperty.size} {locale === "ar" ? "م²" : "m²"}
              </div>
            </div>
          </div>
          <Link
            href={localizedPath(locale, `/properties/${selectedProperty.slug}`)}
            className="mt-4 inline-flex rounded-full bg-[var(--color-gold)] px-5 py-3 text-sm font-bold text-[var(--color-navy)]"
          >
            {locale === "ar" ? "عرض الوحدة" : "View property"}
          </Link>
        </div>

        <div className="luxury-surface max-h-[360px] overflow-y-auto p-3">
          <div className="mb-3 text-xs font-semibold text-[var(--color-muted)]">
            {locale === "ar" ? "كل الوحدات" : "All listings"}
          </div>
          <div className="space-y-2">
            {properties.map((property) => (
              <button
                key={property.slug}
                type="button"
                onClick={() => setSelectedSlug(property.slug)}
                className={`w-full rounded-2xl border px-4 py-3 text-start transition ${
                  property.slug === selectedProperty.slug
                    ? "border-[var(--color-gold)] bg-[rgba(205,168,109,0.16)]"
                    : "border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.07)]"
                }`}
              >
                <div className="text-sm font-bold text-[var(--color-ink)]">
                  {pickLocale(property.title, locale)}
                </div>
                <div className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  {pickLocale(property.locationName, locale)} •{" "}
                  {pickLocale(property.priceLabel, locale)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
