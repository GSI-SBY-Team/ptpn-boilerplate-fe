<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListKartuStok
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      :listItem="listItem"
      defaultSortBy="createdAt"
      title="Data Kartu Stok"
      searchTitle="Cari Kartu Stok"
      permission="KARTU_STOK"
      @fetchData="loadAll"
      @handleExport="handleExport"
    >
    </TableListKartuStok>
  </div>
</template>
<script setup lang="ts">
import kebunService from "~/services/kebun.service";
import afdelingService from "~/services/afdeling.service";
import { exportExcelWithTitle } from "@/utils/helpers/xlsx";
import reportService from "@/services/report.service";
import itemService from "@/services/item.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const pages = ref({ title: "Kartu Stok" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Report",
    disabled: true,
    href: "#",
  },
  {
    text: "Kartu Stok",
    disabled: true,
    href: "#",
  },
]);
var router = useRouter();
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
});
var tableData: any = ref({
  items: [],
  meta: {
    totalItems: 0,
  },
});
const headers = ref([
  { title: "No", key: "no", width: "5%", align: "center", sortable: false },
  { title: "Tanggal", key: "tanggal" },
  { title: "No Transaksi", key: "noTransaksi" },
  { title: "Jenis Transaksi", key: "typeTransaksi" },
  { title: "Nama Item:", key: "namaItem" },
  { title: "Keterangan", key: "keterangan" },
  { title: "Jumlah", key: "quantity" },
  { title: "Data Masuk", key: "dataMasuk" },
  { title: "Data Keluar", key: "dataKeluar" },
  { title: "Tersisa", key: "tersisa" },
]);
const listItem: any = ref([]);
const listKebun: any = ref([]);
const listAfdeling: any = ref([]);

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);

onMounted(async () => {
  loadAll();
  loadAllItem();
});

function loadAllItem() {
  itemService()
    .retrieveAll({})
    .then((res: any) => {
      listItem.value = res.data || [];
    });
}

async function loadAll() {
  var itemIds = null;
  var kebunIds = null;
  var afdelingIds = null;
  if (
    dataUser.value.role.id == "HA02" ||
    dataUser.value.role.id == "HA08" ||
    dataUser.value.role.id == "HA04"
  ) {
    //02reg08unit04afd
    itemIds = dataUser.value.personData.itemId;
  }
  if (dataUser.value.role.id == "HA08" || dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    kebunIds = dataUser.value.personData.kebunId;
  }
  if (dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    afdelingIds = dataUser.value.personData.afdelingId;
  }
  const tgl = new Date().toLocaleDateString("en-CA");
  const {
    pageNumber,
    pageSize,
    q,
    sortBy,
    sortType,
    itemId,
    tanggalMulai,
    tanggalSelesai,
  } = route.query;
  isLoading.value = true;
  await reportService()
    .retrieveKartuStok({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      itemId: itemIds ? itemIds : itemId,
      tanggalMulai: tanggalMulai ? tanggalMulai : tgl,
      tanggalSelesai: tanggalSelesai ? tanggalSelesai : tgl,
    })
    .then((res: any) => {
      isLoading.value = false;
      console.log(res);
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

function handleExport() {
  const date = new Date().toISOString().substr(0, 10);
  const filename = `data_kartu_stok_${date}.xlsx`;

  const title = "Laporan Data Kartu Stok";

  const header = [
    "No",
    "Nama Item",
    "Jumlah",
    "Jenis Transaksi",
    "No Transaksi",
    "Keterangan",
    "Tanggal",
    "Data Masuk",
    "Data Keluar",
    "Tersisa",
  ];

  const body = tableData.value.items.map((item: any, index: number) => [
    index + 1,
    item.namaItem || "",
    item.quantity || "",
    item.typeTransaksi || "",
    item.noTransaksi || "",
    item.keterangan || "",
    item.tanggal || "",
    item.dataMasuk || 0,
    item.dataKeluar || 0,
    item.tersisa || "",
  ]);

  exportExcelWithTitle(title, header, body, filename);
}
</script>
