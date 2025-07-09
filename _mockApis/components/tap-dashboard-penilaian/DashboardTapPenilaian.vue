<template>
    <div>
      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Total Penyadap</h3>
          <p class="text-2xl font-bold text-blue-600">
            {{ dashboardStats.totalPenyadap }}
          </p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Rerata Keseluruhan</h3>
          <p class="text-2xl font-bold text-green-600">
            {{ dashboardStats.rerataKeseluruhan.toFixed(2) }}
          </p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Total Panel Aktif</h3>
          <p class="text-2xl font-bold text-purple-600">
            {{ dashboardStats.totalPanel }}
          </p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Periode Terkini</h3>
          <p class="text-2xl font-bold text-orange-600">
            {{ dashboardStats.periodeTerkini }}
          </p>
        </div>
      </div>
  
      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Distribusi Kelas Chart -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Distribusi Kelas Penyadap</h3>
          <div class="chart-container">
            <div
              v-for="(item, index) in kelasChartData"
              :key="index"
              class="chart-bar-item"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Kelas {{ item.kelas }}</span>
                <span class="text-sm text-gray-600">{{ item.jumlah }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  class="bg-blue-500 h-4 rounded-full transition-all duration-300"
                  :style="{ width: (item.jumlah / maxKelasValue) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Trend Rerata Penilaian Chart -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">
            Trend Rerata Penilaian per Bulan
          </h3>
          <div class="chart-container">
            <div class="flex items-end justify-between h-48 space-x-2">
              <div
                v-for="(item, index) in trendChartData"
                :key="index"
                class="flex flex-col items-center flex-1"
              >
                <div class="text-xs text-gray-600 mb-1">
                  {{ item.rerata.toFixed(1) }}
                </div>
                <div
                  class="bg-green-500 w-full rounded-t transition-all duration-300"
                  :style="{ height: (item.rerata / maxTrendValue) * 180 + 'px' }"
                ></div>
                <div
                  class="text-xs text-gray-700 mt-2 transform -rotate-45 origin-top-left"
                >
                  {{ item.bulan }}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Distribusi Panel Chart -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Distribusi Panel</h3>
          <div class="chart-container">
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="(item, index) in panelChartData"
                :key="index"
                class="flex items-center"
              >
                <div
                  class="w-4 h-4 rounded mr-2"
                  :style="{ backgroundColor: COLORS[index % COLORS.length] }"
                ></div>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ item.panel }}</div>
                  <div class="text-xs text-gray-600">
                    {{ item.jumlah }} penyadap
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <div
                v-for="(item, index) in panelChartData"
                :key="index"
                class="h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                :style="{
                  backgroundColor: COLORS[index % COLORS.length],
                  width: (item.jumlah / totalPanelCount) * 100 + '%',
                  minWidth: '60px',
                }"
              >
                {{ item.panel }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Top Performers Chart -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Top 5 Penyadap (Total Point)</h3>
          <div class="chart-container">
            <div
              v-for="(item, index) in topPerformersData"
              :key="index"
              class="mb-4"
            >
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium truncate">{{ item.nama }}</span>
                <span class="text-sm text-gray-600">{{ item.totalPoint }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-orange-500 h-3 rounded-full transition-all duration-300"
                  :style="{
                    width: (item.totalPoint / maxPerformerValue) * 100 + '%',
                  }"
                ></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">#{{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface DashboardStats {
    totalPenyadap: number;
    rerataKeseluruhan: number;
    totalPanel: number;
    periodeTerkini: string;
  }
  
  interface KelasChartItem {
    kelas: string;
    jumlah: number;
  }
  
  interface TrendChartItem {
    bulan: string;
    rerata: number;
  }
  
  interface PanelChartItem {
    panel: string;
    jumlah: number;
  }
  
  interface TopPerformerItem {
    nama: string;
    totalPoint: number;
  }
  
  // Props
  const props = defineProps<{
    tableData: any;
  }>();
  
  // Data
  const dashboardStats = ref<DashboardStats>({
    totalPenyadap: 0,
    rerataKeseluruhan: 0,
    totalPanel: 0,
    periodeTerkini: "",
  });
  
  const kelasChartData = ref<KelasChartItem[]>([]);
  const trendChartData = ref<TrendChartItem[]>([]);
  const panelChartData = ref<PanelChartItem[]>([]);
  const topPerformersData = ref<TopPerformerItem[]>([]);
  
  // Constants
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
  ];
  
  // Computed
  const maxKelasValue = computed(() =>
    Math.max(...kelasChartData.value.map((d) => d.jumlah), 1)
  );
  
  const maxTrendValue = computed(() =>
    Math.max(...trendChartData.value.map((d) => d.rerata), 1)
  );
  
  const maxPerformerValue = computed(() =>
    Math.max(...topPerformersData.value.map((d) => d.totalPoint), 1)
  );
  
  const totalPanelCount = computed(() =>
    panelChartData.value.reduce((sum, item) => sum + item.jumlah, 0)
  );
  
  // Methods
  function generateDashboardData() {
    const items = props.tableData.items;
  
    if (!items || items.length === 0) {
      // Reset data when no items
      dashboardStats.value = {
        totalPenyadap: 0,
        rerataKeseluruhan: 0,
        totalPanel: 0,
        periodeTerkini: "",
      };
      kelasChartData.value = [];
      trendChartData.value = [];
      panelChartData.value = [];
      topPerformersData.value = [];
      return;
    }
  
    // Dashboard Stats
    dashboardStats.value.totalPenyadap = items.length;
    dashboardStats.value.rerataKeseluruhan =
      items.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.rerata) || 0),
        0
      ) / items.length;
    dashboardStats.value.totalPanel = [
      ...new Set(items.map((item: any) => item.kodePanel)),
    ].length;
    dashboardStats.value.periodeTerkini =
      items.length > 0
        ? `${items[0].bulanPenilaian}/${items[0].tahunPenilaian}`
        : "";
  
    // Kelas Chart Data
    const kelasCount = items.reduce((acc: any, item: any) => {
      acc[item.kelas] = (acc[item.kelas] || 0) + 1;
      return acc;
    }, {});
  
    kelasChartData.value = Object.entries(kelasCount)
      .map(([kelas, jumlah]) => ({
        kelas,
        jumlah: jumlah as number,
      }))
      .sort((a, b) => a.kelas.localeCompare(b.kelas));
  
    // Trend Chart Data (by month)
    const monthlyAvg = items.reduce((acc: any, item: any) => {
      const key = `${item.bulanPenilaian}/${item.tahunPenilaian}`;
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      acc[key].total += parseFloat(item.rerata) || 0;
      acc[key].count += 1;
      return acc;
    }, {});
  
    trendChartData.value = Object.entries(monthlyAvg)
      .map(([bulan, data]: [string, any]) => ({
        bulan,
        rerata: parseFloat((data.total / data.count).toFixed(2)),
      }))
      .sort((a, b) => a.bulan.localeCompare(b.bulan));
  
    // Panel Chart Data
    const panelCount = items.reduce((acc: any, item: any) => {
      acc[item.kodePanel] = (acc[item.kodePanel] || 0) + 1;
      return acc;
    }, {});
  
    panelChartData.value = Object.entries(panelCount)
      .map(([panel, jumlah]) => ({
        panel,
        jumlah: jumlah as number,
      }))
      .sort((a, b) => b.jumlah - a.jumlah);
  
    // Top Performers Data
    const sortedByPoint = [...items]
      .sort(
        (a, b) => parseFloat(b.totalPoint || 0) - parseFloat(a.totalPoint || 0)
      )
      .slice(0, 5);
  
    topPerformersData.value = sortedByPoint.map((item: any) => ({
      nama: item.namaPenyadap,
      totalPoint: parseFloat(item.totalPoint || 0),
    }));
  }
  
  // Watch for data changes
  watch(
    () => props.tableData,
    () => {
      generateDashboardData();
    },
    { deep: true, immediate: true }
  );
  
  // Expose method for parent component
  defineExpose({
    generateDashboardData,
  });
  </script>
  
  <style scoped>
  .grid {
    display: grid;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  
  .gap-2 {
    gap: 0.5rem;
  }
  
  .gap-4 {
    gap: 1rem;
  }
  
  .gap-6 {
    gap: 1.5rem;
  }
  
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  
  .mt-1 {
    margin-top: 0.25rem;
  }
  
  .mt-2 {
    margin-top: 0.5rem;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
  
  .mr-2 {
    margin-right: 0.5rem;
  }
  
  .bg-white {
    background-color: white;
  }
  
  .bg-gray-200 {
    background-color: #e5e7eb;
  }
  
  .bg-gray-500 {
    background-color: #6b7280;
  }
  
  .bg-blue-500 {
    background-color: #3b82f6;
  }
  
  .bg-green-500 {
    background-color: #10b981;
  }
  
  .bg-orange-500 {
    background-color: #f97316;
  }
  
  .p-4 {
    padding: 1rem;
  }
  
  .rounded {
    border-radius: 0.25rem;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .rounded-full {
    border-radius: 9999px;
  }
  
  .rounded-t {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  
  .shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .font-medium {
    font-weight: 500;
  }
  
  .font-semibold {
    font-weight: 600;
  }
  
  .font-bold {
    font-weight: 700;
  }
  
  .text-white {
    color: white;
  }
  
  .text-gray-500 {
    color: #6b7280;
  }
  
  .text-gray-600 {
    color: #4b5563;
  }
  
  .text-gray-700 {
    color: #374151;
  }
  
  .text-blue-600 {
    color: #2563eb;
  }
  
  .text-green-600 {
    color: #16a34a;
  }
  
  .text-purple-600 {
    color: #9333ea;
  }
  
  .text-orange-600 {
    color: #ea580c;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-1 {
    flex: 1 1 0%;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .flex-wrap {
    flex-wrap: wrap;
  }
  
  .items-center {
    align-items: center;
  }
  
  .items-end {
    align-items: flex-end;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.5rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .w-4 {
    width: 1rem;
  }
  
  .h-3 {
    height: 0.75rem;
  }
  
  .h-4 {
    height: 1rem;
  }
  
  .h-8 {
    height: 2rem;
  }
  
  .h-48 {
    height: 12rem;
  }
  
  .min-w-16 {
    min-width: 4rem;
  }
  
  .chart-container {
    min-height: 200px;
  }
  
  .chart-bar-item {
    margin-bottom: 1rem;
  }
  
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .duration-300 {
    transition-duration: 300ms;
  }
  
  .transform {
    transform: translate(0, 0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
  }
  
  .-rotate-45 {
    transform: rotate(-45deg);
  }
  
  .origin-top-left {
    transform-origin: top left;
  }
  
  @media (min-width: 768px) {
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  
  @media (min-width: 1024px) {
    .lg\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  
    .lg\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
  </style>