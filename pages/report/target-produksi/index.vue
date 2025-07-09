<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListTargetProduksi
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      :listRegional="listRegional"
      :listKebun="listKebun"
      defaultSortBy="createdAt"
      title="Data Target Produksi"
      searchTitle="Cari . . ."
      permission="TARGET_PRODUKSI"
      @change-reg="loadAllKebun"
      @fetchData="loadAll"
      @handleExport="handleExport"
    >
    </TableListTargetProduksi>
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import reportService from "@/services/report.service";
import regionalService from "~/services/regional.service";
import kebunService from "~/services/kebun.service";
import { exportExcelMandor } from "@/utils/helpers/xlsx";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const pages = ref({ title: "Report" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Laporan",
    disabled: true,
    href: "#",
  },
  {
    text: "Data Report",
    disabled: true,
    href: "#",
  },
]);

const router = useRouter();
const route = useRoute();
const isLoading: any = ref(false);
const page = ref(1);
const itemPerPage = ref(10);
const filter = ref({
  q: "",
  pageNumber: 1,
  pageSize: itemPerPage.value,
  sortBy: "",
  sortType: "",
  kebunId: "", 
  regionalId: "", 
  tanggal: "",
});

var tableData: any = ref({
  items: [],
  meta: {
    totalItems: 0,
  },
});

const headers = ref([
  { title: "No", key: "no", width: "3%", align: "center", sortable: false },
  { title: "Tanggal Mulai", key: "tanggalMulai", width: "8%" },
  { title: "Tanggal Selesai", key: "tanggalSelesai", width: "8%" },
  { title: "Mandor", key: "mandorr", width: "10%" },
  { title: "Afdeling", key: "afdeling", width: "8%" },
  { title: "Kebun", key: "kebun", width: "8%" },
  { title: "Luas (Ha)", key: "luasHa", width: "6%", align: "center" },
  {
    title: "Pohon Seluruh",
    key: "pohonSeluruh",
    width: "8%",
    align: "center",
  },
  {
    title: "Pohon Dideres",
    key: "pohonDideres",
    width: "8%",
    align: "center",
  },
  { title: "RKAP HI", key: "rkapHi", width: "6%", align: "center" },
  { title: "RKAP SD HI", key: "rkapSdHi", width: "7%", align: "center" },
  { title: "RKAP SD BI", key: "rkapSdBi", width: "7%", align: "center" },
  { title: "HI Real", key: "hiReal", width: "6%", align: "center" },
  { title: "SD HI Real", key: "sdHiReal", width: "7%", align: "center" },
  { title: "SD BI Real", key: "sdBiReal", width: "7%", align: "center" },
  { title: "% HI", key: "presentaseHi", width: "5%", align: "center" },
  { title: "% SD HI", key: "presentaseSdHi", width: "6%", align: "center" },
  { title: "% SD BI", key: "presentaseSdBi", width: "6%", align: "center" },
]);

const listRegional: any = ref([]);
const listKebun: any = ref([]);

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);

onMounted(() => {
  loadAllRegional();
});

// Watch untuk perubahan route query - ini akan handle semua perubahan filter
watch(
  () => route.query,
  (newQuery) => {
    loadAll();
  },
  { immediate: true }
);

function loadAllRegional() {
  regionalService()
    .retrieveAll({})
    .then((res: any) => {
      listRegional.value = res.data || [];
    });
}

function loadAllKebun(regionalId: any) {
  if (!regionalId) {
    listKebun.value = [];
    return;
  }

  kebunService()
    .retrieveAll({
      regionalId: regionalId,
    })
    .then((res: any) => {
      listKebun.value = res.data || [];
    })
    .catch((error) => {
      console.error("Error loading kebun:", error);
      listKebun.value = [];
    });
}

async function loadAll() {
  try {
    var regionalIds = null;
    var kebunId = null;
    var afdelingIds = null;

    // Set filter berdasarkan role user
    if (
      dataUser.value.role.id == "HA02" ||
      dataUser.value.role.id == "HA08" ||
      dataUser.value.role.id == "HA04"
    ) {
      regionalIds = dataUser.value.personData.regionalId;
    }

    if (dataUser.value.role.id == "HA08" || dataUser.value.role.id == "HA04") {
      kebunId = dataUser.value.personData.kebunId;
    }

    if (dataUser.value.role.id == "HA04") {
      afdelingIds = dataUser.value.personData.afdelingId;
    }

    const defaultDate = new Date().toISOString().substr(0, 10);
    const query = route.query;

    // Ambil parameter langsung dari route query
    const requestParams = {
      q: query.q || "",
      pageSize: parseInt(query.pageSize as string) || itemPerPage.value,
      pageNumber: parseInt(query.pageNumber as string) || 1,
      sortBy: query.sortBy || "",
      sortType: query.sortType || "",
      idKebun: query.kebunId || kebunId,
      tanggal: query.tanggal || defaultDate,
    };
    isLoading.value = true;

    const response = await reportService().retrieveTgtProduksi(requestParams);

    tableData.value = {
      items: response.data?.items || [],
      meta: response.data?.meta || { totalItems: 0 },
    };
  } catch (error) {
    console.error("Error loading data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Gagal memuat data. Silakan coba lagi.",
    });

    tableData.value = {
      items: [],
      meta: { totalItems: 0 },
    };
  } finally {
    isLoading.value = false;
  }
}

async function handleExport() {
  // Generate list tanggal untuk dropdown (30 hari ke belakang dari hari ini)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateValue = date.toISOString().substr(0, 10); // yyyy-mm-dd format
      const dateDisplay = date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      options.push({
        value: dateValue,
        text: dateDisplay,
      });
    }

    return options;
  };

  const dateOptions = generateDateOptions();
  const defaultDate = filter.value.tanggal || dateOptions[0].value;

  // Buat HTML untuk dropdown
  const selectOptions = dateOptions
    .map(
      (option) =>
        `<option value="${option.value}" ${
          option.value === defaultDate ? "selected" : ""
        }>${option.text}</option>`
    )
    .join("");

  const { value: selectedDate } = await Swal.fire({
    title: "Pilih Tanggal Export",
    html: `
      <div style="text-align: left; margin: 20px 0;">
        <label for="tanggal-select" style="display: block; margin-bottom: 8px; font-weight: bold;">TANGGAL:</label>
        <select id="tanggal-select" class="swal2-input" style="width: 100%; padding: 10px; border: 2px solid #3085d6; border-radius: 4px;">
          ${selectOptions}
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Export Excel",
    cancelButtonText: "Batal",
    preConfirm: () => {
      const selectedValue = (
        document.getElementById("tanggal-select") as HTMLSelectElement
      ).value;
      if (!selectedValue) {
        Swal.showValidationMessage("Pilih tanggal terlebih dahulu");
        return false;
      }
      return selectedValue;
    },
  });

  // Jika user membatalkan atau tidak memilih tanggal
  if (!selectedDate) {
    return;
  }

  // Proses export dengan tanggal yang dipilih
  const date = new Date().toISOString().substr(0, 10);
  const filename = `evaluasi_produksi_karet_${selectedDate.replace(
    /-/g,
    ""
  )}.xlsx`;

  const formattedDate = new Date(selectedDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const firstItem = tableData.value.items[0];
  const unitKebun = firstItem?.kebun || "-";

  const titleRows = [
    ["PT PERKEBUNAN NUSANTARA I"],
    ["EVALUASI PRODUKSI KARET"],
    [`UNIT ${unitKebun}`],
    [`TANGGAL: ${formattedDate}`],
    [""],
  ];

  const header = [
    "Afd",
    "Mandor",
    "Luas (Ha)",
    "Jumlah Pohon Seluruh",
    "Jumlah Pohon Dideres",
    "RKAP Hi",
    "RKAP Sd Hi",
    "RKAP Sd Bi",
    "HK Realisasi Hi",
    "HK Realisasi Sd Hi",
    "HK Realisasi Sd Bi",
    "Persentase Hi (%)",
    "Persentase Sd Hi (%)",
    "Persentase Sd Bi (%)",
  ];

  const body = tableData.value.items.map((item: any) => [
    item.afdeling,
    item.mandor,
    item.luasHa,
    item.pohonSeluruh,
    item.pohonDideres,
    item.rkapHi,
    item.rkapSdHi,
    item.rkapSdBi,
    item.hiReal,
    item.sdHiReal,
    item.sdBiReal,
    item.presentaseHi,
    item.presentaseSdHi,
    item.presentaseSdBi,
  ]);

  // Show loading
  Swal.fire({
    title: "Exporting...",
    text: "Sedang memproses export Excel",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    // Panggil fungsi export dengan title rows
    await exportExcelMandor(header, body, filename, titleRows, unitKebun);

    Swal.fire({
      icon: "success",
      title: "Export Berhasil",
      text: `File ${filename} berhasil didownload`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Export Gagal",
      text: "Terjadi kesalahan saat export Excel",
    });
  }
}
</script>
