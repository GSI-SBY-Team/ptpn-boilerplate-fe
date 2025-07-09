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
            type="bar"
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
    name: "Luka",
    data: [],
  },
]);
const chartOptions = ref({
  chart: {
    type: "bar",
    height: 350,
    fontFamily: `inherit`,
    foreColor: "#a1aab2",
    toolbar: {
      show: false,
    },
  },
  colors: [getPrimary.value, getSecondary.value],
  plotOptions: {
    bar: {
      horizontal: false,
      endingShape: "rounded",
      columnWidth: "20%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },

  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: "Jumlah (Satuan)",
    },
  },
  fill: {
    opacity: 1,
  },

  tooltip: {
    theme: "dark",
    y: {
      formatter(val) {
        return `${val}`;
      },
    },
  },
  grid: {
    show: true,
  },
  legend: {
    show: true,
    position: "bottom",
    width: "50px",
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false,
        },
      },
    },
  ],
});
</script>
