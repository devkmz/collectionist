import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface Props {
    location?: string;
}

const Map = ({ location }: Props): JSX.Element => {
    const [lat, setLat] = useState<number>();
    const [lon, setLon] = useState<number>();
    const [popupText, setPopupText] = useState<string>();

    const getData = async () => {
        try {
            const result = await axios.get(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&polygon=1&addressdetails=1`);
            setLat(result.data[0]?.lat);
            setLon(result.data[0]?.lon);
            setPopupText(result.data[0]?.display_name);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {
                !!lat && !!lon && (
                    <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[lat, lon]}>
                            <Popup>
                                { popupText }
                            </Popup>
                        </Marker>
                    </MapContainer>
                )
            }
        </>
    )
};

export default Map;