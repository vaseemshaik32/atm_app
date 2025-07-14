export function getuserlocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude }); // Resolve with the location data
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Location access is required to log in. Please allow location access.");
            reject("Location access denied"); // Reject the promise
          } else {
            alert("Error retrieving location. Please try again.");
            reject("Error retrieving location"); // Reject the promise
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      reject("Geolocation not supported"); // Reject the promise
    }
  });
}

