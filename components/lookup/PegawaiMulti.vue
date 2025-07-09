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
              <v-autocomplete
                label="Regional"
                v-model="filter.regionalId"
                :items="listRegional"
                item-value="id"
                item-title="nama"
                color="primary"
                variant="outlined"
                density="compact"
                hide-details="auto"
                @update:modelValue="handleApplyFilter"
                clearable
              ></v-autocomplete>
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
          <v-table class="month-table" :key="key">
            <thead style="background: #f4f4f4; font-weight: bold">
              <tr>
                <td
                  v-if="checkAll"
                  class="text-center"
                  style="width: 5%; padding-top: 27px"
                >
                  <v-checkbox
                    v-model="checkAll"
                    @click="uncekAll()"
                  ></v-checkbox>
                </td>
                <td
                  v-if="!checkAll"
                  class="text-center"
                  style="width: 5%; padding-top: 27px"
                >
                  <v-checkbox v-model="checkAll" @click="cekAll()"></v-checkbox>
                </td>
                <td style="width: 15%">NIK</td>
                <td style="width: 35%">Nama</td>
                <td style="width: 20%">Regional</td>
                <td style="width: 20%">Jabatan</td>
              </tr>
            </thead>
            <tbody v-if="data.items.length > 0">
              <tr v-for="(x, i) in data.items" :key="i">
                <td style="padding-top: 22px">
                  <v-checkbox
                    v-model="x.isChecked"
                    :key="i + 1"
                    @change="addSelected(x.isChecked, x)"
                  ></v-checkbox>
                </td>
                <td>{{ x.nik }}</td>
                <td>{{ x.nama }}</td>
                <td>{{ x.regionalName }}</td>
                <td>{{ x.jobPositionName }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="4">Data Not Found</td>
              </tr>
            </tbody>
          </v-table>
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
          <v-btn color="primary" variant="flat" @click.prevent="selectItem"
            >Simpan</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pegawaiService from "~/services/pegawai.service";
import regionalService from "~/services/regional.service";
export default {
  props: {
    title: {
      type: String,
      default: "Lookup Pegawai",
    },
    width: {
      type: String,
      default: "1000px",
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
    list_data_pegawai: {
      type: Array,
      default: [],
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
      filter: {
        q: "",
        pageSize: this.itemsPerPage,
        pageNumber: 1,
        sortBy: this.defaultSortBy,
        sortType: "asc",
        regionalId: null,
      },
      listRegional: [],
      selectedRow: {},
      key: 0,
      checkAll: false,
      dataSelectHapus: [],
      selected: [],
    };
  },
  computed: {},

  created() {
    this.loadAllRegional();
  },

  methods: {
    async loadData() {
      this.filter.pageSize = this.itemsPerPage;
      this.filter.sortBy = this.defaultSortBy;
      await this.loadAll();
      this.dialog = true;
    },

    cekAll() {
      this.checkAll = true;
      if (this.checkAll) {
        for (let index = 0; index < this.data.items.length; index++) {
          const element = this.data.items[index];
          element.isChecked = true;
          const rm = this.selected.find(
            (el) => el.idPegawai == element.idPegawai
          );
          if (rm != undefined) {
          } else {
            this.selected.push(element);
          }

          const tmp = this.dataSelectHapus.find(
            (el) => el.idPegawai == element.idPegawai
          );
          if (tmp) {
            const ind = this.dataSelectHapus.indexOf(tmp);
            this.dataSelectHapus.splice(ind, 1);
          }
        }
      } else {
        for (let index = 0; index < this.data.items.length; index++) {
          const element = this.data.items[index];
          element.isChecked = false;

          const rm = this.selected.find(
            (el) => el.idPegawai == element.idPegawai
          );
          if (rm) {
            const idx = this.selected.indexOf(rm);
            this.selected.splice(idx, 1);
          }
          this.dataSelectHapus.push(element);
        }
      }
    },
    uncekAll() {
      this.checkAll = false;
      if (this.checkAll) {
        for (let index = 0; index < this.data.items.length; index++) {
          const element = this.data.items[index];
          element.isChecked = true;
          const rm = this.selected.find(
            (el) => el.idPegawai == element.idPegawai
          );
          if (rm != undefined) {
          } else {
            this.selected.push(element);
          }

          const tmp = this.dataSelectHapus.find(
            (el) => el.idPegawai == element.idPegawai
          );
          if (tmp) {
            const ind = this.dataSelectHapus.indexOf(tmp);
            this.dataSelectHapus.splice(ind, 1);
          }
        }
      } else {
        for (let index = 0; index < this.data.items.length; index++) {
          const element = this.data.items[index];
          element.isChecked = false;

          const rm = this.selected.find(
            (el) => el.idPegawai == element.idPegawai
          );
          if (rm) {
            const idx = this.selected.indexOf(rm);
            this.selected.splice(idx, 1);
          }
          this.dataSelectHapus.push(element);
        }
      }
    },

    addSelected(cheked, kode) {
      if (cheked && this.selected.indexOf(kode) < 0) {
        // jika baru
        this.selected.push(kode);
        const tmp = this.dataSelectHapus.find(
          (el) => el.idPegawai == kode.idPegawai
        );
        if (tmp) {
          const ind = this.dataSelectHapus.indexOf(tmp);
          this.dataSelectHapus.splice(ind, 1);
        }
      } else if (cheked && this.selected.indexOf(kode) >= 0) {
        // this.selected.push(kode)
      } else {
        const ind = this.selected.indexOf(kode);
        this.dataSelectHapus.push(kode);
        this.selected.splice(ind, 1);
      }
    },

    loadAllRegional() {
      regionalService()
        .retrieveAll({})
        .then((res) => {
          this.listRegional = res.data || [];
        });
    },

    async loadAll(id) {
      this.key += 1;
      this.loading = true;
      await pegawaiService()
        .retrieve({
          q: this.filter.q,
          pageSize: this.filter.pageSize,
          pageNumber: this.filter.pageNumber,
          sortBy: this.filter.sortBy,
          sortType: this.filter.sortType,
          regionalId: this.filter.regionalId,
          // personType: 2,
        })
        .then((res) => {
          this.loading = false;
          this.data = {
            items: res.data != null ? res.data.items : [],
            meta: res.data.meta,
          };
          for (let index = 0; index < this.data.items.length; index++) {
            const element = this.data.items[index];
            this.data.items[index].isChecked = this.selected.find(
              (el) => el == element
            );
            element.idPegawai = element.id;
          }
          if (this.list_data_pegawai.length > 0) {
            for (let i = 0; i < this.data.items.length; i++) {
              const el = this.data.items[i];
              for (let j = 0; j < this.list_data_pegawai.length; j++) {
                const el2 = this.list_data_pegawai[j];
                if (el.nip === el2.nip) {
                  if (
                    this.dataSelectHapus.find(
                      (els) => els.idPegawai == el.idPegawai
                    )
                  ) {
                    el.isChecked = false;
                  } else {
                    el.isChecked = true;
                  }
                }
              }
            }
          }
          this.list_data_pegawai.forEach((element, indx) => {
            const rm = this.selected.find(
              (el) => el.idPegawai == element.idPegawai
            );

            if (rm == undefined) {
              this.selected.push(element);
              element.id = element.idPegawai;
            } else {
            }
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },

    selectItem() {
      this.$emit("selectItemMulti", this.selected, this.dataSelectHapus);
      this.handleClose();
    },

    handleClose() {
      this.selected = [];
      this.data.items = [];
      this.filter.q = "";
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
        regionalId: filter.regionalId,
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
