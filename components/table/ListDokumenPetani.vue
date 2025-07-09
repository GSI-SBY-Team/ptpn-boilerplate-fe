<template>
  <div>
    <!-- Data Petani Display -->
    <v-card v-if="petaniData" class="mb-4">
      <v-card-title class="d-flex align-center bg-primary mb-4 rounded-t-md">
        <v-icon class="mr-2">mdi-account</v-icon>
        Data Petani
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="2">
            <strong>NIK:</strong> {{ petaniData.nikKtp || "-" }}
          </v-col>
          <v-col cols="12" md="2">
            <strong>Nama Petani:</strong> {{ petaniData.nama || "-" }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Alamat:</strong> {{ petaniData.alamat || "-" }}
          </v-col>
          <v-col cols="12" md="2">
            <strong>No HP:</strong> {{ petaniData.noHp || "-" }}
          </v-col>
          <v-col cols="12" md="1">
            <strong> Luasan: </strong> {{ petaniData.luasan || "-" }}
          </v-col>
          <v-col cols="12" md="1">
            <strong>Potensi: </strong> {{ petaniData.potensi || "-" }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Map Section -->
    <v-card
      v-if="petaniData && petaniData.latitude && petaniData.longitude"
      class="mb-4"
    >
      <v-card-title class="d-flex align-center bg-primary rounded-t-md">
        <v-icon class="mr-2">mdi-map-marker</v-icon>
        Lokasi Petani di Peta
        <v-spacer></v-spacer>
        <v-chip
          :color="mapLoaded ? 'success' : 'warning'"
          variant="elevated"
          size="small"
        >
          <v-icon
            :icon="mapLoaded ? 'mdi-check-circle' : 'mdi-loading mdi-spin'"
            start
          ></v-icon>
          {{ mapLoaded ? "Peta Aktif" : "Memuat..." }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <!-- Koordinat Info -->
        <div class="mb-4">
          <v-alert type="info" variant="tonal" density="compact" class="mb-3">
            <template v-slot:prepend>
              <v-icon>mdi-crosshairs-gps</v-icon>
            </template>
            <strong>Koordinat:</strong>
            {{ petaniData.latitude }}, {{ petaniData.longitude }}
          </v-alert>
        </div>

        <!-- Map Container -->
        <div class="map-container">
          <div
            id="google-map"
            ref="mapContainer"
            class="google-map"
            :class="{ 'map-loading': !mapLoaded }"
          ></div>

          <!-- Loading Overlay -->
          <div v-if="!mapLoaded" class="map-loading-overlay">
            <v-progress-circular
              indeterminate
              color="primary"
              size="48"
            ></v-progress-circular>
            <p class="mt-3 text-body-1">Sedang memuat peta...</p>
          </div>
        </div>

        <!-- Map Controls -->
        <div class="map-controls mt-4">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-btn
                block
                color="primary"
                variant="elevated"
                @click="centerMap"
                :disabled="!mapLoaded"
                prepend-icon="mdi-crosshairs"
              >
                Pusatkan Peta
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn
                block
                color="secondary"
                variant="elevated"
                @click="toggleMapType"
                :disabled="!mapLoaded"
                prepend-icon="mdi-satellite-variant"
              >
                {{ isRoadMap ? "Satelit" : "Jalan" }}
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn
                block
                color="success"
                variant="elevated"
                @click="getDirections"
                :disabled="!mapLoaded"
                prepend-icon="mdi-directions"
              >
                Rute ke Lokasi
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn
                block
                color="info"
                variant="elevated"
                @click="shareLocation"
                :disabled="!mapLoaded"
                prepend-icon="mdi-share-variant"
              >
                Bagikan Lokasi
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <!-- Error Message jika tidak ada koordinat -->
    <v-card
      v-if="petaniData && (!petaniData.latitude || !petaniData.longitude)"
      class="mb-4"
    >
      <v-card-text>
        <v-alert type="warning" variant="tonal" prominent>
          <template v-slot:prepend>
            <v-icon>mdi-map-marker-off</v-icon>
          </template>
          <v-alert-title>Koordinat Tidak Tersedia</v-alert-title>
          Data latitude dan longitude petani belum tersedia untuk menampilkan
          peta.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Original Table Section -->
    <v-card>
      <div
        class="d-sm-flex align-center justify-space-between bg-primary rounded-t-md"
      >
        <v-card-title>{{ title }}</v-card-title>
      </div>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="11"></v-col>
          <v-col cols="12" md="1">
            <v-btn
              v-if="hasPermission('CREATE')"
              color="primary"
              icon
              @click="handleAddItem"
              size="32"
              variant="tonal"
            >
              <v-icon dark>mdi-plus-circle-outline</v-icon>
              <v-tooltip activator="parent" location="bottom">Tambah</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
        <br />
        <v-data-table
          class="datatabels productlist"
          :headers="headers"
          :items="tableData.items"
          :server-items-length="tableData.meta.totalItems"
          :items-per-page="itemsPerPage"
          :loading="loading"
          v-model:sort-by="sortBy"
          item-value="id"
          hide-default-footer
        >
          <template v-slot:[`item.no`]="{ item }">
            {{ numberInc + parseInt(tableData.items.indexOf(item)) + 1 }}.
          </template>
          <template v-slot:[`item.dokumen`]="{ item }">
            <v-btn
              icon
              variant="tonal"
              color="primary"
              size="32"
              class="mr-1"
              @click="lihatItem(item)"
            >
              <v-icon>mdi-file-document</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >Lihat Dokumen</v-tooltip
              >
            </v-btn>
          </template>
          <template
            v-for="header in headers.filter((header) =>
              header.hasOwnProperty('formatter')
            )"
            v-slot:[`item.${header.value}`]="{ value }"
            :key="header.value"
          >
            {{ header.formatter(value) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              v-if="hasPermission('UPDATE')"
              icon
              variant="tonal"
              color="warning"
              size="32"
              class="mr-1"
              @click="handleEditItem(item)"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="bottom">Edit</v-tooltip>
            </v-btn>

            <v-btn
              v-if="hasPermission('DELETE')"
              icon
              variant="tonal"
              color="error"
              size="32"
              class="mr-1"
              @click="deleteItem(item)"
            >
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="bottom">Hapus</v-tooltip>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Snackbar untuk notifikasi -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Tutup </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
// Import composables dan utilities
const route = useRoute();
const router = useRouter();
const { $permissions } = useNuxtApp();
const { $googleMapsLoaded } = useNuxtApp();
const config = useRuntimeConfig();

// Props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  defaultSortBy: {
    type: String,
    default: "id",
  },
  searchTitle: {
    type: String,
    default: "",
  },
  personId: {
    type: String,
    default: "",
  },
  petaniData: {
    type: Object,
    default: null,
  },
  tableData: {
    type: Object,
    default: () => ({
      items: [],
      meta: {
        totalItems: 0,
      },
    }),
  },
  headers: {
    type: Array,
    default: () => [],
  },
  itemFilter: {
    type: Array,
    default: () => [],
  },
  labelFilter: {
    type: String,
    default: "Filter",
  },
  permission: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  googleMapsApiKey: {
    type: String,
    default: () => useRuntimeConfig().public.googleMapsApiKey, // Use from config
  },
});
// Emits
const emit = defineEmits([
  "addItem",
  "editItem",
  "lihatItem",
  "deleteItem",
  "fetchData",
]);

// Reactive data
const itemsPerPage = ref(10);
const sortBy = ref([
  {
    key: props.defaultSortBy,
    order: "desc",
  },
]);

const filter = ref({
  q: "",
  pageSize: itemsPerPage.value,
  pageNumber: 1,
  sortBy: props.defaultSortBy,
  sortType: "desc",
  personId: props.personId,
});

// Google Maps data
const map = ref(null);
const marker = ref(null);
const mapLoaded = ref(false);
const isRoadMap = ref(true);
const infoWindow = ref(null);
const mapContainer = ref(null);

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

// Computed
const numberInc = computed(() => {
  return parseInt(filter.value.pageNumber - 1) * itemsPerPage.value;
});

const hasValidCoordinates = computed(() => {
  return (
    props.petaniData &&
    props.petaniData.latitude &&
    props.petaniData.longitude &&
    !isNaN(parseFloat(props.petaniData.latitude)) &&
    !isNaN(parseFloat(props.petaniData.longitude))
  );
});

// Methods
const hasPermission = (val) => {
  // Sesuaikan dengan implementasi permission sistem Anda
  // Contoh jika menggunakan composable atau plugin
  if ($permissions && typeof $permissions.hasPermission === "function") {
    const tag = `${props.permission}.${val}`;
    return $permissions.hasPermission(tag);
  }
  return true; // Default allow jika tidak ada sistem permission
};

const handleApplyFilter = () => {
  const filterCopy = { ...filter.value };
  filter.value = {
    q: filterCopy.q,
    pageSize: itemsPerPage.value,
    pageNumber: 1,
    sortBy: sortBy.value[0].key,
    sortType: sortBy.value[0].order,
    t: Date.now(),
    personId: props.personId,
  };

  router.replace({
    path: route.path,
    query: filter.value,
  });
};

const handleRefreshItems = () => {
  const resetFilter = { ...filter.value };
  resetFilter.q = "";
  resetFilter.pageNumber = 1;
  resetFilter.t = Date.now();
  filter.value = resetFilter;
  handleApplyFilter();
};

const handleAddItem = () => {
  emit("addItem");
};

const handleEditItem = (item) => {
  const itemCopy = JSON.parse(JSON.stringify(item));
  emit("editItem", itemCopy);
};

const lihatItem = (item) => {
  const itemCopy = JSON.parse(JSON.stringify(item));
  emit("lihatItem", itemCopy);
};

const deleteItem = (item) => {
  emit("deleteItem", item);
};

const updateFilterQuery = (query) => {
  const filterCopy = Object.assign(filter.value, query);
  filterCopy.pageNumber = parseInt(filterCopy.pageNumber);
  filterCopy.pageSize = parseInt(
    filterCopy.pageSize ? filterCopy.pageSize : itemsPerPage.value
  );
  filterCopy.t = Date.now();
  return filterCopy;
};

const handleClear = async () => {
  await handleResetFilter();
  filter.value.t = Date.now();
  router.replace({
    path: route.path,
    query: filter.value,
  });
};

const handleResetFilter = () => {
  filter.value = {
    pageNumber: 1,
    pageSize: itemsPerPage.value,
    q: "",
    sortBy: props.defaultSortBy,
    sortType: "desc",
    t: Date.now(),
    personId: props.personId,
  };
};

const handleSort = () => {
  if (sortBy.value.length > 0) {
    filter.value.sortBy = sortBy.value[0].key;
    filter.value.sortType = sortBy.value[0].order;
    router.replace({
      path: route.path,
      query: filter.value,
    });
  }
};

const loadGoogleMaps = async () => {
  if (process.client) {
    try {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        mapLoaded.value = true;
        nextTick(() => {
          initializeMap();
        });
        return;
      }

      // Use the plugin to wait for Google Maps to load
      if ($googleMapsLoaded) {
        const isLoaded = await $googleMapsLoaded();
        if (isLoaded) {
          mapLoaded.value = true;
          nextTick(() => {
            initializeMap();
          });
        } else {
          // Fallback: Load manually
          await loadGoogleMapsManually();
        }
      } else {
        // Fallback: Load manually
        await loadGoogleMapsManually();
      }
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      showSnackbar("Gagal memuat Google Maps", "error");
    }
  }
};

const loadGoogleMapsManually = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      mapLoaded.value = true;
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places,geometry&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;

    // Set global callback
    window.initGoogleMap = () => {
      mapLoaded.value = true;
      nextTick(() => {
        initializeMap();
      });
      resolve(true);
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);
  });
};

const initializeMap = () => {
  if (!hasValidCoordinates.value || !mapLoaded.value || !mapContainer.value) {
    return;
  }

  const lat = parseFloat(props.petaniData.latitude);
  const lng = parseFloat(props.petaniData.longitude);

  const mapOptions = {
    center: { lat, lng },
    zoom: 15,
    mapTypeId: "roadmap",
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
    ],
  };

  map.value = new google.maps.Map(mapContainer.value, mapOptions);

  // Create custom marker
  marker.value = new google.maps.Marker({
    position: { lat, lng },
    map: map.value,
    title: props.petaniData.nama || "Lokasi Petani",
    icon: {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#4CAF50" stroke="white" stroke-width="3"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="20">🌾</text>
          </svg>
        `),
      scaledSize: new google.maps.Size(40, 40),
    },
    animation: google.maps.Animation.DROP,
  });

  // Create info window
  infoWindow.value = new google.maps.InfoWindow({
    content: getInfoWindowContent(),
  });

  // Add click listener to marker
  marker.value.addListener("click", () => {
    infoWindow.value.open(map.value, marker.value);
  });

  // Auto open info window after 1 second
  setTimeout(() => {
    infoWindow.value.open(map.value, marker.value);
  }, 1000);

  showSnackbar("Peta berhasil dimuat!", "success");
};

const getInfoWindowContent = () => {
  const personType =
    props.petaniData.personType == 4
      ? "PETANI"
      : props.petaniData.personType == 3
      ? "PEMASOK"
      : "-";

  return `
    <div style="padding: 15px; max-width: 300px; font-family: 'Roboto', sans-serif;">
      <h3 style="color: #4CAF50; margin: 0 0 15px 0; font-size: 1.2em;">
        🌾 ${props.petaniData.nama || "Petani"}
      </h3>
      <div style="line-height: 1.6;">
        <p style="margin: 8px 0;"><strong>NIK:</strong> ${
          props.petaniData.nikKtp || "-"
        }</p>
        <p style="margin: 8px 0;"><strong>Alamat:</strong> ${
          props.petaniData.alamat || "-"
        }</p>
        <p style="margin: 8px 0;"><strong>No HP:</strong> ${
          props.petaniData.noHp || "-"
        }</p>
        <p style="margin: 8px 0;"><strong>Tipe:</strong> ${personType}</p>
        <p style="margin: 8px 0; font-size: 0.9em; color: #666;">
          <strong>Koordinat:</strong> ${props.petaniData.latitude}, ${
    props.petaniData.longitude
  }
        </p>
      </div>
    </div>
  `;
};

const centerMap = () => {
  if (map.value && marker.value) {
    map.value.setCenter(marker.value.getPosition());
    map.value.setZoom(18);
    marker.value.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.value.setAnimation(null);
    }, 2000);
    showSnackbar("Peta dipusatkan ke lokasi petani", "info");
  }
};

const toggleMapType = () => {
  if (map.value) {
    if (isRoadMap.value) {
      map.value.setMapTypeId("satellite");
      isRoadMap.value = false;
      showSnackbar("Tampilan peta: Satelit", "info");
    } else {
      map.value.setMapTypeId("roadmap");
      isRoadMap.value = true;
      showSnackbar("Tampilan peta: Jalan", "info");
    }
  }
};

const getDirections = () => {
  if (hasValidCoordinates.value) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${props.petaniData.latitude},${props.petaniData.longitude}`;
    window.open(url, "_blank");
    showSnackbar("Membuka Google Maps untuk petunjuk arah", "success");
  }
};

const shareLocation = () => {
  if (hasValidCoordinates.value) {
    const url = `https://www.google.com/maps?q=${props.petaniData.latitude},${props.petaniData.longitude}`;
    const text = `Lokasi ${props.petaniData.nama || "Petani"}: ${url}`;

    if (navigator.share) {
      navigator.share({
        title: "Lokasi Petani",
        text: text,
        url: url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showSnackbar("Link lokasi berhasil disalin!", "success");
        })
        .catch(() => {
          showSnackbar("Gagal menyalin link lokasi", "error");
        });
    }
  }
};

const showSnackbar = (message, color = "success") => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};

// Watchers
watch(
  () => route.query,
  (query) => {
    filter.value = updateFilterQuery(query);
    emit("fetchData");
  },
  { immediate: true }
);

watch(
  sortBy,
  () => {
    handleSort();
  },
  { deep: true }
);

watch(
  () => props.petaniData,
  (newData) => {
    if (newData && hasValidCoordinates.value && mapLoaded.value) {
      nextTick(() => {
        initializeMap();
      });
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  loadGoogleMaps();
});

// Expose methods if needed (optional)
defineExpose({
  handleRefreshItems,
  handleClear,
  centerMap,
  toggleMapType,
});
</script>

<style scoped>
.dt-table > td {
  border: 1px solid #d8dbe0 !important;
  border-collapse: collapse;
}

.select {
  width: 60px;
}

/* Google Maps Styles */
.map-container {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.google-map {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.map-loading {
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.map-controls {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

/* Animation untuk loading */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.map-loading-overlay p {
  animation: pulse 2s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 600px) {
  .map-container {
    height: 350px;
  }

  .map-controls .v-col {
    margin-bottom: 8px;
  }
}
</style>
