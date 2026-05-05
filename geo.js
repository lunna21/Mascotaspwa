function setGeoStatus(message, isError = false) {
  const status = document.getElementById("geoStatus");
  if (!status) return;
  status.textContent = message;
  status.className = isError
    ? "text-danger small mb-0"
    : "text-muted small mb-0";
}

function getGeoLocation() {
  if (!("geolocation" in navigator)) {
    setGeoStatus(
      "La geolocalización no está soportada por este navegador.",
      true,
    );
    return;
  }

  setGeoStatus("Solicitando ubicación...");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log("Latitud:", position.coords.latitude);
      console.log("Longitud:", position.coords.longitude);
      mostrarMapa(position.coords.latitude, position.coords.longitude);
    },
    function (error) {
      console.error("Error obteniendo la geolocalización:", error.message);
      setGeoStatus(
        "No se pudo obtener la ubicación. Revisa permisos de ubicación y asegúrate de abrir la web por HTTPS.",
        true,
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
}

function mostrarMapa(lat, lng) {
  if (typeof L === "undefined") {
    setGeoStatus(
      "Leaflet no se cargó correctamente. Revisa la conexión a la CDN.",
      true,
    );
    return;
  }

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
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="11" cy="10" rx="3" ry="3.6" fill="#B0F0FF" stroke="#145a6a" stroke-width="1.6"/>
          <ellipse cx="21" cy="10" rx="3" ry="3.6" fill="#B0F0FF" stroke="#145a6a" stroke-width="1.6"/>
          <ellipse cx="8" cy="17" rx="2.8" ry="3.3" fill="#B0F0FF" stroke="#145a6a" stroke-width="1.6"/>
          <ellipse cx="24" cy="17" rx="2.8" ry="3.3" fill="#B0F0FF" stroke="#145a6a" stroke-width="1.6"/>
          <path d="M16 14.5c-4 0-6.8 2.9-6.8 6.3 0 2.9 2.2 5.2 5 5.2 1.2 0 1.9-.4 2.9-1 .9.6 1.6 1 2.8 1 2.9 0 5.1-2.3 5.1-5.2 0-3.4-2.9-6.3-7-6.3z" fill="#B0F0FF" stroke="#145a6a" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  L.marker([lat, lng], { icon: customIcon })
    .addTo(window._mapa)
    .bindPopup(
      '<b>¡Soy un perrito!</b><br><img src="data:image/jpeg;base64,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" alt="Ubicación" width="100">',
    )
    .openPopup();

  setTimeout(() => {
    window._mapa.invalidateSize();
  }, 0);

  setGeoStatus("Ubicación mostrada correctamente.");
}
