<template>
  <div>
    <v-card>
      <v-card-item class="py-4 px-6">
        <div class="d-sm-flex align-center justify-space-between">
          <v-card-title class="text-h6">{{ title }}</v-card-title>
          <slot name="action"></slot>
        </div>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-text>
        <ClientOnly
          ><apexchart
            style="width: 100%"
            type="line"
            height="300"
            :options="chartOptions"
            :series="chartSeries"
            :key="keyChart"
          >
          </apexchart
        ></ClientOnly>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useTheme } from "vuetify";
import { getPrimary, getSecondary } from "@/utils/UpdateColors";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  series: {
    type: Array,
    default: [],
  },
  categories: {
    type: Array,
    default: [],
  },
});

const keyChart = ref(1);

watch(
  () => props.categories,
  (newVal) => {
    if (props.categories.length > 0) {
      chartOptions.value.xaxis.categories = newVal || [];
      chartSeries.value[0].data = props.series || [];
      keyChart.value++;
    }
  },
  { immediate: true }
);

const key = ref(1);
const theme = useTheme();
const chartSeries = ref([
  {
    name: "Luas Petik",
    data: [],
  },
]);
const chartOptions = ref({
  chart: {
    height: 350,
    type: "line",
    fontFamily: `inherit`,
    zoom: {
      type: "x",
      enabled: true,
    },
    toolbar: {
      show: false,
    },
    shadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 1,
    },
  },
  colors: ['#03ff00', getSecondary.value],
  markers: {
    size: 1,
  },
  xaxis: {
    categories: [],
    // title: {
    //   text: "Produksi Karet",
    // },
  },
  yaxis: {
    title: {
      text: "Luas Panen",
    },
    min: 5,
    max: 40,
  },
  grid: {
    show: true,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
    width: "2",
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
  tooltip: {
    theme: "dark",
    // x: {
    //   format: "dd/MM/yy HH:mm",
    // },
  },
});
</script>