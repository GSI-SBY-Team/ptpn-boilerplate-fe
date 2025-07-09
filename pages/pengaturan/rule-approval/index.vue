<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListRuleApproval
      :headers="headers"
      :tableData="tableData"
      :listProduk="listProduk"
      :loading="isLoading"
      defaultSortBy="createdAt"
      title="Data Rule Approval"
      searchTitle="Cari Rule Approval"
      permission="RULE_APPROVAL"
      @fetchData="loadAll"
      @addItem="addItem"
      @editItem="editItem"
      @deleteItem="deleteItem"
    >
    </TableListRuleApproval>

    <DialogForm
      :show="dialog"
      :persistent="true"
      :reset="resetDialog"
      :formTitle="dialogTitle"
      :isLoading="isLoadingSave"
      @handleSave="handleSave"
      @handleClose="handleClose"
    >
      <v-label class="mb-2 mt-2 font-weight-medium">Produk</v-label>
      <v-autocomplete
        v-model="editedItem.produkId"
        :items="listProduk"
        item-value="id"
        item-title="nama"
        color="primary"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Pilih Produk"
        hide-details="auto"
      ></v-autocomplete>

      <v-label class="mb-2 mt-2 font-weight-medium">Role</v-label>
      <v-autocomplete
        v-model="editedItem.userRoleId"
        :items="listRole"
        item-value="id"
        item-title="name"
        color="primary"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Pilih Kategori"
        hide-details="auto"
      ></v-autocomplete>

      <v-label class="mb-2 mt-2 font-weight-medium">Nama Proses</v-label>
      <v-text-field
        v-model="editedItem.namaProses"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Nama"
        hide-details="auto"
      ></v-text-field>
      <v-label class="mb-2 mt-2 font-weight-medium">Urutan</v-label>
      <v-text-field
        v-model="editedItem.seq"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Urutan"
        type="number"
        hide-details="auto"
      ></v-text-field>
    </DialogForm>
  </div>
</template>
<script setup lang="ts">
import Swal from "sweetalert2";
import ruleApprovalService from "@/services/rule-approval.service";
import produkService from "@/services/produk.service";
import roleService from "@/services/role.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const pages = ref({ title: "Rule Approval" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Pengaturan",
    disabled: true,
    href: "#",
  },
  {
    text: "Rule Approval",
    disabled: true,
    href: "#",
  },
]);

const route = useRoute();
const isLoadingSave: any = ref(false);
const isLoading: any = ref(false);
const dialog: any = ref(false);
const resetDialog = ref(true);
const dialogTitle = ref("Tambah Rule Approval");
const page = ref(1);
const itemPerPage = ref(10);
const listRole: any = ref([]);
const listProduk: any = ref([]);
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
  { title: "Nama Proses", key: "namaProses" },
  { title: "Produk", key: "namaProduk" },
  { title: "Role", key: "namaRole" },
  { title: "Urutan", key: "seq" },
  {
    title: "Aksi",
    key: "actions",
    align: "center",
    width: "10%",
    sortable: false,
  },
]);
const editedItem: any = ref({});

const { checkPermission } = usePermission();
onBeforeMount(() => {
  checkPermission("RULE_APPROVAL.VIEW");
});

onMounted(async () => {
  loadAll();
  loadAllProduk();
  loadAllRole();
});

function loadAllProduk() {
  produkService()
    .retrieveAll({})
    .then((res: any) => {
      listProduk.value = res.data || [];
    });
}

function loadAllRole() {
  roleService()
    .retrieveAll({})
    .then((res: any) => {
      listRole.value = res.data || [];
    });
}


async function loadAll() {
  const { pageNumber, pageSize, q, sortBy, sortType, produkId } = route.query;
  isLoading.value = true;
  await ruleApprovalService()
    .retrieve({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy ,
      sortType: sortType ,
      produkId: produkId ,
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
  editedItem.value.seq = parseInt(editedItem.value.seq);
  ruleApprovalService()
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
  dialogTitle.value = "Tambah Rule Approval";
  dialog.value = true;
}

async function editItem(x: any) {
  resetDialog.value = false;
  await ruleApprovalService()
    .retrieveById(x.id)
    .then((res: any) => {
      if (res.data.id) {
        editedItem.value = res.data;
        dialogTitle.value = "Edit Rule Approval";
        dialog.value = true;
      }
    });
}

async function deleteItem(x: any) {
  Swal.fire({
    title: "Hapus Data",
    text: "Apakah Anda yakin menghapus data [" + x.namaProses + "] !",
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
      ruleApprovalService()
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
</script>
