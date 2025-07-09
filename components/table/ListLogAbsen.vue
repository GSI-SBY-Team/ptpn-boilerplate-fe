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
            item-title="nama"
            :disabled="disableReg"
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
            :disabled="disableKebun"
            item-value="id"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            hide-details="auto"
            @update:modelValue="handleApplyFilterKebun"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="Afdeling"
            v-model="filter.afdelingId"
            :items="listAfdeling"
            item-value="id"
            item-title="nama"
            :disabled="disableAfdeling"
            color="primary"
            variant="outlined"
            density="compact"
            hide-details="auto"
            @update:modelValue="handleApplyFilterAfdeling"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            label="Tanggal Mulai"
            v-model="filter.startDate"
            density="compact"
            placeholder="Tanggal Mulai"
            type="date"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            label="Tanggal Selesai"
            v-model="filter.endDate"
            density="compact"
            placeholder="Tanggal Selesai"
            type="date"
            hide-details="auto"
            @update:modelValue="handleApplyFilter"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="2">
          <v-autocomplete
            label="Job Positions Desc"
            v-model="filter.jobDesc"
            :items="listJobdesc"
            item-value="id"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilter"
            hide-details="auto"
            clearable
          ></v-autocomplete>
        </v-col> -->
        <v-col cols="12" md="2">
          <v-text-field
            v-model="filter.q"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Cari ( Tekan Enter )"
            @keyup.enter="handleApplyFilter"
            @click:append="handleApplyFilter"
            @click:clear="handleClear"
            hide-details
            single-line
          ></v-text-field>
        </v-col>
       
      </v-row>
      <v-row class="mt-1">
        <v-col md="12">
          <v-btn-toggle divided variant="outlined">
            <v-btn @click="handleExport()" :loading="loadingExport">
              <v-icon start color="#40c75f">
                mdi-file-excel
              </v-icon>
              <span class="hidden-sm-and-down">Export</span>
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
        <template v-slot:[`item.tanggals`]="{ item }">
          {{ customBackEndDateFormat(item.tanggal, "DD-MM-YYYY") }}
        </template>
        <template v-slot:[`item.absen_masuk`]="{ item }">
          {{ splitJam(item.absenMasuk) }}
        </template>
        <template v-slot:[`item.absen_pulang`]="{ item }">
          {{ splitJam(item.absenPulang) }}
        </template>
        <template v-slot:[`item.aksi`]="{ item }">
       
          <v-btn
            icon
             v-if="item.absenMasuk || item.absenPulang"
            variant="tonal"
            color="primary"
            size="32"
            class="mr-1"
            @click="handleDetailItem(item)"
          >
            <EyeIcon class="text-primary" size="18" />
            <v-tooltip activator="parent" location="bottom"
              >Foto Log Absen Pegawai</v-tooltip
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
import { tanggal } from "@/mixins/tanggal";
import { useAuthStore } from "@/stores/auth";
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
    itemFilter: {
      type: Array,
      default: () => [],
    },
    labelFilter: {
      type: String,
      default: () => "Filter",
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
    listJobdesc: {
      type: Array,
      default: () => [],
    },
    permission: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingExport: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tanggal],
  data() {
    return {
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
          order: "asc",
        },
      ],
      sortDesc: [true],
      filter: {
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        q: "",
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.defaultSortBy,
        sortType: "asc",
        regionalId: null,
        kebunId: null,
        afdelingId: null,
        jobDesc: null,
      },
      disableReg:false,
      disableKebun:false,
      disableAfdeling:false
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
    
    if (dataUser.role.id=='HA02' || dataUser.role.id=='HA08' || dataUser.role.id=='HA04' ) { //02reg08unit04afd
      this.filter.regionalId = dataUser.personData.regionalId;
      this.disableReg = true;
      this.handleApplyFilterReg();
    }
    if (dataUser.role.id=='HA08' || dataUser.role.id=='HA04' ) { //02reg08unit04afd
      this.filter.kebunId = dataUser.personData.kebunId;
      this.disableKebun = true;
      this.handleApplyFilterKebun();
    }
    if (dataUser.role.id=='HA04' ) { //02reg08unit04afd
      this.filter.afdelingId = dataUser.personData.afdelingId;
      this.disableAfdeling = true;
      this.handleApplyFilterAfdeling();
    }
  },
  methods: {
    splitJam(txt) {
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
    },
    hasPermission(val) {
      const { hasPermission } = usePermission();
      const tag = `${this.permission}.${val}`;
      return hasPermission(tag);
    },

    handleApplyFilter() {
      const filter = Object.assign({}, this.filter);
      this.filter = {
        q: filter.q,
        startDate: filter.startDate,
        endDate: filter.endDate,
        regionalId: filter.regionalId,
        kebunId: filter.kebunId,
        afdelingId: filter.afdelingId,
        jobDesc: filter.jobDesc,
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
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
        startDate: filter.startDate,
        endDate: filter.endDate,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
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
        startDate: filter.startDate,
        endDate: filter.endDate,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
        kebunId: filter.kebunId,
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
        startDate: filter.startDate,
        endDate: filter.endDate,
        sortType: this.sortBy[0].order,
        regionalId: filter.regionalId,
        kebunId: filter.kebunId,
        afdelingId: filter.afdelingId,
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
      });
    },
    handleDetailItem(item) {
      let a = JSON.parse(JSON.stringify(item));
      this.$emit("detailItem", a);
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
