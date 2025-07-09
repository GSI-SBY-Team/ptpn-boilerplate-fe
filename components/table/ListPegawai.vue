<template>
  <v-card>
    <div class="d-sm-flex align-center justify-space-between bg-primary">
      <v-card-title>{{ title }}</v-card-title>
      <v-btn variant="text" icon @click="handleRefreshItems">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="Regional"
            v-model="filter.regionalId"
            :items="listRegional"
            item-value="id"
            :disabled="disableReg"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilterReg"
            hide-details="auto"
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            label="Kebun"
            v-model="filter.kebunId"
            :items="listKebun"
            item-value="id"
            item-title="nama"
            :disabled="disableKebun"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilterKebun"
            hide-details="auto"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="Afdeling"
            v-model="filter.afdelingId"
            :items="listAfdeling"
            :disabled="disableAfdeling"
            item-value="id"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilterAfdeling"
            hide-details="auto"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="Status"
            v-model="filter.status"
            :items="listStatus"
            item-value="id"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilter"
            hide-details="auto"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filter.q"
            density="compact"
            label="Cari ( Tekan Enter )"
            @keyup.enter="handleApplyFilter"
            @click:clear="handleClear"
            hide-details
            single-line
            clearable
          >
            <template v-slot:append-inner>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    icon="mdi-magnify"
                    @click="handleApplyFilter"
                  ></v-icon>
                </template>
                Cari
              </v-tooltip>
            </template>

            <template v-slot:append>
              <v-btn
                v-if="hasPermission('CREATE')"
                color="primary"
                icon
                @click="handleAddItem"
                size="32"
                variant="tonal"
              >
                <v-icon left dark> mdi-plus-circle-outline</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >Tambah</v-tooltip
                >
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <!-- <v-row class="d-flex justify-start gap-2">
        <v-col cols="auto">
          <v-btn
            color="#40c75f"
            style="color: white"
            variant="flat"
            @click.prevent="download"
          >
            <v-icon>mdi-file-download</v-icon> Download Template
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="#40c75f"
            style="color: white"
            variant="flat"
            @click.prevent="importPerson"
          >
            <v-icon>mdi-file-excel</v-icon> Import Excel
          </v-btn>
        </v-col>

        <v-col
          cols="auto"
          v-if="userDataRole == 'HA01' || userDataRole == 'HA07'"
        >
          <v-btn
            color="#3685d9"
            style="color: white"
            variant="flat"
            @click.prevent="getCds"
          >
            <v-icon>mdi-sync</v-icon> Sync CDS
          </v-btn>
        </v-col>

        <v-col
          cols="auto"
          v-if="userDataRole == 'HA01' || userDataRole == 'HA07'"
        >
          <v-btn
            color="#3685d9"
            style="color: white"
            variant="flat"
            @click.prevent="insertData"
          >
            <v-icon>mdi-cloud-sync</v-icon> Sync Data
          </v-btn>
        </v-col>
      </v-row> -->

      <v-row class="mt-1">
        <v-col md="12">
          <v-btn-toggle divided variant="outlined">
            <v-btn @click.prevent="importPerson">
              <v-icon start color="#40c75f"> mdi-file-excel </v-icon>
              <span class="hidden-sm-and-down">Import</span>
            </v-btn>
            <v-btn @click.prevent="handleExport">
              <v-icon start color="#40c75f"> mdi-file-excel </v-icon>
              <span class="hidden-sm-and-down">Export</span>
            </v-btn>
            <v-btn
              v-if="userDataRole == 'HA01' || userDataRole == 'HA07'"
              @click.prevent="getCds"
            >
              <v-icon start color="primary"> mdi-sync </v-icon>
              <span class="hidden-sm-and-down">Sync CDS</span>
            </v-btn>
            <v-btn
              v-if="userDataRole == 'HA01' || userDataRole == 'HA07'"
              @click.prevent="insertData"
            >
              <v-icon start color="primary"> mdi-cloud-sync </v-icon>
              <span class="hidden-sm-and-down">Sync Data</span>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <br />
      <v-data-table
        class="datatabels productlist"
        :headers="headers"
        :items="tableData.items"
        :server-items-length="tableData.meta.totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        v-model:sort-by="sortBy"
        item-value="id"
        hide-default-footer
      >
        <template v-slot:[`item.no`]="{ item }">
          {{ numberInc + parseInt(tableData.items.indexOf(item)) + 1 }}.
        </template>
        <template v-slot:[`item.aktif`]="{ item }">
          <p v-if="item.isDeleted == true">
            <v-chip color="error" variant="flat" size="small" class="text-white"
              >NonAktif</v-chip
            >
          </p>
          <p v-if="item.isDeleted == false">
            <v-chip
              color="primary"
              variant="flat"
              size="small"
              class="text-white"
              >Aktif</v-chip
            >
          </p>
        </template>
        <template v-slot:[`item.statusFoto`]="{ item }">
          <span v-if="item.jumlahFoto > 0">
            <v-avatar class="rounded-md bg-lightprimary text-primary" size="28">
              <UiIcon item="UserCheckIcon" size="18" />
            </v-avatar>
          </span>
          <span v-else>
            <v-avatar class="rounded-md bg-lighterror text-error" size="28">
              <UiIcon item="UserXIcon" size="18" />
            </v-avatar>
          </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="hasPermission('UPDATE') && item.isDeleted == false"
            icon
            variant="tonal"
            color="warning"
            size="32"
            class="mr-1"
            @click="handleEditItem(item)"
          >
            <EditIcon class="text-warning" size="18" />
            <v-tooltip activator="parent" location="bottom">Edit</v-tooltip>
          </v-btn>

          <v-btn
            v-if="hasPermission('DELETE') && item.isDeleted == false"
            icon
            variant="tonal"
            color="warning"
            size="32"
            class="mr-1"
            @click="deleteItem(item)"
          >
            <TrashIcon class="text-error" size="18" />
            <v-tooltip activator="parent" location="bottom">Hapus</v-tooltip>
          </v-btn>
          <v-btn
            icon
            v-if="item.isDeleted == false"
            variant="tonal"
            color="primary"
            size="32"
            class="mr-1"
            @click="handleDetailItem(item)"
          >
            <EyeIcon class="text-primary" size="18" />
            <v-tooltip activator="parent" location="bottom"
              >Foto Pegawai</v-tooltip
            >
          </v-btn>

          <v-btn
            v-if="item.isDeleted == true"
            icon
            variant="tonal"
            color="success"
            size="32"
            class="mr-1"
            @click="aktifItem(item)"
          >
            <CheckboxIcon class="text-success" size="18" />
            <v-tooltip activator="parent" location="bottom"
              >Aktifkan Pegawai</v-tooltip
            >
          </v-btn>
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
              :items-per-page="itemsPerPage"
              :total-items="tableData.meta.totalItems"
              @handlePaginate="handlePageChanged"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import { useAuthStore } from "@/stores/auth";
import { CheckIcon } from "vue-tabler-icons";
export default {
  props: {
    title: {
      type: String,
    },
    defaultSortBy: {
      type: String,
    },
    searchTitle: {
      type: String,
    },
    tableData: {
      type: Object,
      default: {
        items: [],
        meta: {
          total: 0,
        },
      },
    },
    headers: {
      type: Array,
      default: [],
    },
    listRegional: {
      type: Array,
      default: () => [],
    },
    listKebun: {
      type: Array,
      default: () => [],
    },
    listAfdeling: {
      type: Array,
      default: () => [],
    },
    listStatus: {
      type: Array,
      default: () => [],
    },
    itemFilter: {
      type: Array,
      default: () => [],
    },
    labelFilter: {
      type: String,
      default: () => "Filter",
    },
    permission: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disableReg: false,
      disableKebun: false,
      disableAfdeling: false,
      itemsPerPage: 10,
      itemsPerPageOptions: [
        { value: 10, title: "10" },
        { value: 20, title: "20" },
        { value: 40, title: "40" },
        { value: 50, title: "50" },
      ],
      sortBy: [
        {
          key: this.defaultSortBy,
          order: "desc",
        },
      ],
      sortDesc: [true],
      filter: {
        q: "",
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.defaultSortBy,
        sortType: "desc",
        regionalId: null,
        kebunId: null,
        afdelingId: null,
        status: null,
      },
      userDataRole: "",
    };
  },
  computed: {
    numberInc() {
      var number = parseInt(this.filter.pageNumber - 1) * this.itemsPerPage;
      return number;
    },
  },
  mounted() {
    const authStore = useAuthStore();
    const dataUser = authStore.dataUser;
    this.userDataRole = dataUser.role.id;

    if (
      dataUser.role.id == "HA02" ||
      dataUser.role.id == "HA08" ||
      dataUser.role.id == "HA04"
    ) {
      //02reg08unit04afd
      this.filter.regionalId = dataUser.personData.regionalId;
      this.disableReg = true;
      this.handleApplyFilterReg();
    }
    if (dataUser.role.id == "HA08" || dataUser.role.id == "HA04") {
      //02reg08unit04afd
      this.filter.kebunId = dataUser.personData.kebunId;
      this.disableKebun = true;
      this.handleApplyFilterKebun();
    }
    if (dataUser.role.id == "HA04") {
      //02reg08unit04afd
      this.filter.afdelingId = dataUser.personData.afdelingId;
      this.disableAfdeling = true;
      this.handleApplyFilterAfdeling();
    }
  },
  methods: {
    hasPermission(val) {
      const { hasPermission } = usePermission();
      const tag = `${this.permission}.${val}`;
      return hasPermission(tag);
    },

    handleApplyFilter() {
      const filter = Object.assign({}, this.filter);
      this.filter = {
        q: filter.q,
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
        kebunId: filter.kebunId,
        afdelingId: filter.afdelingId,
        status: filter.status,
        t: Date.now(),
      };
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },

    handleApplyFilterReg() {
      const filter = Object.assign({}, this.filter);
      this.filter = {
        q: filter.q,
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
        status: filter.status,
        t: Date.now(),
      };
      this.$emit("change-reg", filter.regionalId);
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },

    handleApplyFilterKebun() {
      const filter = Object.assign({}, this.filter);
      this.filter = {
        q: filter.q,
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
        kebunId: filter.kebunId,
        status: filter.status,
        t: Date.now(),
      };
      this.$emit("change-kebun", filter.kebunId);
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },

    handleApplyFilterAfdeling() {
      const filter = Object.assign({}, this.filter);
      this.filter = {
        q: filter.q,
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
        kebunId: filter.kebunId,
        afdelingId: filter.afdelingId,
        status: filter.status,
        t: Date.now(),
      };
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },
    handleRefreshItems() {
      const resetFilter = Object.assign({}, this.filter);
      resetFilter.q = "";
      resetFilter.pageNumber = 1;
      (resetFilter.t = Date.now()), (this.filter = resetFilter);
      this.handleApplyFilter();
    },
    handleExport() {
      this.$emit("handleExport", {
        regionalId: this.filter.regionalId,
        kebunId: this.filter.kebunId,
        afdelingId: this.filter.afdelingId,
        status: this.filter.status,
      });
    },
    handleAddItem() {
      this.$emit("addItem");
    },
    download() {
      this.$emit("download");
    },
    importPerson() {
      this.$emit("importPerson");
    },
    getCds() {
      this.$emit("getCds");
    },
    insertData() {
      this.$emit("insertData");
    },

    handleDetailItem(item) {
      let a = JSON.parse(JSON.stringify(item));
      this.$emit("detailItem", a);
    },

    handleEditItem(item) {
      // copy item to a before edit
      let a = JSON.parse(JSON.stringify(item));
      this.$emit("editItem", a);
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    },
    aktifItem(item) {
      this.$emit("aktifItem", item);
    },
    handlePageChanged(page) {
      this.filter.pageNumber = page;
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query);
      filter.pageNumber = parseInt(filter.pageNumber);
      filter.pageSize = parseInt(
        filter.pageSize ? filter.pageSize : this.itemsPerPage
      );
      filter.t = Date.now();
      return filter;
    },
    async handleClear() {
      await this.handleResetFilter();
      this.filter.t = Date.now();
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },
    handleResetFilter() {
      this.filter = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        q: "",
        sortBy: this.defaultSortBy,
        sortType: "desc",
        t: Date.now(),
      };
    },
    handleSort() {
      if (this.sortBy.length > 0) {
        this.filter.sortBy = this.sortBy[0].key;
        this.filter.sortType = this.sortBy[0].order;
        this.$router.replace({
          path: this.$route.path,
          query: this.filter,
        });
      }
    },
    getItemPerPage(val) {
      this.itemsPerPage = +val;
      this.filter.pageSize = this.itemsPerPage;
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      });
    },
  },
  watch: {
    "$route.query": {
      handler(query) {
        // this.filter = this.updateFilterQuery(query);
        this.$emit("fetchData");
      },
      immediate: true,
    },
    sortBy() {
      this.handleSort();
    },
  },
};
</script>
<style scoped>
.dt-table > td {
  border: 1px solid #d8dbe0 !important;
  border-collapse: collapse;
}

.select {
  width: 60px;
}
</style>
