/* eslint-disable no-undef */

import { useEffect, useRef, useState } from 'react';

export default function MapPicker({ center, onLocationSelect, height = '300px' }) {
    const googleMapRef = useRef(null);
    const [googleMap, setGoogleMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const clickListenerRef = useRef(null);
    const dragListenerRef = useRef(null);

    // Parse center coordinates or use default
    const parseCenter = (centerStr) => {
        if (!centerStr) return { lat: 18.4606607, lng: -70.8405734 }; // Default center (Sabana Yegua)
        const [lat, lng] = centerStr.split(',');
        return {
            lat: parseFloat(lat) || 18.4606607,
            lng: parseFloat(lng) || -70.8405734
        };
    };

    // Initialize map once on mount
    useEffect(() => {
        if (!googleMapRef.current || !window.google) return;

        const mapCenter = parseCenter(center);
        const map = new window.google.maps.Map(googleMapRef.current, {
            center: mapCenter,
            zoom: 14,
        });

        setGoogleMap(map);

        // Add click listener to map
        clickListenerRef.current = map.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Remove existing marker if any
            setMarker(prevMarker => {
                if (prevMarker) {
                    prevMarker.setMap(null);
                }
                return null;
            });

            // Remove old drag listener if exists
            if (dragListenerRef.current) {
                window.google.maps.event.removeListener(dragListenerRef.current);
            }

            // Add new draggable marker
            const newMarker = new window.google.maps.Marker({
                position: { lat, lng },
                map: map,
                draggable: true,
            });

            // Add drag listener to new marker
            dragListenerRef.current = newMarker.addListener('dragend', (dragEvent) => {
                const dragLat = dragEvent.latLng.lat();
                const dragLng = dragEvent.latLng.lng();
                onLocationSelect(dragLat, dragLng);
            });

            setMarker(newMarker);
            onLocationSelect(lat, lng);
        });

        // Cleanup function to remove listeners and map
        return () => {
            if (clickListenerRef.current) {
                window.google.maps.event.removeListener(clickListenerRef.current);
            }
            if (dragListenerRef.current) {
                window.google.maps.event.removeListener(dragListenerRef.current);
            }
            setMarker(prevMarker => {
                if (prevMarker) {
                    prevMarker.setMap(null);
                }
                return null;
            });
        };
    }, []); // Empty dependency array - only run once on mount

    // Update marker position when center prop changes
    useEffect(() => {
        if (!googleMap || !center) return;

        const mapCenter = parseCenter(center);

        // Update map center
        googleMap.setCenter(mapCenter);

        // Remove old marker if exists
        if (marker) {
            marker.setMap(null);
        }

        // Remove old drag listener if exists
        if (dragListenerRef.current) {
            window.google.maps.event.removeListener(dragListenerRef.current);
        }

        // Add new marker at the center position
        const newMarker = new window.google.maps.Marker({
            position: mapCenter,
            map: googleMap,
            draggable: true,
        });

        // Add drag listener
        dragListenerRef.current = newMarker.addListener('dragend', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            onLocationSelect(lat, lng);
        });

        setMarker(newMarker);
    }, [center, googleMap]); // Removed onLocationSelect from dependencies

    return <div
        ref={googleMapRef}
        style={{ width: '100%', height }}
    />
}