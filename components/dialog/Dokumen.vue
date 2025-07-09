<template>
  <div>
    <v-dialog
      v-model="dialog"
      :scrollable="scrollable"
      :width="width"
      :persistent="persistent"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">
            {{ formTitle }}
          </div>
        </v-card-title>
        <v-divider></v-divider>

        <!-- TEMPAT MENAMPILKAN FILE -->
        <v-card-text class="pt-4 text-center">
          <div
            v-if="isLoading"
            class="d-flex justify-center align-center"
            style="min-height: 200px"
          >
            <v-progress-circular
              color="primary"
              indeterminate
              :size="50"
            ></v-progress-circular>
          </div>

          <div v-else-if="file" class="file-preview-container">
            <!-- Untuk gambar -->
            <img
              v-if="isImage(file)"
              :src="file"
              alt="Preview Dokumen"
              class="preview-image"
              @error="handleImageError"
              @load="handleImageLoad"
            />

            <!-- Untuk PDF atau dokumen lain -->
            <iframe
              v-else-if="isPdf(file)"
              :src="file"
              class="preview-iframe"
              frameborder="0"
            ></iframe>

            <!-- Untuk GeoJSON - Google Maps -->
            <div v-else-if="isGeoJson(file)" class="geojson-container">
              <div ref="mapContainer" id="google-map" class="google-map"></div>
              <div v-if="mapError" class="map-error">
                <v-alert type="error" class="ma-4">
                  {{ mapError }}
                </v-alert>
              </div>
            </div>

            <!-- Untuk file lain yang tidak bisa di-preview -->
            <div v-else class="file-info">
              <v-icon size="64" color="grey">mdi-file-document</v-icon>
              <p class="mt-4">File tidak dapat di-preview</p>
              <v-btn
                color="primary"
                :href="file"
                target="_blank"
                prepend-icon="mdi-download"
              >
                Download File
              </v-btn>
            </div>
          </div>

          <div v-else class="no-file">
            <v-icon size="64" color="grey">mdi-file-alert</v-icon>
            <p class="mt-4 text-grey">Tidak ada file untuk ditampilkan</p>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <!-- Tombol download jika ada file -->
          <v-btn
            v-if="file"
            color="primary"
            variant="outlined"
            :href="file"
            target="_blank"
            prepend-icon="mdi-download"
          >
            DOWNLOAD
          </v-btn>

          <v-btn color="grey" variant="tonal" @click.prevent="handleClose">
            TUTUP
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    file: {
      type: String,
      default: "",
    },
    formTitle: {
      type: String,
    },
    width: {
      type: String,
      default: "900px",
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
    reset: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    googleMapsApiKey: {
      type: String,
      required: false,
      default: "", // Anda perlu provide API key
    },
  },
  watch: {
    show: {
      immediate: true,
      handler() {
        this.dialog = this.show;
        this.resetForm = this.reset;

        // Debug
        console.log("DialogDokumen - show changed:", {
          show: this.show,
          file: this.file,
          dialog: this.dialog,
        });

        // Load GeoJSON map when dialog opens
        if (this.show && this.isGeoJson(this.file)) {
          this.$nextTick(() => {
            this.loadGeoJsonMap();
          });
        }
      },
    },
    dialog(nv) {
      if (!nv) {
        this.handleClose();
      }
    },
    file: {
      immediate: true,
      handler(newFile) {
        console.log("DialogDokumen - file changed:", newFile);
        // Reset map error when file changes
        this.mapError = null;
      },
    },
  },
  data() {
    return {
      valid: false,
      dialog: false,
      resetForm: true,
      map: null,
      mapError: null,
    };
  },
  methods: {
    handleClose() {
      console.log("DialogDokumen - closing");
      this.dialog = false;
      // Clean up map instance
      if (this.map) {
        this.map = null;
      }
      this.$emit("handleCloseDokumen");
    },

    isImage(url) {
      if (!url) return false;
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
      ];
      const urlLower = url.toLowerCase();
      return imageExtensions.some((ext) => urlLower.includes(ext));
    },

    isPdf(url) {
      if (!url) return false;
      return url.toLowerCase().includes(".pdf");
    },

    isGeoJson(url) {
      if (!url) return false;
      const geoJsonExtensions = [".geojson", ".json"];
      const urlLower = url.toLowerCase();
      return geoJsonExtensions.some((ext) => urlLower.includes(ext));
    },

    handleImageError(event) {
      console.error("Error loading image:", event);
      console.error("Image URL:", this.file);
    },

    handleImageLoad(event) {
      console.log("Image loaded successfully:", this.file);
    },

    async loadGoogleMapsScript() {
      return new Promise((resolve, reject) => {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          // Wait for it to load
          const checkLoaded = () => {
            if (window.google && window.google.maps) {
              resolve();
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
          return;
        }

        // Create and load the script
        const script = document.createElement("script");
        const apiKey = this.googleMapsApiKey || "YOUR_API_KEY_HERE";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));

        document.head.appendChild(script);
      });
    },

    async loadGeoJsonMap() {
      try {
        // Load Google Maps script first
        await this.loadGoogleMapsScript();

        if (!this.$refs.mapContainer) {
          console.error("Map container not found");
          return;
        }

        // Initialize map
        this.map = new google.maps.Map(this.$refs.mapContainer, {
          zoom: 10,
          center: { lat: -7.9797, lng: 112.6304 }, // Default center (Malang, Indonesia)
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        // Fetch and load GeoJSON data
        const response = await fetch(this.file);
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
        }

        const geoJsonData = await response.json();

        // Load GeoJSON to map
        this.map.data.addGeoJson(geoJsonData);

        // Style the features
        this.map.data.setStyle({
          fillColor: "#4285f4",
          fillOpacity: 0.3,
          strokeColor: "#4285f4",
          strokeWeight: 2,
        });

        // Fit map to show all features
        const bounds = new google.maps.LatLngBounds();
        this.map.data.forEach((feature) => {
          this.processPoints(feature.getGeometry(), bounds.extend, bounds);
        });

        if (!bounds.isEmpty()) {
          this.map.fitBounds(bounds);
        }

        // Add click listener for features
        this.map.data.addListener("click", (event) => {
          const properties = event.feature.getProperty("properties") || {};
          let content = "<div>";

          Object.keys(properties).forEach((key) => {
            content += `<strong>${key}:</strong> ${properties[key]}<br>`;
          });
          content += "</div>";

          const infoWindow = new google.maps.InfoWindow({
            content: content,
            position: event.latLng,
          });

          infoWindow.open(this.map);
        });

        console.log("GeoJSON loaded successfully");
      } catch (error) {
        console.error("Error loading GeoJSON map:", error);
        this.mapError = `Error loading map: ${error.message}`;
      }
    },

    processPoints(geometry, callback, thisArg) {
      if (geometry instanceof google.maps.LatLng) {
        callback.call(thisArg, geometry);
      } else if (geometry instanceof google.maps.Data.Point) {
        callback.call(thisArg, geometry.get());
      } else {
        geometry.getArray().forEach((g) => {
          this.processPoints(g, callback, thisArg);
        });
      }
    },
  },

  beforeDestroy() {
    // Clean up map when component is destroyed
    if (this.map) {
      this.map = null;
    }
  },
};
</script>

<style scoped>
.v-card .v-card-actions {
  padding: 10px 24px 10px !important;
}

.file-preview-container {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-iframe {
  width: 100%;
  height: 70vh;
  border-radius: 8px;
}

.file-info,
.no-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.geojson-container {
  width: 100%;
  height: 70vh;
  position: relative;
}

.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
