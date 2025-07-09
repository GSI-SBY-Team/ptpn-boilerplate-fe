<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListUser
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      defaultSortBy="createdAt"
      title="Data User"
      searchTitle="Cari User"
      :listRole="listRole"
      :listRegional="listRegional"
      :listKebun="listKebun"
      :listAfdeling="listAfdeling"
      :listStatus="listStatus"
      permission="USER"
      @fetchData="loadAll"
      @addItem="addItem"
      @editItem="editItem"
      @deleteItem="deleteItem"
      @aktifItem="aktifItem"
      @reset="resetPassword"
      @change-reg="loadAllKebun"
      @change-kebun="loadAllAfdeling"
    >
    </TableListUser>

    <DialogForm
      :show="dialog"
      :persistent="true"
      :reset="resetDialog"
      :formTitle="dialogTitle"
      :isLoading="isLoadingSave"
      @handleSave="handleSave"
      @handleClose="handleClose"
    >
      <v-label class="mb-2 font-weight-medium">Role</v-label>
      <v-autocomplete
        v-model="editedItem.roleId"
        :items="listRole"
        item-value="id"
        item-title="name"
        color="primary"
        variant="outlined"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Role"
        hide-details="auto"
      ></v-autocomplete>

      <v-label class="mb-2 mt-2 font-weight-medium">Nama</v-label>
      <v-text-field
        v-model="editedItem.name"
        append-inner-icon="mdi-account-search"
        density="compact"
        :readonly="editedItem.personId ? true : false"
        :rules="[(v) => !!v || 'Wajib diisi']"
        @click:append-inner="handleLookupPegawai"
        @click:clear="handleClearPegawai()"
        hide-details="auto"
        placeholder="Nama"
        clearable
      >
      </v-text-field>

      <v-label class="mb-2 mt-2 font-weight-medium">Username</v-label>
      <v-text-field
        v-model="editedItem.username"
        density="compact"
        :rules="[(v) => !!v || 'Wajib diisi']"
        placeholder="Username"
        hide-details="auto"
      ></v-text-field>

      <!-- <v-label class="mb-2 mt-2 font-weight-medium">Email</v-label>
      <v-text-field
        v-model="editedItem.email"
        density="compact"
        :rules="emailRules"
        placeholder="Email"
        hide-details="auto"
      ></v-text-field> -->
      <v-label class="mb-2 mt-2 font-weight-medium">Password</v-label>
      <v-text-field
        v-model="editedItem.password"
        density="compact"
        :rules="!editedItem.id ? passwordRules : []"
        placeholder="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        hide-details="auto"
      ></v-text-field>
      <p v-if="editedItem.id" style="font-size: 12px" class="mb-0 mt-2">
        *Kosongkan password, jika tidak ingin merubah password.
      </p>
      <div class="d-flex">
        <v-label class="mt-3 font-weight-medium">Manual Produksi TPH :</v-label>
        <v-checkbox
          class="mt-3"
          v-model="editedItem.manualProduksiTph"
          label=""
          density="compact"
          color="primary"
          hide-details="auto"
        ></v-checkbox>
      </div>
      <div class="d-flex">
        <v-label class="mt-3 font-weight-medium"
          >Manual Produksi Pabrik :</v-label
        >
        <v-checkbox
          class="mt-3"
          v-model="editedItem.manualProduksiPabrik"
          label=""
          density="compact"
          color="primary"
          hide-details="auto"
        ></v-checkbox>
      </div>
      <div class="d-flex">
        <v-label class="mt-3 font-weight-medium">Toleh Kanan :</v-label>
        <v-checkbox
          class="mt-3"
          v-model="editedItem.tolehKanan"
          label=""
          density="compact"
          color="primary"
          hide-details="auto"
        ></v-checkbox>
      </div>
      <div class="d-flex">
        <v-label class="mt-3 font-weight-medium">Toleh Kiri :</v-label>
        <v-checkbox
          class="mt-3"
          v-model="editedItem.tolehKiri"
          label=""
          density="compact"
          color="primary"
          hide-details="auto"
        ></v-checkbox>
      </div>
      <div class="d-flex">
        <v-label class="mt-3 font-weight-medium">Trigger :</v-label>
        <v-checkbox
          class="mt-3"
          v-model="editedItem.trigger"
          label=""
          density="compact"
          color="primary"
          hide-details="auto"
        ></v-checkbox>
      </div>
      <v-label class="mb-2 mt-2 font-weight-medium">TraceHold</v-label>
      <v-text-field
        v-model="editedItem.tracehold"
        density="compact"
        placeholder="TraceHold"
        hide-details="auto"
        type="number"
      ></v-text-field>
      <v-label class="mb-2 font-weight-medium">Pabrik</v-label>
      <v-autocomplete
        v-model="editedItem.pabrikId"
        :items="listPabrik"
        item-value="id"
        item-title="nama"
        color="primary"
        variant="outlined"
        density="compact"
        placeholder="Pabrik"
        hide-details="auto"
      ></v-autocomplete>
      <v-row class="mt-1">
        <v-col cols="12">
          <p class="mt-3 font-weight-medium">
            Multi Komoditas :
            <v-btn color="primary" flat @click="addKomoditas()" dark>
              <v-icon left dark> mdi-plus-circle-outline</v-icon>Tambah
            </v-btn>
          </p>
          <br />
          <v-card class="border" elevation="0">
            <v-table class="month-table">
              <thead>
                <tr>
                  <th class="text-left">Kode</th>
                  <th class="text-left">Nama</th>
                  <th class="text-center" style="width: 10%">Aksi</th>
                </tr>
              </thead>
              <tbody v-if="listUserKomoditas.length > 0">
                <tr v-for="(x, i) in listUserKomoditas" :key="i">
                  <td>{{ x.kode }}</td>
                  <td>{{ x.nama }}</td>
                  <td class="text-center">
                    <v-btn
                      icon
                      variant="tonal"
                      color="warning"
                      size="32"
                      class="mr-1"
                      @click="removeKomoditas(i)"
                    >
                      <TrashIcon class="text-error" size="18" />
                      <v-tooltip activator="parent" location="bottom"
                        >Hapus</v-tooltip
                      >
                    </v-btn>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="3" class="text-center grey--text">
                    Data kosong
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </DialogForm>

    <!-- Lookup Pegawai -->
    <!-- <LookupPegawai
      ref="lookupPegawai"
      :persistent="true"
      @selected="selectedItem"
    ></LookupPegawai> -->
    <!-- Lookup Komoditas -->
    <!-- <LookupKomoditas
      ref="lookupKomoditas"
      :persistent="true"
      @selectedKomoditas="selectedKomoditas"
    ></LookupKomoditas> -->
  </div>
</template>
<script setup lang="ts">
import Swal from "sweetalert2";
import userService from "@/services/user.service";
import roleService from "@/services/role.service";
// import komoditasService from "@/services/komoditas.service";
// import pabrikService from "@/services/pabrik.service";
import regionalService from "~/services/regional.service";
import kebunService from "~/services/kebun.service";
import afdelingService from "~/services/afdeling.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const pages = ref({ title: "User" });
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
    text: "User",
    disabled: true,
    href: "#",
  },
]);

const passwordRules = ref([
  (v: any) => !!v || "Wajib diisi",
  (v: string | any[]) => (v && v.length >= 8) || "Password minimal 8 karakter",
]);

const emailRules = ref([
  (v: any) => !!v || "Wajib diisi",
  (v: string) => /.+@.+\..+/.test(v) || "Email tidak valid",
]);
const route = useRoute();
const isLoading: any = ref(false);
const isLoadingSave: any = ref(false);
const dialog: any = ref(false);
const resetDialog = ref(true);
const showPassword = ref(false);
const dialogTitle = ref("Tambah User");
const page = ref(1);
const itemPerPage = ref(10);
const listRole = ref([]);
const listKomoditas = ref([]);
const listUserKomoditas: any = ref([]);
const listPabrik: any = ref([]);
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
  { title: "NIk", key: "nik" },
  { title: "Nama", key: "name" },
  { title: "Kebun", key: "namaKebun" },
  { title: "Afdeling", key: "namaAfdeling" },
  { title: "Job Desc", key: "positionsDesc" },
  { title: "Role", key: "role" },
  { title: "Status", key: "aktif", align: "center", sortable: false },
  {
    title: "Aksi",
    key: "actions",
    align: "center",
    width: "10%",
    sortable: false,
  },
]);
const editedItem: any = ref({});
const lookupPegawai: any = ref(null);
const lookupKomoditas: any = ref(null);
const { checkPermission } = usePermission();
const listRegional: any = ref([]);
const listKebun: any = ref([]);
const listAfdeling: any = ref([]);
const listStatus: any = ref([
  { id: "false", nama: "Aktif" },
  { id: "true", nama: "Nonaktif" },
]);

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);

onBeforeMount(() => {
  checkPermission("USER.VIEW");
});

onMounted(async () => {
  loadAll();
  loadAllRole();
  // loadAllKomoditas();
  // loadAllPabrik();
  loadAllRegional();
});

function loadAllRole() {
  roleService()
    .retrieveAll({})
    .then((res: any) => {
      listRole.value = res.data || [];
    });
}

// function loadAllKomoditas() {
//   komoditasService()
//     .retrieveAll({})
//     .then((res: any) => {
//       listKomoditas.value = res.data || [];
//     });
// }

// function loadAllPabrik() {
//   pabrikService()
//     .retrieveAll({})
//     .then((res: any) => {
//       listPabrik.value = res.data || [];
//     });
// }

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

function loadAllAfdeling(x: any) {
  afdelingService()
    .retrieveAll({
      kebunId: x,
    })
    .then((res: any) => {
      listAfdeling.value = res.data || [];
    });
}

async function loadAll() {
  var regionalIds = null;
  var kebunIds = null;
  var afdelingIds = null;
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
  if (dataUser.value.role.id == "HA04") {
    //02reg08unit04afd
    afdelingIds = dataUser.value.personData.afdelingId;
  }
  const {
    pageNumber,
    pageSize,
    q,
    sortBy,
    sortType,
    idRole,
    regionalId,
    kebunId,
    afdelingId,
    status,
  } = route.query;
  isLoading.value = true;
  await userService()
    .retrieve({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      roleId: idRole,
      regionalId: regionalIds ? regionalIds : regionalId,
      kebunId: kebunIds ? kebunIds : kebunId,
      afdelingId: afdelingIds ? afdelingIds : afdelingId,
      status: status,
    })
    .then((res: any) => {
      isLoading.value = false;
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

function handleLookupPegawai(val: any) {
  lookupPegawai.value.loadData();
}

function addKomoditas() {
  lookupKomoditas.value.loadData();
}

function selectedItem(v: any) {
  editedItem.value.personId = v.id;
  editedItem.value.name = v.nama;
  editedItem.value.username = v.nik;
  editedItem.value.employee = v.nik + " - " + v.nama;
}

function handleClearPegawai() {
  editedItem.value.personId = null;
  editedItem.value.name = null;
  editedItem.value.username = null;
}

function handleSave() {
  editedItem.value.status = "1";
  isLoadingSave.value = true;
  editedItem.value.commodities = listUserKomoditas.value;
  editedItem.value.tracehold = parseFloat(editedItem.value.tracehold);
  userService()
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
  editedItem.value = {
    manualProduksiTph: false,
    manualProduksiPabrik: false,
  };
  dialogTitle.value = "Tambah User";
  dialog.value = true;
}

async function editItem(x: any) {
  resetDialog.value = false;
  await userService()
    .retrieveById(x.id)
    .then((res: any) => {
      if (res.data.id) {
        editedItem.value = res.data;
        dialogTitle.value = "Edit User";
        editedItem.value.password = null;
        listUserKomoditas.value = res.data.commodities || [];
        dialog.value = true;
      }
    });
}

async function deleteItem(x: any) {
  Swal.fire({
    title: "Hapus Data",
    text: "Apakah Anda yakin menghapus data [" + x.name + "] !",
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
      userService()
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

async function aktifItem(x: any) {
  console.log(x);
  Swal.fire({
    title: "Aktif Data",
    text: "Apakah Anda yakin mengaktifkan data [" + x.name + "] !",
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
      userService()
        .aktif(x.id)
        .then((response) => {
          if (response.data) {
            useToast("success", "Data Berhasil Diaktifkan");
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
  listUserKomoditas.value = [];
  dialog.value = false;
}

function resetPassword(item: any): void {
  const reset = {
    id: item.id,
    newPassword: "Nusantara@1",
    oldPassword: "Nusantara@1",
  };
  userService()
    .resetPassword(reset)
    .then((res: any) => {
      useToast("success", "[" + item.username + "] berhasil di reset");
    })
    .catch((err: any) => {
      console.log(err);
    });
}
function selectedKomoditas(val: any) {
  var found = listUserKomoditas.value.filter(function (el: any) {
    return el.comodityId == val.id;
  });

  if (found.length > 0) {
    useToast("warning", "Komoditas " + val.nama + " sudah terdaftar");
    return;
  }

  listUserKomoditas.value.push({
    id: null,
    comodityId: val.id,
    nama: val.nama,
    kode: val.kode,
  });
}

function removeKomoditas(i: number) {
  listUserKomoditas.value.splice(i, 1);
}
</script>
