<template>
    <div>
      <SharedUiBreadcrumb
        :title="pages.title"
        :breadcrumbs="breadcrumbs"
      ></SharedUiBreadcrumb>
  
      <TableList
        :headers="headers"
        :tableData="tableData"
        :loading="isLoading"
        defaultSortBy="createdAt"
        title="Data Regional"
        searchTitle="Cari Regional"
        permission="REGIONAL"
        @fetchData="loadAll"
        @addItem="addItem"
        @editItem="editItem"
        @deleteItem="deleteItem"
        @handleExport="handleExport"
      >
      </TableList>
  
      <DialogForm
        :show="dialog"
        :persistent="true"
        :reset="resetDialog"
        :formTitle="dialogTitle"
        :isLoading="isLoadingSave"
        @handleSave="handleSave"
        @handleClose="handleClose"
      >
        <v-label class="mb-2 mt-2 font-weight-medium">Nama</v-label>
        <v-text-field
          v-model="editedItem.nama"
          density="compact"
          :rules="[(v) => !!v || 'Wajib diisi']"
          placeholder="Nama"
          hide-details="auto"
        ></v-text-field>
  
        <v-label class="mb-2 mt-2 font-weight-medium">Alamat</v-label>
        <v-textarea
          v-model="editedItem.alamat"
          density="compact"
          placeholder="Alamat"
          hide-details="auto"
          rows="2"
        ></v-textarea>
  
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
  import regionalService from "@/services/regional.service";
  
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
      text: "Regional",
      disabled: true,
      href: "#",
    },
  ]);
  
  const route = useRoute();
  const isLoadingSave: any = ref(false);
  const isLoading: any = ref(false);
  const dialog: any = ref(false);
  const resetDialog = ref(true);
  const dialogTitle = ref("Tambah Regional");
  const page = ref(1);
  const itemPerPage = ref(10);
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
    { title: "Nama", key: "nama" },
    { title: "Alamat", key: "alamat" },
    {
      title: "Aksi",
      key: "actions",
      align: "center",
      width: "15%",
      sortable: false,
    },
  ]);
  const editedItem: any = ref({});
  
  const { checkPermission } = usePermission()
  onBeforeMount(() => {
    checkPermission("REGIONAL.VIEW")
  })
  
  onMounted(async () => {
    loadAll();
  });
  
  async function loadAll() {
    const { pageNumber, pageSize, q, sortBy, sortType } = route.query;
    isLoading.value = true;
    await regionalService()
      .retrieve({
        q: q,
        pageSize: pageSize ? pageSize : itemPerPage.value,
        pageNumber: pageNumber ? pageNumber : 1,
        sortBy: sortBy,
        sortType: sortType,
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
    regionalService()
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
    dialogTitle.value = "Tambah Regional";
    dialog.value = true;
  }
  
  async function editItem(x: any) {
    resetDialog.value = false;
    await regionalService()
      .retrieveById(x.id)
      .then((res: any) => {
        if (res.data.id) {
          editedItem.value = res.data;
          dialogTitle.value = "Edit Regional";
          editedItem.value.password = null;
          dialog.value = true;
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
        regionalService()
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
  
  async function handleExport(v:any) {
    const date = new Date().toISOString().substr(0, 10);
    let filename = `data_regional_${date}.xlsx`;
    await regionalService()
      .exportExcel({})
      .then((response:any) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      });
  }
  </script>
  