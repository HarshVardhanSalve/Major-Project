	mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: listing.geometry.coordinates,
        zoom: 6,
        
    });

    console.log(listing.geometry.coordinates);

     // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h4>${listing.title}</h4><p>Exact Location Will Be Provided After Booking</p>`
            )
        )
        .addTo(map);