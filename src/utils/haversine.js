export default function getHaversineDistance (firstLocation, secondLocation) {
    const earthRadius = 6371;

    const diffLat = (secondLocation.lat-firstLocation.lat) * Math.PI / 180;  
    const diffLng = (secondLocation.lng-firstLocation.lon) * Math.PI / 180;  

    const arc = Math.cos(
                    firstLocation.lat * Math.PI / 180) * Math.cos(secondLocation.lat * Math.PI / 180) 
                    * Math.sin(diffLng/2) * Math.sin(diffLng/2)
                    + Math.sin(diffLat/2) * Math.sin(diffLat/2);
    const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1-arc));

    const distance = earthRadius * line; 

    return distance;
}