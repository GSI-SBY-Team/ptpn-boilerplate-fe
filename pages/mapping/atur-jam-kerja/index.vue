<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <v-card>
      <div class="d-sm-flex align-center justify-space-between bg-primary">
        <v-card-title>Atur Jam Kerja</v-card-title>
        <v-btn variant="text" icon @click="">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="2">
            <v-autocomplete
              label="Regional"
              v-model="filter.regionalId"
              :items="listRegional"
              item-value="id"
              item-title="nama"
              color="primary"
              variant="outlined"
              :disabled="disabledReg"
              density="compact"
              hide-details="auto"
              @update:modelValue="handleApplyFilterReg()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              label="Kebun"
              v-model="filter.kebunId"
              :items="listKebun"
              item-value="id"
              item-title="nama"
              color="primary"
              :disabled="disabledKebun"
              variant="outlined"
              density="compact"
              hide-details="auto"
              @update:modelValue="handleApplyFilterKebun()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              label="Afdeling"
              v-model="filter.afdelingId"
              :items="listAfdeling"
              item-value="id"
              item-title="nama"
              color="primary"
              :disabled="disabledAfdeling"
              variant="outlined"
              density="compact"
              hide-details="auto"
              @update:modelValue="handleApplyFilterAfdeling()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="1">
            <div class="pt-1">
            </div>
          </v-col>
          <v-col cols="12" md="5">
             <v-autocomplete
              label="Mandor"
              v-model="editedItem.mandorId"
              :items="listMandor"
              item-value="id"
              :item-title="
                (item:any) =>
                  item.nik +  ' - ' +item.nama
              "
              color="primary"
              variant="outlined"
              density="compact"
              hide-details="auto"
              @update:modelValue="onchageMandor()"
              :clearable="!disabledMandor"
              :readonly="disabledMandor"
              class="mb-3"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <br />

        <v-row>
          <v-col cols="12" md="6">
            <br />
            <v-text-field
              v-model="filter.q"
              outlined
              placeholder="Cari ..."
              dense
              append-icon="mdi-magnify"
              hide-details="auto"
              class="mb-3"
              clearable
              density="compact"
              @keyup.enter="handleApplyFilter()"
              @click:append="handleApplyFilter()"
              @click:clear="handleClearSearch()"
            >
            </v-text-field>
            <p>Selected : {{ selected.length }}</p>
            <div class="box-select">
              <v-data-table
                checkbox-color="primary"
                v-model="selected"
                :headers="headers"
                :items="tableData.items"
                :server-items-length="tableData.meta.totalItems"
                :items-per-page="itemPerPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                hide-default-footer
                item-key="namaAfdeling"
                :single-select="false"
                fixed-header
                height="450"
                show-select
                return-object
                dense
              >
              <template v-slot:[`item.masuk`]="{ item }">
                 <p>{{   splitJam(item.jamMasuk)}}</p>
                </template>
                 <template v-slot:[`item.pulang`]="{ item }">
                 <p>{{   splitJam(item.jamPulang)}}</p>
                </template>
              </v-data-table>
              <!-- Custom Pagination -->
              <v-row class="mt-3">
                <v-col md="6" cols="12">
                  <div class="d-flex" style="font-size: 15px">
                    Tampilkan &nbsp;
                    <div style="width: 80px; margin-top: -8px">
                      <v-select
                        v-model="filter.pageSize"
                        :items="itemsPerPageOptions"
                        item-value="value"
                        item-title="title"
                        color="primary"
                        variant="outlined"
                        density="compact"
                        hide-details="auto"
                        @update:modelValue="getItemPerPage"
                      ></v-select>
                    </div>
                    &nbsp; dari {{ tableData.meta.totalItems }} data
                  </div>
                </v-col>
                <v-col md="6" cols="12">
                  <div style="float: right">
                    <SharedPagination
                      class="mb-2"
                      :items-per-page="itemPerPage"
                      :total-items="tableData.meta.totalItems"
                      @handlePaginate="handlePageChanged"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <div class="box-upload div-flex">
              <div style="flex: 0 0 120px">
                <v-btn class="info" @click="copyItem()">
                  <v-icon>mdi-chevron-double-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="5">
            <br />
            <v-text-field
              v-model="search"
              outlined
              placeholder="Cari ..."
              dense
              append-icon="mdi-magnify"
              hide-details="auto"
              density="compact"
              class="mb-3"
            >
            </v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <p>Total : {{ listJamKerja.length }} Jam Kerja</p>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <v-btn
                  small
                  color="error"
                  @click="deleteItemSelect()"
                  :disabled="selectedLokasi.length == 0"
                >
                  <v-icon small>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >Hapus</v-tooltip
                  >
                </v-btn>
              </v-col>
            </v-row>
            <div class="box-select">
              <v-data-table
                v-model="selectedLokasi"
                :headers="headers"
                :items="listJamKerja"
                :search="search"
                fixed-header
                height="450"
                checkbox-color="primary"
                dense
                item-key="id"
                return-object
                :single-select="false"
                show-select
              >
              <template v-slot:[`item.masuk`]="{ item }">
                 <p>{{   splitJam(item.jamMasuk)}}</p>
                </template>
                 <template v-slot:[`item.pulang`]="{ item }">
                 <p>{{   splitJam(item.jamPulang)}}</p>
                </template>
              </v-data-table>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="pa-2">
          <v-btn depressed color="grey lighten-2"> BATAL </v-btn>
          <v-btn depressed color="info" @click="handleSaveDetail()">
            SIMPAN
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import jamKerjaMandorService from "@/services/atur-jam-kerja.service";
import pegawaiService from "@/services/pegawai.service";
import regionalService from "@/services/regional.service";
import kebunService from "@/services/kebun.service";
import afdelingService from "@/services/afdeling.service";
import jamKerjaService from "@/services/jam_kerja.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
const authStore = useAuthStore();
const dataUser = computed(() =>
  authStore.dataUser
);
const pages = ref({ title: "Jam Kerja Mandor" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Mapping",
    disabled: true,
    href: "#",
  },
  {
    text: "Atur Lokasi",
    disabled: true,
    href: "#",
  },
]);

var router = useRouter();

const isLoading: any = ref(false);
const disabledReg: any = ref(false);
const disabledKebun: any = ref(false);
const disabledAfdeling: any = ref(false);
const disabledMandor: any = ref(false);
const page = ref(1);
const itemPerPage = ref(10);
const listMandor: any = ref([]);
const listRegional: any = ref([]);
const listKebun: any = ref([]);
const listAfdeling: any = ref([]);
const search: any = ref("");
const selected: any = ref([]);
const selectedLokasi: any = ref([]);
const listJamKerja: any = ref([]);

const defaultSortBy: any = ref("kode");
const itemsPerPageOptions:any = [
        { value: 10, title: "10" },
        { value: 20, title: "20" },
        { value: 40, title: "40" },
        { value: 50, title: "50" },
      ]
const sortBy = [defaultSortBy.value];
const sortDesc = [false];
const filter:any = ref({
  q: "",
  page: 1,
  pageSize: itemPerPage.value,
  sortBy: defaultSortBy.value,
  sortType: "asc",
  regionalId: null,
  kebunId: null,
  afdelingId: null,
});
var tableData: any = ref({
  items: [],
  meta: {
    totalItems: 0,
  },
});
const headers = ref([
  { title: "Kode", key: "kode", width: "5%", align: "center"},
  { title: "Nama", key: "nama" },
  { title: "Jam Masuk", key: "masuk" },
  { title: "Jam Pulang", key: "pulang" },
]);

const editedItem: any = ref({});

const { checkPermission } = usePermission();
onBeforeMount(() => {
  checkPermission("ATUR_JADWAL_JAM_KERJA.VIEW");
});

onMounted(async () => {
  loadAll();
  loadAllRegional();
  if (dataUser.value.role.id=='HA02' || dataUser.value.role.id=='HA08' || dataUser.value.role.id=='HA04' ) { //02reg08unit04afd
      filter.value.regionalId = dataUser.value.personData.regionalId;
      disabledReg.value = true;
      handleApplyFilterReg();
    }
  
    if (dataUser.value.role.id=='HA08' || dataUser.value.role.id=='HA04' ) { //02reg08unit04afd
        filter.value.kebunId = dataUser.value.personData.kebunId
        disabledKebun.value = true;
        handleApplyFilterKebun();
   }
    if ( dataUser.value.role.id=='HA04' ) { //02reg08unit04afd
        filter.value.afdelingId = dataUser.value.personData.afdelingId
        disabledAfdeling.value = true;
        handleApplyFilterAfdeling();
    }

    // if(dataUser.value.personId){
    //   loadAllMandor()
    //   editedItem.value.mandorId = dataUser.value.personId
    //   disabledMandor.value = true;
    //   loadAllJamKerjaMandor()
    // }
});

function loadAllMandor() {
  pegawaiService()
    .retrieveAllMandor({
      regionalId: filter.value.regionalId ? filter.value.regionalId : null,
      kebunId: filter.value.kebunId ? filter.value.kebunId : null,
      afdelingId: filter.value.afdelingId ? filter.value.afdelingId : null,
    })
    .then((res: any) => {
      listMandor.value = res.data || [];
    });
}



function onchageMandor() {
  if (editedItem.value.mandorId) {
    loadAllJamKerjaMandor();
  }
}

function loadAllJamKerjaMandor() {
    jamKerjaMandorService()
    .retrieveAll({
      idMandor: editedItem.value.mandorId,
    })
    .then((res: any) => {
    listJamKerja.value = (res.data || []).map((item: any) => ({
        idJamKerjamandor: item.id, 
        id: item.jamKerjaId,
        mandorId: item.mandorId,
        kode: item.kode,
        nama: item.namaJamKerja,
        jamMasuk: item.jamMasuk,
        jamPulang: item.jamPulang,
      }));
    });
}

function loadAllRegional() {
  regionalService()
    .retrieveAll({})
    .then((res: any) => {
      listRegional.value = res.data || [];
    });
}

function loadAllKebun() {
  kebunService()
    .retrieveAll({
      regionalId: filter.value.regionalId
    })
    .then((res: any) => {
      listKebun.value = res.data || [];
    });
}

function loadAllAfdeling() {
  afdelingService()
    .retrieveAll({
      kebunId: filter.value.kebunId
    })
    .then((res: any) => {
      listAfdeling.value = res.data || [];
    });
}

async function loadAll() {
  isLoading.value = true;
  await jamKerjaService()
    .retrieve({
      q:filter.value.q,
      pageSize: filter.value.pageSize ? filter.value.pageSize : itemPerPage.value,
      pageNumber: filter.value.page ? filter.value.page : page.value,
      sortBy: filter.value.sortBy,
      sortType: filter.value.sortType,
      regionalId: filter.value.regionalId ? filter.value.regionalId : null,
      kebunId: filter.value.kebunId ? filter.value.kebunId : null,
      afdelingId: filter.value.afdelingId ? filter.value.afdelingId : null,
    })
    .then((res: any) => {
      isLoading.value = false;
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

function deleteItemSelect() {
  selectedLokasi.value.forEach((el: any) => {
    let index = listJamKerja.value.findIndex((x: any) => x.id === el.id);
    listJamKerja.value.splice(index, 1);
  });
  selectedLokasi.value = [];
}
function copyItem() {
  if (listJamKerja.value.length > 0) {
    selected.value.forEach((el: any) => {
      var found = listJamKerja.value.filter(function (el2: any) {
        return el2.id == el.id;
      });

      if (found.length == 0) {
        listJamKerja.value.push(el);
      }
    });
  } else {
    selected.value.forEach((el: any) => {
      listJamKerja.value.push(el);
    });
  }
  selected.value = [];
}

function handleSaveDetail() {
  let listData: any = [];
  for (var i in listJamKerja.value) {
    listData.push({
        id:
        listJamKerja.value[i]["idJamKerjamandor"] == null
          ? null
          : listJamKerja.value[i]["idJamKerjamandor"],
      mandorId: editedItem.value.mandorId,
      jamKerjaId:listJamKerja.value[i]["id"] == null ? null : listJamKerja.value[i]["id"],
    });
  }
  if (!editedItem.value.mandorId) {
    return useToast("warning", "Mandor Wajib Diisi !");
  }

  // if (listJamKerja.value.length == 0) {
  //   return useToast("warning", "Data Lokasi belum ditambahkan !");
  // }

  editedItem.value.detail = listData;
  jamKerjaMandorService()
    .save(editedItem.value)
    .then((res: any) => {
      useToast("success", "Data Berhasil Disimpan");
      loadAll();
      router.push("/mapping/atur-jam-kerja");
    })
    .catch((err: any) => {});
}

function handlePageChanged(page: number) {
  filter.value.page = page;
  loadAll();
}

function getItemPerPage(val: number) {
    itemPerPage.value = +val;
    filter.value.pageSize = itemPerPage.value;
    loadAll();
  }

  // Paginate
  function handleApplyFilter() {
    const filters = Object.assign({}, filter.value);
    filter.value = {
      q: filter.value.q,
      pageSize: itemPerPage.value,
      page: 1,
      sortBy: sortBy[0],
      sortType: sortDesc[0] == true ? "asc" : "desc",
      t: Date.now(),
      regionalId: filters.regionalId,
      kebunId: filters.kebunId,
      afdelingId: filters.afdelingId,
    };
    loadAll();
  }

  function handleApplyFilterReg() {
    filter.value.kebunId=null
    filter.value.afdelingId=null
    const filters = Object.assign({}, filter.value);
    filter.value = {
      q: filters.q,
      pageSize: itemPerPage.value,
      page: 1,
      sortBy: sortBy[0],
      sortType: sortDesc[0] == true ? "asc" : "desc",
      t: Date.now(),
      regionalId: filters.regionalId,
      kebunId: filters.kebunId,
      afdelingId: filters.afdelingId,
    };
    loadAll();
    loadAllMandor();
    loadAllKebun();
  }

  function handleApplyFilterKebun() {
    filter.value.afdelingId=null
    const filters = Object.assign({}, filter.value);
    filter.value = {
      q: filters.q,
      pageSize: itemPerPage.value,
      page: 1,
      sortBy: sortBy[0],
      sortType: sortDesc[0] == true ? "asc" : "desc",
      t: Date.now(),
      regionalId: filters.regionalId,
      kebunId: filters.kebunId,
      afdelingId: filters.afdelingId,
    };
    loadAll();
    loadAllMandor();
    loadAllAfdeling();
  }
  function handleApplyFilterAfdeling() {
    const filters = Object.assign({}, filter.value);
    filter.value = {
      q: filters.q,
      pageSize: itemPerPage.value,
      page: 1,
      sortBy: sortBy[0],
      sortType: sortDesc[0] == true ? "asc" : "desc",
      t: Date.now(),
      regionalId: filters.regionalId,
      kebunId: filters.kebunId,
      afdelingId: filters.afdelingId,
    };
    loadAll();
    loadAllMandor();
  }

 function handleResetFilter() {
    filter.value.page = 1;
    filter.value.pageSize = itemPerPage.value;
    filter.value.q = "";
    filter.sortBy = sortBy[0];
    filter.sortType = sortDesc[0] == true ? "desc" : "asc";
  }

  async function handleClearSearch() {
    handleResetFilter();
    filter.value.t = Date.now();
    loadAll();
  }

  function splitJam(txt: any) {
  if (!txt) {
    return "";
  }

  // Memeriksa apakah input sesuai dengan format ISO 8601
  const match = txt.match(/T(\d{2}:\d{2}):\d{2}/);
  if (match) {
    return match[1]; // Mengembalikan jam dan menit
  }

  // Jika format input tidak sesuai, kembalikan string kosong
  return "";
}
</script>
<style scoped>
.box-select {
  border: 1px solid rgb(189 189 189);
  height: 515px;
  border-radius: 5px;
}
.box-upload {
  border-radius: 2px;
  box-sizing: border-box;
  color: #2196f3;
  cursor: pointer;
  height: 700px;
  justify-content: center;
}
.div-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
