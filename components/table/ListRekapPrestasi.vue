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
            label="Tanggal Mulai"
            v-model="filter.startDate"
            density="compact"
            placeholder="Tanggal Mulai"
            type="date"
            hide-details="auto"
            @update:modelValue="handleApplyFilter"
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
        <v-col cols="12" md="4">
          <v-btn-toggle divided variant="outlined">
            <v-btn @click="handleExport()">
              <v-icon start color="#40c75f">
                mdi-file-excel
              </v-icon>
              <span class="hidden-sm-and-down">Export</span>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12" md="4">
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
        <!-- Slot Footer -->
        <template v-slot:tfoot>
          <tr>
            <td colspan="1"><strong></strong></td>
            <td class="text-center" colspan="1"><strong>Jumlah</strong></td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalLateks }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalLump }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalScrapB }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalBasah }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalSheet }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalCompo }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalScrapK }}</strong>
            </td>
            <td class="text-right pr-4">
              <strong>{{ tableData.meta.totalKering }}</strong>
            </td>
          </tr>
        </template>

        <template v-slot:[`item.no`]="{ item }">
          {{ numberInc + parseInt(tableData.items.indexOf(item)) + 1 }}.
        </template>
        <template v-slot:[`item.nama`]="{ item }">
          <span
            style="color: blue"
            class="text-blue-600 underline cursor-pointer"
            @click="handleClickNama(item)"
          >
            {{ item.nama }}
          </span>
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
    pageFilter: {
      type: Object,
      default: {
        idRegional : "",
        idKebun : "",
        idAfdeling : "",
        idMandor : "",
      },
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
        pageSize: this.itemsPerPage ?? 10,
        pageNumber: 1,
        sortBy: this.defaultSortBy,
        sortType: "asc",
        idRegional: this.pageFilter.idRegional,
        idKebun: this.pageFilter.idKebun,
        idAfdeling: this.pageFilter.idAfdeling,
        idMandor: this.pageFilter.idMandor,
      },
    };
  },
  computed: {
    numberInc() {
      var number = parseInt(this.filter.pageNumber - 1) * this.itemsPerPage;
      return number;
    },
  },
  methods: {
    splitJam(txt) {
      if (!txt) {
        return "";
      }
      const match = txt.match(/T(\d{2}:\d{2}):\d{2}/);
      if (match) {
        return match[1];
      }
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
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        idRegional: this.pageFilter.idRegional,
        idKebun: this.pageFilter.idKebun,
        idAfdeling: this.pageFilter.idAfdeling,
        idMandor: this.pageFilter.idMandor,
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
        startDate: this.filter.startDate,
        endDate: this.filter.endDate,
      })
    },
    handleAddItem() {
      this.$emit("addItem");
    },
    handleClickNama(item) {
      // copy item to a before edit
      let a = JSON.parse(JSON.stringify(item));
      this.$emit("clickName", a);
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
