let facingMode = "environment"; // Initial facing mode
let mediaStream; // Store the current media stream

// Request access to camera upon opening the application
navigator.mediaDevices
  .getUserMedia({
    video: { facingMode },
    audio: false,
  })
  .then((stream) => {
    mediaStream = stream; // Store the media stream

    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    document.getElementById("viewfinder").appendChild(video);
    document.getElementById("camera-loading").style.display = "none";
  })
  .catch(handleError);

function rotateCamera() {
  // Toggle the facing mode
  facingMode = facingMode === "environment" ? "user" : "environment";

  // Release the previous media stream
  mediaStream.getTracks().forEach((track) => track.stop());

  // Request access to the new facing mode
  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode },
      audio: false,
    })
    .then((stream) => {
      mediaStream = stream; // Store the media stream

      const video = document.querySelector("video");
      video.srcObject = stream;
      video.play();
    })
    .catch(handleError);
}

function capturePhotos() {
  //Hide the camera view
  hideElement("camera");
  showElement("photo-library-loading");

  const capturePhoto = (videoElement, photoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    photoElement.src = canvas.toDataURL();
  };

  // Capture photo from current camera
  const currentVideo = document.querySelector("video");
  const currentPhoto = document.getElementById("photo-big");
  capturePhoto(currentVideo, currentPhoto);

  // Toggle the facing mode
  facingMode = facingMode === "environment" ? "user" : "environment";

  // Request access to the new facing mode
  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode },
      audio: false,
    })
    .then((stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      // Wait for the other camera to start
      video.addEventListener("loadedmetadata", () => {
        // Capture photo from other camera
        const otherPhoto = document.getElementById("photo-small");
        capturePhoto(video, otherPhoto);

        // Show the photo library
        hideElement("photo-library-loading");
        showElement("photo-library");
      });
    })
    .catch(handleError);
}

function closePhotoLibrary() {
  rotateCamera();

  // Show the camera view
  hideElement("photo-library");
  showElement("camera");
}

function hideElement(elementId) {
  document.getElementById(elementId).style.display = "none";
}

function showElement(elementId) {
  document.getElementById(elementId).style.display = "flex";
}

function handleError(error) {
  console.error(error);
}
