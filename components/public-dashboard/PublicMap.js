import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

function PublicMap() {
    const position = { lat: 61.2176, lng: -149.8997 };

    return (
        <APIProvider apiKey={'AIzaSyBnmwOItiDCyz4rwd6w_XBVhI5nfwRQ-BU'}>
            <Map center={position} zoom={10}>
                <Marker position={position} />
            </Map>
        </APIProvider>
    );
}

export default PublicMap;