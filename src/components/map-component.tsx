"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapComponentProps {
  location: { lat: number; lng: number } | null;
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}

export default function MapComponent({
  location,
  onLocationSelect,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  // Сохраняем обработчики в ref чтобы избежать их пересоздания
  const handlersRef = useRef({
    onLocationSelect,
  });
  
  // Обновляем ref при изменении обработчика
  useEffect(() => {
    handlersRef.current.onLocationSelect = onLocationSelect;
  }, [onLocationSelect]);

  // Инициализация карты - запускается только один раз
  useEffect(() => {
    const initMap = async () => {
      if (mapRef.current && !map) {
        const loader = new Loader({
          apiKey: "mock_api_key",
          version: "weekly",
        });

        try {
          const google = await loader.load();
          
          const initialLocation = location || {
            lat: 43.238949,
            lng: 76.889709,
          }; // Default to Almaty
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: initialLocation,
            zoom: 14,
            mapTypeId: "roadmap",
            streetViewControl: false,
            mapTypeControl: false,
          });
          
          setMap(mapInstance);
          
          // Настраиваем обработчик клика по карте
          mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
            const position = e.latLng;
            if (position) {
              const coords = {
                lat: position.lat(),
                lng: position.lng(),
              };
              
              if (marker) {
                marker.setPosition(position);
              } else {
                const newMarker = new google.maps.Marker({
                  position,
                  map: mapInstance,
                  draggable: true,
                  title: "Местоположение проблемы",
                });
                
                newMarker.addListener("dragend", () => {
                  const markerPosition = newMarker.getPosition();
                  if (markerPosition) {
                    handlersRef.current.onLocationSelect({
                      lat: markerPosition.lat(),
                      lng: markerPosition.lng(),
                    });
                  }
                });
                
                setMarker(newMarker);
              }
              
              handlersRef.current.onLocationSelect(coords);
            }
          });
        } catch (error) {
          console.error("Error loading Google Maps:", error);
        }
      }
    };
    
    initMap();
  }, []);  // Пустой массив зависимостей, запускается только при монтировании
  
  // Обработка начального маркера при первой загрузке карты
  useEffect(() => {
    if (map && location && !marker) {
      const newMarker = new google.maps.Marker({
        position: location,
        map,
        draggable: true,
        title: "Местоположение проблемы",
      });
      
      newMarker.addListener("dragend", () => {
        const position = newMarker.getPosition();
        if (position) {
          handlersRef.current.onLocationSelect({
            lat: position.lat(),
            lng: position.lng(),
          });
        }
      });
      
      setMarker(newMarker);
    }
  }, [map, location, marker]);

  // Обновление позиции маркера при изменении location
  useEffect(() => {
    if (map && marker && location) {
      marker.setPosition(location);
      map.panTo(location);
    }
  }, [location, map, marker]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{
        backgroundColor: "#f0f0f0",
      }}
    />
  );
}