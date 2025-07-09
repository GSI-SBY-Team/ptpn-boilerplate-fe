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
          <v-text-field
            label="Tanggal"
            v-model="filter.tanggal"
            density="compact"
            placeholder="Tanggal"
            type="date"
            @update:modelValue="handleApplyFilter"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2"
          ><v-autocomplete
            label="Pabrik"
            v-model="filter.pabrikId"
            :items="listPabrik2"
            item-value="id"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilter"
            clearable
          ></v-autocomplete
        ></v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="Jenis Pengolahan"
            v-model="filter.jenisPengolahanId"
            :items="listPabrik"
            item-value="id"
            item-title="nama"
            color="primary"
            variant="outlined"
            density="compact"
            @update:modelValue="handleApplyFilter"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2"></v-col>
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
      <v-row>
        <v-col md="12">
          <v-btn-toggle divided variant="outlined">
            <v-btn @click="handleExport()">
              <v-icon start color="#40c75f"> mdi-file-excel </v-icon>
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
        <template v-slot:[`item.tanggall`]="{ item }">
          {{ dateTanggal1(item.tanggal) }}
        </template>
        <template v-slot:[`item.tanggalPetik`]="{ item }">
          {{ dateTanggal1(item.tanggalPetik) }}
        </template>
        <template v-slot:[`item.tglPetik`]="{ item }">
          {{ dateTanggal1(item.tglPetik) }}
        </template>
        <template v-slot:[`item.tanggalMasuk`]="{ item }">
          {{ dateTanggal1(item.tanggalMasuk) }}
        </template>
        <template v-slot:[`item.tanggalTerima`]="{ item }">
          {{ dateTanggal1(item.tanggalTerima) }}
        </template>
        <template v-slot:[`item.jamGiling`]="{ item }">
          {{ minimal_date_format(item.jamGiling) }}
        </template>
        <template v-slot:[`item.tanggalJam`]="{ item }">
          {{ minimal_date_format(item.tanggalJam) }}
        </template>
        <template v-slot:[`item.startTungkuJam`]="{ item }">
          {{ minimal_time_format_no_timezone(item.startTungkuJam) }}
        </template>
        <template v-slot:[`item.stopTungkuJam`]="{ item }">
          {{ minimal_time_format_no_timezone(item.stopTungkuJam) }}
        </template>
        <template v-slot:[`item.startBubukJam`]="{ item }">
          {{ minimal_time_format_no_timezone(item.startBubukJam) }}
        </template>
        <template v-slot:[`item.stopBubukJam`]="{ item }">
          {{ minimal_time_format_no_timezone(item.stopBubukJam) }}
        </template>
        <template v-slot:[`item.tanggalm`]="{ item }">
          {{ minimal_date_format_no_timezone(item.tanggalMulai) }}
        </template>
        <template v-slot:[`item.tanggals`]="{ item }">
          {{ minimal_date_format_no_timezone(item.tanggalSelesai) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon
            variant="tonal"
            color="primary"
            size="32"
            class="mr-1"
            @click="handleDetailItem(item)"
          >
            <EyeIcon class="text-primary" size="18" />
            <v-tooltip activator="parent" location="bottom"
              >Detail Bokar</v-tooltip
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
    listRegional: {
      type: Array,
      default: () => [],
    },
    listPabrik: {
      type: Array,
      default: () => [],
    },
    listPabrik2: {
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
  mixins: [tanggal],
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
        tanggal: new Date().toISOString().substr(0, 10),
        q: "",
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.defaultSortBy,
        sortType: "desc",
        regionalId: null,
        kebunId: null,
        afdelingId: null,
        jenisBokar: null,
        jenisPengolahanId: null,
        pabrikId: null,
      },
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
        jenisBokar: filter.jenisBokar,
        tanggal: filter.tanggal,
        jenisPengolahanId: filter.jenisPengolahanId,
        pabrikId: filter.pabrikId,
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
        tanggal: filter.tanggal,
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
        tanggal: filter.tanggal,
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
        tanggal: filter.tanggal,
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
        tanggal: this.filter.tanggal,
      });
    },
    handleAddItem() {
      this.$emit("addItem");
    },
    handleEditItem(item) {
      // copy item to a before edit
      let a = JSON.parse(JSON.stringify(item));
      this.$emit("editItem", a);
    },
    handleDetailItem(item) {
      // copy item to a before edit
      let a = JSON.parse(JSON.stringify(item));
      this.$emit("detailItem", a);
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
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

    formatHarga(value) {
      if (typeof value !== "number") return value;
      return value.toLocaleString("id-ID");
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
