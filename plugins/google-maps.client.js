// plugins/google-maps.client.js
export default defineNuxtPlugin(() => {
  // This plugin runs only on client-side
  if (process.client) {
    // Ensure Google Maps API is loaded
    const checkGoogleMaps = () => {
      return new Promise((resolve) => {
        if (window.google && window.google.maps) {
          resolve(true);
          return;
        }

        // If not loaded, wait for it
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(false);
        }, 10000);
      });
    };

    // Make it available globally
    window.$googleMapsLoaded = checkGoogleMaps;

    // Provide it to the app
    return {
      provide: {
        googleMapsLoaded: checkGoogleMaps,
      },
    };
  }
});
