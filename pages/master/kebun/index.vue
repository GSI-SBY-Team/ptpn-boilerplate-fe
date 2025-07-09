<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListKebun
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      :listRegional="listRegional"
      defaultSortBy="createdAt"
      title="Data Kebun"
      searchTitle="Cari Kebun"
      permission="KEBUN"
      @fetchData="loadAll"
      @addItem="addItem"
      @editItem="editItem"
      @deleteItem="deleteItem"
      @handleExport="handleExport"
    >
    </TableListKebun>

    <DialogForm
      :show="dialog"
      :persistent="true"
      :reset="resetDialog"
      :formTitle="dialogTitle"
      :isLoading="isLoadingSave"
      @handleSave="handleSave"
      @handleClose="handleClose"
    >
      <v-label class="mb-2 mt-2 font-weight-medium">Kode</v-label>
      <v-text-field
        v-model="editedItem.kode"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Kode"
        hide-details="auto"
      ></v-text-field>

      <v-label class="mb-2 mt-2 font-weight-medium">Nama</v-label>
      <v-text-field
        v-model="editedItem.nama"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Nama"
        hide-details="auto"
      ></v-text-field>

      <v-label class="mb-2 mt-2 font-weight-medium">Regional</v-label>
      <v-autocomplete
        v-model="editedItem.regionalId"
        :items="listRegional"
        item-value="id"
        item-title="nama"
        color="primary"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Pilih Regional"
        hide-details="auto"
      ></v-autocomplete>

      <v-label class="mb-2 mt-2 font-weight-medium">Metode Angkutan</v-label>
      <v-autocomplete
        v-model="editedItem.metodeAngkutanId"
        :items="listMetodeAngkutan"
        item-value="id"
        item-title="nama"
        color="primary"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Pilih Metode Angkutan"
        hide-details="auto"
      ></v-autocomplete>

      <v-label class="mb-2 mt-2 font-weight-medium">Alamat</v-label>
      <v-textarea
        v-model="editedItem.alamat"
        density="compact"
        placeholder="Alamat"
        rows="2"
        hide-details="auto"
      ></v-textarea>

      <div class="d-flex">
        <v-label class="mt-3 font-weight-medium">Status :</v-label>
        <v-checkbox
          class="mt-3"
          v-model="editedItem.active"
          label="Aktif"
          density="compact"
          color="primary"
          hide-details="auto"
        ></v-checkbox>
      </div>
    </DialogForm>
  </div>
</template>
<script setup lang="ts">
import Swal from "sweetalert2";
import kebunService from "@/services/kebun.service";
import regionalService from "~/services/regional.service";
import metodeAngkutanService from "@/services/metode_angkutan.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const pages = ref({ title: "Regional" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Master",
    disabled: true,
    href: "#",
  },
  {
    text: "Kebun",
    disabled: true,
    href: "#",
  },
]);

const route = useRoute();
const isLoadingSave: any = ref(false);
const isLoading: any = ref(false);
const dialog: any = ref(false);
const resetDialog = ref(true);
const dialogTitle = ref("Tambah Kebun");
const page = ref(1);
const itemPerPage = ref(10);
const listRegional: any = ref([]);
const listMetodeAngkutan: any = ref([]);
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
  { title: "Kode", key: "kode" },
  { title: "Nama", key: "nama" },
  { title: "Alamat", key: "alamat" },
  { title: "Regional", key: "namaRegional" },
  { title: "Metode Angkutan", key: "namaMetode" },
  {
    title: "Aksi",
    key: "actions",
    align: "center",
    width: "10%",
    sortable: false,
  },
]);
const editedItem: any = ref({});

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);

const { checkPermission } = usePermission();
onBeforeMount(() => {
  checkPermission("KEBUN.VIEW");
});

onMounted(async () => {
  loadAllRegional();
  loadAllMetodeAngkutan();
  loadAll();
});

function loadAllRegional() {
  regionalService()
    .retrieveAll({})
    .then((res: any) => {
      listRegional.value = res.data || [];
    });
}

function loadAllMetodeAngkutan() {
  metodeAngkutanService()
    .retrieveAll({})
    .then((res: any) => {
      listMetodeAngkutan.value = res.data || [];
    });
}

async function loadAll() {
  const { pageNumber, pageSize, q, sortBy, sortType, regionalId } = route.query;
  isLoading.value = true;
  await kebunService()
    .retrieve({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      regionalId: dataUser.value.personData.regionalId
        ? dataUser.value.personData.regionalId
        : regionalId,
    })
    .then((res: any) => {
      isLoading.value = false;
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

function handleSave() {
  isLoadingSave.value = true;
  kebunService()
    .save(editedItem.value)
    .then((res: any) => {
      handleClose();
      useToast("success", "Data Berhasil Disimpan");
      loadAll();
    })
    .catch((err: any) => {
      isLoadingSave.value = false;
    });
}

function addItem() {
  resetDialog.value = false;
  dialogTitle.value = "Tambah Kebun";
  editedItem.value = {
    active: true,
  };
  dialog.value = true;
}

async function editItem(x: any) {
  resetDialog.value = false;
  await kebunService()
    .retrieveById(x.id)
    .then((res: any) => {
      if (res.data.id) {
        editedItem.value = res.data;
        dialogTitle.value = "Edit Kebun";
        dialog.value = true;
      }
    });
}

async function deleteItem(x: any) {
  Swal.fire({
    title: "Hapus Data",
    text: "Apakah Anda yakin menghapus data [" + x.nama + "] !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
  }).then((result: any) => {
    if (result.isConfirmed) {
      kebunService()
        .destroy(x.id)
        .then((response) => {
          if (response.data) {
            useToast("success", "Data Berhasil Dihapus");
            loadAll();
          }
        });
    }
  });
}

function handleClose() {
  isLoadingSave.value = false;
  resetDialog.value = true;
  editedItem.value = {};
  dialog.value = false;
}

async function handleExport(v: any) {
  const date = new Date().toISOString().substr(0, 10);
  let filename = `data_kebun_${date}.xlsx`;
  await kebunService()
    .exportExcel({
      idRegional: v.regionalId ? String(v.regionalId) : "",
    })
    .then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    });
}
</script>
