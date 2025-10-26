/* eslint-disable no-undef */

import { useEffect, useRef, useState } from 'react';

export default function MapPicker({ center, onLocationSelect, height = '300px' }) {
    const googleMapRef = useRef(null);
    const [googleMap, setGoogleMap] = useState(null);
    const [marker, setMarker] = useState(null);

    // Parse center coordinates or use default
    const parseCenter = (centerStr) => {
        if (!centerStr) return { lat: 18.4606607, lng: -70.8405734 }; // Default center (Sabana Yegua)
        const [lat, lng] = centerStr.split(',');
        return {
            lat: parseFloat(lat) || 18.4606607,
            lng: parseFloat(lng) || -70.8405734
        };
    };

    const mapCenter = parseCenter(center);

    useEffect(() => {
        if (!googleMapRef.current || !window.google) return;

        function initGoogleMap() {
            const map = new window.google.maps.Map(googleMapRef.current, {
                center: mapCenter,
                zoom: 14,
            });

            setGoogleMap(map);

            // Add initial marker if center is provided
            if (center) {
                const initialMarker = new window.google.maps.Marker({
                    position: mapCenter,
                    map: map,
                    draggable: true,
                });
                setMarker(initialMarker);

                // Add drag listener to marker
                initialMarker.addListener('dragend', (event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    onLocationSelect(lat, lng);
                });
            }

            // // Add click listener to map
            map.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                // Remove existing marker if any
                if (marker) {
                    marker.setMap(null);
                }

                // Add new draggable marker
                const newMarker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    draggable: true,
                });
                setMarker(newMarker);

                // Add drag listener to new marker
                newMarker.addListener('dragend', (dragEvent) => {
                    const dragLat = dragEvent.latLng.lat();
                    const dragLng = dragEvent.latLng.lng();
                    onLocationSelect(dragLat, dragLng);
                });

                onLocationSelect(lat, lng);
            });

            return map;
        }

        initGoogleMap();
    }, [googleMapRef, center]);

    return <div
        ref={googleMapRef}
        style={{ width: '100%', height }}
    />
}