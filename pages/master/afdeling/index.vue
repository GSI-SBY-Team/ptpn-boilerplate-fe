<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListAfdeling
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      :listRegional="listRegional"
      :listKebun="listKebun"
      defaultSortBy="createdAt"
      title="Data Afdeling"
      searchTitle="Cari Afdeling"
      permission="AFDELING"
      @change-reg="loadAllKebun"
      @fetchData="loadAll"
      @addItem="addItem"
      @editItem="editItem"
      @deleteItem="deleteItem"
      @handleExport="handleExport"
    >
    </TableListAfdeling>

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

      <v-label class="mb-2 mt-2 font-weight-medium">Luas Area</v-label>
      <v-text-field
        v-model="editedItem.luasArea"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Luas Area"
        hide-details="auto"
        type="number"
      ></v-text-field>

      <v-label class="mb-2 mt-2 font-weight-medium">Target Luas Pemupukan</v-label>
      <v-text-field
        v-model="editedItem.targetLuasPemupukan"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Target Luas Pemupukan"
        hide-details="auto"
        type="number"
      ></v-text-field>

      <v-label class="mb-2 mt-2 font-weight-medium">Regional</v-label>
      <v-autocomplete
        v-model="editedItem.regionalId"
        :items="listRegional"
        item-value="id"
        :item-title="
         (item:any) =>item.nama"
        @update:modelValue="handleApplyFilterReg()"
        color="primary"
        :disabled="disabledReg"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Pilih Regional"
        hide-details="auto"
      ></v-autocomplete>
      <v-label class="mb-2 mt-2 font-weight-medium">Kebun</v-label>
      <v-autocomplete
        v-model="editedItem.kebunId"
        :items="listKebunForm"
        item-value="id"
        :disabled="disabledKebun"
        :item-title="(item) => item.nama"
        color="primary"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Pilih Kebun"
        hide-details="auto"
      ></v-autocomplete>
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
import regionalService from "~/services/regional.service";
import afdelingService from "@/services/afdeling.service";
import kebunService from "@/services/kebun.service";

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
    text: "Afdeling",
    disabled: true,
    href: "#",
  },
]);
const disabledReg: any = ref(false);
const disabledKebun: any = ref(false);
const route = useRoute();
const isLoadingSave: any = ref(false);
const isLoading: any = ref(false);
const dialog: any = ref(false);
const resetDialog = ref(true);
const dialogTitle = ref("Tambah Afdeling");
const page = ref(1);
const itemPerPage = ref(10);
const listRegional: any = ref([]);
const listKebun: any = ref([]);
const listKebunForm: any = ref([]);
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
  { title: "Kebun", key: "namaKebun" },
  { title: "Luas Area", width: "10%", key: "luasArea" },
  { title: "Target Luas Pemupukan", width: "20%", key: "targetLuasPemupukan" },
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
  checkPermission("AFDELING.VIEW");
});

onMounted(async () => {
  loadAllRegional();
  loadAll();
});

function loadAllRegional() {
  regionalService()
    .retrieveAll({})
    .then((res: any) => {
      listRegional.value = res.data || [];
    });
}

function loadAllKebun(x: any) {
  kebunService()
    .retrieveAll({
      regionalId: x,
    })
    .then((res: any) => {
      listKebun.value = res.data || [];
    });
}

function loadAllKebunForm() {
  kebunService()
    .retrieveAll({
      regionalId: editedItem.value.regionalId
        ? editedItem.value.regionalId
        : null,
    })
    .then((res: any) => {
      listKebunForm.value = res.data || [];
    });
}

function handleApplyFilterReg() {
  loadAllRegional();
  loadAllKebunForm();
}
async function loadAll() {
  var regionalIds = null;
  var kebunIds = null;
  if (
    dataUser.value.role.id == "HA02" ||
    dataUser.value.role.id == "HA08" ||
    dataUser.value.role.id == "HA04"
  ) {
    //02reg08unit04afd
    regionalIds = dataUser.value.personData.regionalId;
  }
  if (dataUser.value.role.id == "HA08" || dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    kebunIds = dataUser.value.personData.kebunId;
  }
  const { pageNumber, pageSize, q, sortBy, sortType, regionalId, idKebun } =
    route.query;
  isLoading.value = true;
  await afdelingService()
    .retrieve({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      regionalId: regionalIds ? regionalIds : regionalId,
      kebunId: kebunIds ? kebunIds : idKebun,
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
  editedItem.value.luasArea = parseFloat(editedItem.value.luasArea);
  editedItem.value.targetLuasPemupukan = parseFloat(editedItem.value.targetLuasPemupukan);
  afdelingService()
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
  editedItem.value = {};
  dialogTitle.value = "Tambah Afdeling";
  editedItem.value = {
    active: true,
  };

  dialog.value = true;
  if (
    dataUser.value.role.id == "HA02" ||
    dataUser.value.role.id == "HA08" ||
    dataUser.value.role.id == "HA04"
  ) {
    //02reg08unit04afd
    editedItem.value.regionalId = dataUser.value.personData.regionalId;
    disabledReg.value = true;
    handleApplyFilterReg();
  }

  if (dataUser.value.role.id == "HA08" || dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    editedItem.value.kebunId = dataUser.value.personData.kebunId;
    disabledKebun.value = true;
  }
}

async function editItem(x: any) {
  resetDialog.value = false;
  await afdelingService()
    .retrieveById(x.id)
    .then((res: any) => {
      if (res.data.id) {
        editedItem.value = res.data;
        dialogTitle.value = "Edit Afdeling";
        dialog.value = true;
        if (
          dataUser.value.role.id == "HA02" ||
          dataUser.value.role.id == "HA08" ||
          dataUser.value.role.id == "HA04"
        ) {
          //02reg08unit04afd
          editedItem.value.regionalId = dataUser.value.personData.regionalId;
          disabledReg.value = true;
          handleApplyFilterReg();
        }

        if (
          dataUser.value.role.id == "HA08" ||
          dataUser.value.role.id == "HA04"
        ) {
          //02reg08unit04afd
          editedItem.value.kebunId = dataUser.value.personData.kebunId;
          disabledKebun.value = true;
        }
        loadAllRegional();
        loadAllKebunForm();
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
      afdelingService()
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
  let filename = `data_afdeling_${date}.xlsx`;
  await afdelingService()
    .exportExcel({
      idRegional: v.regionalId ? String(v.regionalId) : "",
      idKebun: v.kebunId ? String(v.kebunId) : "",
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
