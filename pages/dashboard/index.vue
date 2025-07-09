<template>
  <!-- <Snackbar /> -->
  <v-row>
    <v-col cols="12" md="3">
      <h4 class="text-h4">Dashboard</h4>
      <span class="text-subtitle-1 textSecondary">Statistics & Reports</span>
    </v-col>
    <v-col cols="12" md="1"></v-col>
    <v-col cols="12" md="2">
      <v-text-field
        v-model="filter.tanggal"
        label="Tanggal"
        density="compact"
        placeholder="Tanggal"
        type="date"
        hide-details="auto"
        @update:modelValue="handleFilter()"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="2">
      <v-autocomplete
        v-model="filter.idRegional"
        label="Regional"
        :items="listRegional"
        item-value="id"
        item-title="nama"
        color="primary"
        variant="outlined"
        :disabled="disabledReg"
        density="compact"
        @update:modelValue="handleFilterKebun()"
        clearable
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" md="2">
      <v-autocomplete
        v-model="filter.idKebun"
        label="Kebun"
        :items="listKebun"
        item-value="id"
        item-title="nama"
        :disabled="disabledKebun"
        color="primary"
        variant="outlined"
        density="compact"
        @update:modelValue="handleFilterAfdeling()"
        clearable
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" md="2">
      <v-autocomplete
        v-model="filter.idAfdeling"
        label="Afdeling"
        :items="listAfdeling"
        item-value="id"
        :disabled="disabledAfdeling"
        item-title="nama"
        color="primary"
        variant="outlined"
        density="compact"
        @update:modelValue="handleFilter()"
        clearable
      ></v-autocomplete>
    </v-col>
  </v-row>

  <v-row class="mt-0">
    <v-col cols="12" md="2">
      <DashboardCardTop
        title="Pegawai"
        :img="card_icon1"
        bgcolor="lightprimary"
        textcolor="primary"
        :number="dbPresensi.totalPegawai || 0"
      />
    </v-col>
    <v-col cols="12" md="2">
      <DashboardCardTop
        title="Libur"
        :img="card_icon2"
        bgcolor="lightwarning"
        textcolor="warning"
        :number="dbPresensi.libur || 0"
      />
    </v-col>
    <v-col cols="12" md="2">
      <DashboardCardTop
        title="Mangkir"
        :img="card_icon3"
        bgcolor="lightsecondary"
        textcolor="secondary"
        :number="dbPresensi.magkir || 0"
      />
    </v-col>
    <v-col cols="12" md="2">
      <DashboardCardTop
        title="Izin/Cuti"
        :img="card_icon4"
        bgcolor="lighterror"
        textcolor="error"
        :number="dbPresensi.cuti || 0"
      />
    </v-col>
    <v-col cols="12" md="4">
      <DashboardPresensiOverview
        title="Presensi"
        :persentase="dbPresensi.persentase || 0"
        :value1="dbPresensi.kehadiran || 0"
        :value2="dbPresensi.belumHadir || 0"
      />
    </v-col>
  </v-row>
  <br />
  <h5 class="text-h5">Komoditas Karet</h5>
  <v-row class="mt-2">
    <v-col cols="12" md="3">
      <DashboardCardBox
        title="Basah Kebun"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiKaret.karetBasahKebun || 0} Kg`"
        subtitle="Komoditi Karet"
      />
    </v-col>
    <v-col cols="12" md="3"
      ><DashboardCardBox
        title="Basah Pabrik"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiKaret.karetBasahPabrik || 0} Kg`"
        subtitle="Komoditi Karet"
    /></v-col>
    <v-col cols="12" md="3"
      ><DashboardCardBox
        title="Kering Pabrik"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiKaret.karetKeringPabrik || 0} Kg`"
        subtitle="Komoditi Karet"
    /></v-col>
    <v-col cols="12" md="3"
      ><DashboardCardBox
        title="KG/Pertaper"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiKaret.karetKgPertaper || 0} Kg`"
        subtitle="Komoditi Karet"
    /></v-col>
  </v-row>
  <br />
  <h5 class="text-h5">Komoditas Teh</h5>
  <v-row class="mt-2">
    <v-col cols="12" md="4"
      ><DashboardCardBox
        title="Basah Kebun"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiTeh.tehBasahKebun || 0} Kg`"
        subtitle="Komoditi Teh"
    /></v-col>
    <v-col cols="12" md="4"
      ><DashboardCardBox
        title="Basah Pabrik"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiTeh.tehBasahPabrik || 0} Kg`"
        subtitle="Komoditi Teh"
    /></v-col>
    <v-col cols="12" md="4"
      ><DashboardCardBox
        title="KG/HK"
        icon="LayoutBoardIcon"
        :value="`${dbPrestasiTeh.tehLKgPerhk || 0} Kg`"
        subtitle="Komoditi Teh"
    /></v-col>
  </v-row>
  <br />
  <!-- <h5 class="text-h5">Tap Inspeksi</h5>
  <v-row class="mt-2">
    <v-col cols="12" md="4">
      <DashboardChartLuka
        title="Luka Kecil"
        :categories="summaryTapInspeksi.categories"
        :series="summaryTapInspeksi.series"
      ></DashboardChartLuka>
    </v-col>
    <v-col cols="12" md="4">
      <DashboardChartLuka
        title="Luka Sedang"
        :categories="summaryTapInspeksi.categories"
        :series="summaryTapInspeksi.series2"
      ></DashboardChartLuka>
    </v-col>
    <v-col cols="12" md="4">
      <DashboardChartLuka
        title="Luka Besar"
        :categories="summaryTapInspeksi.categories"
        :series="summaryTapInspeksi.series3"
      ></DashboardChartLuka>
    </v-col>
  </v-row> -->
  <br />
  <h5 class="text-h5">Absensi</h5>
  <v-row class="mt-2">
    <v-col cols="12" md="12">
      <DashboardChartPresensi
        title="Absensi"
        :categories="summaryPresensi.categories"
        :series="summaryPresensi.series"
      ></DashboardChartPresensi>
    </v-col>
  </v-row>
  <br />
  <h5 class="text-h5">Prestasi Karet</h5>
  <v-row class="mt-3">
    <v-col cols="12" md="6"
      ><DashboardChartProduksiKaret
        title="Produksi"
        :categories="summaryProduksiKaret.categories"
        :series="summaryProduksiKaret.series"
      ></DashboardChartProduksiKaret>
    </v-col>
    <v-col cols="12" md="6"
      ><DashboardChartPertaperKaret
        title="KG/Pertaper"
        :categories="summaryProduksiKaret.categories"
        :series="summaryProduksiKaret.series2"
      ></DashboardChartPertaperKaret>
    </v-col>
  </v-row>
  <br />
  <h5 class="text-h5">Prestasi Teh</h5>
  <v-row class="mt-3">
    <v-col cols="12" md="4">
      <DashboardChartProduksiTeh
        title="Produksi"
        :categories="summaryProduksiTeh.categories"
        :series="summaryProduksiTeh.series"
      ></DashboardChartProduksiTeh>
    </v-col>
    <v-col cols="12" md="4"
      ><DashboardChartKapasitasTeh
        title="Kapasitas"
        :categories="summaryProduksiTeh.categories"
        :series="summaryProduksiTeh.series2"
      ></DashboardChartKapasitasTeh
    ></v-col>
    <v-col cols="12" md="4"
      ><DashboardChartLuasPanenTeh
        title="Luas Panen"
        :categories="summaryProduksiTeh.categories"
        :series="summaryProduksiTeh.series3"
      ></DashboardChartLuasPanenTeh
    ></v-col>
  </v-row>
</template>

<script setup lang="ts">
import dashboardService from "@/services/dashboard.service";
import regionalService from "~/services/regional.service";
import kebunService from "~/services/kebun.service";
import afdelingService from "~/services/afdeling.service";
import card_icon1 from "/images/svgs/icon-user-male.svg";
import card_icon2 from "/images/svgs/icon-briefcase.svg";
import card_icon3 from "/images/svgs/icon-mailbox.svg";
import card_icon4 from "/images/svgs/icon-favorites.svg";
import card_icon5 from "/images/svgs/icon-speech-bubble.svg";
import card_icon6 from "/images/svgs/icon-connect.svg";
import { tanggal } from "@/mixins/tanggal";

const topCardsData = [
  {
    img: card_icon1,
    title: "Employees",
    number: "23979",
    bgcolor: "lightprimary",
    textcolor: "primary",
  },
  {
    img: card_icon2,
    title: "Work",
    number: "1",
    bgcolor: "lightwarning",
    textcolor: "warning",
  },
  {
    img: card_icon3,
    title: "Terlambat",
    number: "0",
    bgcolor: "lightsecondary",
    textcolor: "secondary",
  },
  {
    img: card_icon4,
    title: "Cuti/Ijin",
    number: "0",
    bgcolor: "lighterror",
    textcolor: "error",
  },
];

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);
const disabledReg: any = ref(false);
const disabledKebun: any = ref(false);
const disabledAfdeling: any = ref(false);
const router = useRouter();
const route = useRoute();
const dbPresensi = ref({});
const listRekapPresensi = ref([]);
const dbPrestasiKaret = ref({});
const dbPrestasiTeh = ref({});
const listRegional = ref([]);
const listKebun = ref([]);
const listAfdeling = ref([]);
const filter = ref({
  tanggal: new Date().toISOString().substr(0, 10),
  idRegional: null,
  idKebun: null,
  idAfdeling: null,
  idKomoditas: null,
});
const summaryPresensi: any = ref({
  categories: [],
  series: [],
});

const summaryProduksiKaret: any = ref({
  categories: [],
  series: [],
  series2: [],
});
const summaryProduksiTeh: any = ref({
  categories: [],
  series: [],
  series2: [],
  series3: [],
});

const summaryTapInspeksi: any = ref({
  categories: [],
});

const { checkPermission } = usePermission();
onBeforeMount(async () => {
  checkPermission("DASHBOARD.VIEW");
  await loadAllRegional();
  if (
    dataUser.value.role.id == "HA02" ||
    dataUser.value.role.id == "HA08" ||
    dataUser.value.role.id == "HA04"
  ) {
    //02reg08unit04afd
    filter.value.idRegional = dataUser.value.personData.regionalId;
    disabledReg.value = true;
    loadAllKebun();
    loadAllDashboard;
  }
  if (dataUser.value.role.id == "HA08" || dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    filter.value.idKebun = dataUser.value.personData.kebunId;
    disabledKebun.value = true;
    loadAllAfdeling();
  }
  if (dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    filter.value.idAfdeling = dataUser.value.personData.afdelingId;
    disabledAfdeling.value = true;
    loadAllDashboard;
  }
  await loadAllDashboard();
});

function handleFilterKebun() {
  filter.value.idKebun = null;
  filter.value.idAfdeling = null;
  loadAllKebun();
  loadAllDashboard();
  router.replace({
    path: route.path,
    query: filter.value,
  });
}

function handleFilterAfdeling() {
  filter.value.idAfdeling = null;
  loadAllAfdeling();
  loadAllDashboard();
  router.replace({
    path: route.path,
    query: filter.value,
  });
}

function handleFilter() {
  loadAllDashboard();
  router.replace({
    path: route.path,
    query: filter.value,
  });
}

async function loadAllRegional() {
  await regionalService()
    .retrieveAll({})
    .then((res: any) => {
      listRegional.value = res.data || [];
    });
}

function loadAllKebun() {
  kebunService()
    .retrieveAll({
      regionalId: filter.value.idRegional,
    })
    .then((res: any) => {
      listKebun.value = res.data || [];
      loadAllAfdeling();
    });
}

function loadAllAfdeling() {
  afdelingService()
    .retrieveAll({
      kebunId: filter.value.idKebun,
    })
    .then((res: any) => {
      listAfdeling.value = res.data || [];
      loadAllDashboard();
    });
}

async function loadAllDashboard() {
  await loadDBPresensi();
  await loadDBPrestasiKaret();
  await loadDBPrestasiTeh();
  await loadDBSummaryPresensi();
  await loadDBSummaryProduksiKaret();
  await loadDBSummaryProduksiTeh();
  // await loadDBSummaryTapInspeksi();
}

async function loadDBPrestasiKaret() {
  await dashboardService()
    .retrieveDBPrestasiKomoditas({
      idKomoditas: "2",
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: filter.value.tanggal,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      dbPrestasiKaret.value = res.data || {};
    });
}

async function loadDBPrestasiTeh() {
  await dashboardService()
    .retrieveDBPrestasiKomoditas({
      idKomoditas: "1",
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: filter.value.tanggal,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      dbPrestasiTeh.value = res.data || {};
    });
}

async function loadDBPresensi() {
  await dashboardService()
    .retrieveDBPresensi({
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: filter.value.tanggal,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      dbPresensi.value = res.data || {};
    });
}

async function loadDBSummaryPresensi() {
  let YYYYMM = tanggal.methods.momentDateFormat(
    filter.value.tanggal,
    "YYYY-MM"
  );
  let startDate = YYYYMM + "-01";
  await dashboardService()
    .retrieveDBSummaryPresensi({
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: startDate,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      let db = res.data || [];
      let categories: any = [];
      let series: any = [];
      db.forEach((el: any) => {
        series.push(el.jumlah);
        categories.push(el.tanggal);
      });

      summaryPresensi.value = {
        series: series,
        categories: categories,
      };
    });
}

async function loadDBSummaryProduksiKaret() {
  let YYYYMM = tanggal.methods.momentDateFormat(
    filter.value.tanggal,
    "YYYY-MM"
  );
  let startDate = YYYYMM + "-01";
  await dashboardService()
    .retrieveDBSummaryProduksiKaret({
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: startDate,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      let db = res.data || [];
      let categories: any = [];
      let series: any = [];
      let series2: any = [];
      db.forEach((el: any) => {
        series.push(el.total);
        series2.push(el.kgPertaper);
        categories.push(el.tanggal);
      });

      summaryProduksiKaret.value = {
        categories: categories,
        series: series,
        series2: series2,
      };
    });
}

async function loadDBSummaryProduksiTeh() {
  let YYYYMM = tanggal.methods.momentDateFormat(
    filter.value.tanggal,
    "YYYY-MM"
  );
  let startDate = YYYYMM + "-01";
  await dashboardService()
    .retrieveDBSummaryProduksiTeh({
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: startDate,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      let db = res.data || [];
      let categories: any = [];
      let series: any = [];
      let series2: any = [];
      let series3: any = [];
      db.forEach((el: any) => {
        categories.push(el.tanggal);
        series.push(el.total);
        series2.push(el.kgPerhk);
        series3.push(el.luasPanen);
      });

      summaryProduksiTeh.value = {
        categories: categories,
        series: series,
        series2: series2,
        series3: series3,
      };
    });
}

async function loadDBSummaryTapInspeksi() {
  let YYYYMM = tanggal.methods.momentDateFormat(
    filter.value.tanggal,
    "YYYY-MM"
  );
  let startDate = YYYYMM + "-01";
  await dashboardService()
    .retrieveDBSummaryTapInspeksi({
      idRegional: filter.value.idRegional,
      idKebun: filter.value.idKebun,
      idAfdeling: filter.value.idAfdeling,
      startDate: startDate,
      endDate: filter.value.tanggal,
    })
    .then((res: any) => {
      let db = res.data || [];
      let categories: any = [];
      let series: any = [];
      let series2: any = [];
      let series3: any = [];
      db.forEach((el: any) => {
        categories.push(el.tanggal);
        series.push(el.sumLukaKecil);
        series2.push(el.sumLukaSedang);
        series3.push(el.sumLukaBesar);
      });

      summaryTapInspeksi.value = {
        categories: categories,
        series: series,
        series2: series2,
        series3: series3,
      };
    });
}
</script>
