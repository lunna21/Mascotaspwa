document.addEventListener("DOMContentLoaded", () => {
  const btnCamara = document.getElementById("btnCamara");
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const foto = document.getElementById("foto");
  const btnFoto = document.getElementById("btnFoto");
  const cameraSelect = document.getElementById("cameraSelect");
  const cameraStatus = document.getElementById("cameraStatus");
  let stream;

  function setCameraStatus(message, isError = false) {
    if (!cameraStatus) return;
    cameraStatus.textContent = message;
    cameraStatus.className = isError
      ? "text-danger small mb-2"
      : "text-muted small mb-2";
  }

  btnCamara.onclick = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus("Este navegador no soporta acceso a la cámara.", true);
        return;
      }

      if (stream) stream.getTracks().forEach((track) => track.stop());
      const facingMode = cameraSelect.value;
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.style.display = "block";
      btnFoto.style.display = "inline-block";
      foto.style.display = "none";
      canvas.style.display = "none";
      await video.play();
      setCameraStatus(
        "Cámara activa. Si no ves la imagen en iPhone, comprueba que el navegador permite reproducción en línea.",
      );
    } catch (err) {
      setCameraStatus("No se pudo acceder a la cámara: " + err.message, true);
      alert("No se pudo acceder a la cámara: " + err.message);
    }
  };

  btnFoto.onclick = () => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    foto.src = canvas.toDataURL("image/png");
    foto.style.display = "block";
    canvas.style.display = "none";
    video.style.display = "none";
    btnFoto.style.display = "none";
    if (stream) stream.getTracks().forEach((track) => track.stop());
    setCameraStatus("Foto capturada correctamente.");
  };
});
