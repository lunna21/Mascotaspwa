function getGeoLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log("Latitud:", position.coords.latitude);
        console.log("Longitud:", position.coords.longitude);
        mostrarMapa(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        console.error("Error obteniendo la geolocalización:", error.message);
      },
    );
  } else {
    console.log("La geolocalización no está soportada por este navegador.");
  }
}

function mostrarMapa(lat, lng) {
  if (window._mapa) {
    window._mapa.remove();
  }
  window._mapa = L.map("map").setView([lat, lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© personal",
  }).addTo(window._mapa);

  const customIcon = L.divIcon({
    className: "",
    html: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 30s10-12.27 10-18A10 10 0 1 0 6 12c0 5.73 10 18 10 18z" fill="#B0F0FF" stroke="#000000" stroke-width="2"/>
          <circle cx="16" cy="13" r="4" fill="#fff" stroke="#000000" stroke-width="2"/>
        </svg>
        `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

//   L.marker([lat, lng], { icon: customIcon })
//     .addTo(window._mapa)
//     .bindPopup(
//       '<b>¡Soy un perrito!</b><br><img src="data:image/jpeg;base64,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" alt="Ubicación" width="100">',
//     )
//     .openPopup();
// }
    L.marker([lat, lng], { icon: customIcon }).addTo(window._mapa)
        .bindPopup('<b>¡Soy un gato!</b><br><img src="gato.jpg" alt="Ubicación" width="100">')
        .openPopup();
}