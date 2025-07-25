<template>
  <div>
    <v-dialog
      v-model="dialog"
      :scrollable="scrollable"
      :width="width"
      :persistent="persistent"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">{{ title }}</div>
          <v-btn icon="mdi-close" variant="text" @click="handleClose"></v-btn
        ></v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-3">
          <v-row>
            <v-col cols="12" md="4">
            </v-col>
            <v-col cols="12" md="4"></v-col>
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
            :items="data.items"
            :server-items-length="data.meta.totalItems"
            :items-per-page="itemsPerPage"
            :loading="loading"
            v-model:sort-by="sortBy"
            item-value="id"
            hide-default-footer
            @click:row="handleSelect"
          >
            <template v-slot:[`item.no`]="{ item }">
              {{ numberInc + parseInt(data.items.indexOf(item)) + 1 }}.
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
                    color="primary"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    @update:modelValue="getItemPerPage"
                  ></v-select>
                </div>
                &nbsp; dari {{ data.meta.totalItems }} data
              </div>
            </v-col>
            <v-col md="6" cols="12">
              <div style="float: right">
                <SharedPagination
                  :items-per-page="itemsPerPage"
                  :total-items="data.meta.totalItems"
                  @handlePaginate="handlePageChanged"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="tonal" @click.prevent="handleClose"
            >Tutup</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import jenisPengolahanService from "~/services/jenis_pengolahan.service";
export default {
  props: {
    title: {
      type: String,
      default: "Lookup Jenis Pengolahan",
    },
    width: {
      type: String,
      default: "600px",
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      itemsPerPage: 10,
      defaultSortBy: "nama",
      sortDesc: [false],
      sortBy: [
        {
          key: "nama",
          order: "asc",
        },
      ],
      itemsPerPageOptions: [10, 20, 40, 50],
      data: {
        items: [],
        meta: {
          totalItems: 0,
        },
      },
      headers: [
        {
          title: "No",
          key: "no",
          width: "5%",
          align: "center",
          sortable: false,
        },
        { title: "Jenis Pengolahan", key: "nama" },
      ],
      filter: {
        q: "",
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.defaultSortBy,
        sortType: "asc",
      },
      selectedRow: {},
    };
  },
  computed: {
    numberInc() {
      var number = parseInt(this.filter.pageNumber - 1) * this.itemsPerPage;
      return number;
    },
  },

  created(){
   
  },

  methods: {
    async loadData() {
      this.filter.pageSize = this.itemsPerPage;
      this.filter.sortBy = this.defaultSortBy;
      await this.loadAll();
      this.dialog = true;
    },

    async loadAll(id) {
      this.loading = true;
      await jenisPengolahanService()
        .retrieve({
          q: this.filter.q,
          pageSize: this.filter.pageSize,
          pageNumber: this.filter.pageNumber,
          sortBy: this.filter.sortBy,
          sortType: this.filter.sortType,
        })
        .then((res) => {
          this.loading = false;
          this.data = {
            items: res.data != null ? res.data.items : [],
            meta: res.data.meta,
          };
        })
        .catch(() => {
          this.loading = false;
        });
    },

    handleSelect(e, { item }) {
      this.selectedRow = item;
      this.$emit("selectedJenisPengolahan", item);
      this.handleClose();
    },

    handleClose() {
      this.dialog = false;
    },

    handleApplyFilter() {
      const filter = Object.assign({}, this.filter);
      this.filter = {
        q: filter.q,
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.sortBy[0].key,
        sortType: this.sortBy[0].order,
        t: Date.now(),
      };
      this.loadAll();
    },

    handleRefreshItems() {
      const resetFilter = Object.assign({}, this.filter);
      resetFilter.q = "";
      resetFilter.pageNumber = 1;
      (resetFilter.t = Date.now()), (this.filter = resetFilter);
      this.handleApplyFilter();
    },

    handlePageChanged(page) {
      this.filter.pageNumber = page;
      this.loadAll();
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

    handleClear() {
      this.handleResetFilter();
      this.filter.t = Date.now();
      this.loadAll();
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
        this.loadAll();
      }
    },

    getItemPerPage(val) {
      this.itemsPerPage = +val;
      this.filter.pageSize = this.itemsPerPage;
      this.loadAll();
    },
  },
  watch: {
    sortBy() {
      this.handleSort();
    },
  },
};
</script>
<style scoped>
.v-card .v-card-actions {
  padding: 10px 24px 10px !important;
}
</style>