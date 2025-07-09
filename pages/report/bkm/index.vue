<template>
  <div>
    <SharedUiBreadcrumb
      :title="pages.title"
      :breadcrumbs="breadcrumbs"
    ></SharedUiBreadcrumb>

    <TableListBkm
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      :listRegional="listRegional"
      :listKebun="listKebun"
      defaultSortBy="createdAt"
      title="Data Buku Kerja Mandor"
      searchTitle="Cari . . ."
      permission="BKM"
      @change-reg="loadAllKebun"
      @fetchData="loadAll"
      @exportExcel="handleExportExcel"
      @generateBkm="handleGenerateBkm"
      @importBkm="importBkm"
    >
    </TableListBkm>
    <DialogForm
      :show="dialog"
      :persistent="true"
      :reset="resetDialog"
      :formTitle="dialogTitle"
      :isLoading="isLoadingSave"
      @handleSave="handleSave"
      @handleClose="handleClose"
    >
      <v-label class="mb-2 mt-2 font-weight-medium">File Excel</v-label>
      <v-text-field
        v-model="fileName"
        density="compact"
        placeholder="Pilih file"
        hide-details="auto"
        readonly
        @click="$refs.fileInput.click()"
      ></v-text-field>
      <input
        ref="fileInput"
        type="file"
        class="d-none"
        @change="onFileChangedDokumen($event)"
        accept=".xlsx"
      />
    </DialogForm>
  </div>
</template>
<script setup lang="ts">
import reportService from "@/services/report.service";
import regionalService from "~/services/regional.service";
import kebunService from "~/services/kebun.service";
import importBkmService from "~/services/dashboard.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const pages = ref({ title: "Produksi Karet" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Report",
    disabled: true,
    href: "#",
  },
  {
    text: "Buku Kerja Mandor",
    disabled: true,
    href: "#",
  },
]);
const isLoadingSave: any = ref(false);
const dialog: any = ref(false);
const resetDialog = ref(true)
const fileDokumen: any = ref(null);
const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const dialogTitle = ref("Import Bkm");
var router = useRouter();
const route = useRoute();
const isLoading: any = ref(false);
const page = ref(1);
const itemPerPage = ref(10);
const filter = ref({
  tanggal: new Date().toISOString().substr(0, 10),
});
var tableData: any = ref({
  items: [],
  meta: {
    totalItems: 0,
  },
});
const headers = ref([
  { title: "No", key: "no", width: "5%", align: "center", sortable: false },
  { title: "Company Code", key: "companyCode" },
  { title: "Tanggal", key: "tanggal" },
  { title: "Afdeling/keamanan/traksi (Divisi)", key: "afdeling" },
  { title: "Mandoran", key: "mandoran" },
  { title: "Pengawas Utama", key: "pengawasUtama" },
  { title: "Mandor", key: "nikMandor" },
  { title: "Krani/Operator Adm", key: "kraniOprAdm" },
  { title: "Krani Buah/Trans", key: "kraniBuah" },
  { title: "NIK/Employee ID", key: "nikKaryawan" },
  { title: "Contractor", key: "contractor" },
  { title: "Komoditi Code", key: "komoditiCode" },
  { title: "Target Alokasi Biaya", key: "targetAlokasiBiaya" },
  { title: "Location Code", key: "locationCode" },
  { title: "Aktivitas", key: "aktivitas" },
  { title: "Kehadiran/Attendance", key: "kehadiran" },
  { title: "Clock In Date", key: "clockInDate" },
  { title: "Clock In Time", key: "clockInTime" },
  { title: "Clock Out Date", key: "clockOutDate" },
  { title: "Clock Out Time", key: "clockOutTime" },
  { title: "HK / Mandays", key: "hkMandays" },
  { title: "Mandays UoM", key: "mandaysUom" },
  { title: "Overtime Actual", key: "overtimeActual" },
  { title: "Overtime Convertion", key: "overtimeConvertion" },
  { title: "Currency", key: "currency" },
  { title: "Nominal / Rate", key: "nominal" },
  { title: "Quantity", key: "quantity" },
  { title: "Qty UoM", key: "qtyUom" },
  { title: "Referensi", key: "referensi" },
  { title: "Keterangan", key: "keterangan" },
  { title: "Mekanisasi", key: "mekanisasi" },
  { title: "Panen Buat Sangat Mentah", key: "panenBuahSgtMnth" },
  { title: "Busuk Tidak Diberondolkan", key: "busukTdkkDiberondolkan" },
  { title: "Tangkai TBS Tidak Berbentuk 'V'", key: "tangkaiTbs" },
  { title: "Tangkai Panjang Tidak Dipotong", key: "tangkaiPjgTdkDiptg" },
  { title: "Pelepah Tidak Diturunkan", key: "pelepahTdkDiturunkan" },
  { title: "Buah Matang Tidak Dipanen", key: "buahMatangTdkDipanen" },
  {
    title: "Buah Matang Dipanen Tidak Diangkut Ke TPH",
    key: "buahMatangDipanen",
  },
  { title: "Berondolan Tidak Dikutip Bersih", key: "berondolanTdkDikutip" },
  { title: "TBS Tidak Disusun di TPH", key: "tbsTdkDisusun" },
  {
    title: "Pelepah Tidak Disusun Digawangan Mati",
    key: "pelepahTdkDisusun",
  },
  { title: "Berondolan", key: "berondolan" },
  { title: "TBS Tidak Diberi Nomor", key: "tbsTdkDiberiNmr" },
  { title: "Buah Mentah Masuk ke PKS", key: "buahMnthMskPks" },
  { title: "Berondolan Tertinggal di TPH", key: "berondolanTertglTph" },
  { title: "Selisih TBS di PB5", key: "selisihTbs" },
  { title: "Lateks", key: "lateks" },
  { title: "Base Unit of Measure", key: "baseUom" },
  { title: "Kompo", key: "kompo" },
  { title: "Base Unit of Measure", key: "baseUom" },
  { title: "Scrap", key: "scrap" },
  { title: "Base Unit of Measure", key: "baseUom" },
  { title: "Pemungutan Tetes Sore", key: "pemungutanTetesSore" },
  { title: "Base Unit of Measure", key: "baseUom" },
  { title: "Kelas Deres", key: "kelasDeres" },
  { title: "Weight", key: "weight" },
  { title: "Weight UoM", key: "weightUom" },
  { title: "Kualitas Pucuk", key: "kualitasPucuk" },
  { title: "Base Unit of Measure", key: "baseUom" },
  { title: "Shift", key: "shift" },
  { title: "Vendor", key: "vendor" },
  { title: "Mandor Besar", key: "mandorBesar" },
  { title: "Bongkar Muat Teh", key: "bongkarMuatTeh" },
  { title: "Ptgs Timbang Berondolan", key: "ptgsTmbBerondolan" },
  { title: "Petugas QC", key: "petugasQc" },
  { title: "Jam Hujan (Satuan Jam)", key: "jamHujan" },
  { title: "Kakao Superior", key: "kakaoSuperior" },
  { title: "Kakao Superior UoM", key: "baseUom" },
  { title: "Kakao Inferior", key: "kakaoInferior" },
  { title: "Kakao Inferior UoM", key: "baseUom" },
  { title: "Dark Bean", key: "darkBean" },
  { title: "Kopi Merah", key: "kopiMerah" },
  { title: "Kopi Merah UoM", key: "baseUom" },
  { title: "Kopi Hijau", key: "kopiHijau" },
  { title: "Kopi Hijau UoM", key: "baseUom" },
  { title: "Kopi Kuning", key: "kopiKuning" },
  { title: "Kopi Kuning UoM", key: "baseUom" },
  { title: "Kopi Hitam", key: "kopiHitam" },
  { title: "Kopi Hitam UoM", key: "baseUom" },
  { title: "Luasan", key: "luasan" },
  { title: "Purchasing Document", key: "purchasingDocument" },
  { title: "Luasan UoM", key: "luasanUom" },
  { title: "Deres Baru", key: "deresBaru" },
  { title: "F84", key: "f84" },
  { title: "Bulan", key: "bulan" },
  { title: "Tahun", key: "tahun" },
]);
const listRegional: any = ref([]);
const listKebun: any = ref([]);
const authStore = useAuthStore();
const dataUser = computed(() =>
  authStore.dataUser
);


onMounted(async () => {
  loadAllRegional();
  loadAll();
});

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

async function loadAll() {
  var regionalIds =null
  var kebunIds =null
  var afdelingIds =null
  if (dataUser.value.role.id=='HA02' || dataUser.value.role.id=='HA08' || dataUser.value.role.id=='HA04' ) { //02reg08unit04afd
      regionalIds = dataUser.value.personData.regionalId;
     
    }
    if (dataUser.value.role.id=='HA08' || dataUser.value.role.id=='HA04' ) { //02reg08unit04afd
        kebunIds = dataUser.value.personData.kebunId
       
   }
   if (dataUser.value.role.id=='HA04' ) { //02reg08unit04afd
        afdelingIds = dataUser.value.personData.afdelingId
    }
  const {
    pageNumber,
    pageSize,
    q,
    sortBy,
    sortType,
    tanggal,
    regionalId,
    kebunId,
  } = route.query;
  isLoading.value = true;
  await reportService()
    .retrieveRptBkm({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      tanggal: tanggal ? tanggal : filter.value.tanggal,
      idRegional: regionalIds ? regionalIds : regionalId,
      idKebun: kebunIds ? kebunIds : kebunId,
    })
    .then((res: any) => {
      isLoading.value = false;
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

async function handleExportExcel(v:any) {
  if(!v.regionalId){
    return useToast("error", "Pilih Filter Regional");
  }
  if(!v.kebunId){
    return useToast("error", "Pilih Filter Kebun");
  }
  let tgl = v.tanggal ? v.tanggal : filter.value.tanggal
  let filename = `bkm_report_${tgl}.xlsx`;
  await reportService()
    .exportExcelRptBkm({
      tanggal : v.tanggal ? v.tanggal : filter.value.tanggal,
      idRegional: v.regionalId ? String(v.regionalId) : null,
      idKebun: v.kebunId ? String(v.kebunId) : null,
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    });
}
async function handleGenerateBkm(v:any) {
  if(!v.regionalId){
    return useToast("error", "Pilih Filter Regional");
  }
  if(!v.kebunId){
    return useToast("error", "Pilih Filter Kebun");
  }
  try {
    await reportService().generateRptBkm({
      tanggal : v.tanggal ? v.tanggal : filter.value.tanggal,
      idRegional: v.regionalId ? String(v.regionalId) : null,
      idKebun: v.kebunId ? String(v.kebunId) : null,
    });
  } catch (err) {
    console.error("Error saat SAVE DB:", err);
  } finally {
    useToast("success", "Generate BKM berhasil");
    loadAll();
  }
}

function onFileChangedDokumen($event: Event) {
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    const file = target.files[0];
    if (file && file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      useToast("error", "Dokumen harus berupa file excel!");
      target.value = "";
      fileDokumen.value = null;
      fileName.value = "";
      return;
    }

    fileDokumen.value = file;
    fileName.value = file.name;
  }
}

function importBkm() {
  resetDialog.value = false;
  dialogTitle.value = "Import Bkm";
  dialog.value = true;
}

async function handleSave() {
  try {
    isLoadingSave.value = true;
    let formData = new FormData();
    formData.append("file", fileDokumen.value);
    // Tunggu hasil dari importPegawai sebelum lanjut
    const res = await importBkmService().importBkm(formData);
    // Panggil fungsi handleSaveImport dengan hasil response
    await handleSaveImport(res.data);
  } catch (err) {
    console.error("Error saat mengimpor bkm:", err);
  }
}

async function handleSaveImport(data: any) {
  try {
    isLoadingSave.value = true;
    // Tunggu hasil dari saveImportPegawai sebelum lanjut
    await importBkmService().saveImportbkm({
      data: data,
    });

    handleClose();
    useToast("success", "Data Berhasil Disimpan");
    loadAll();
  } catch (err) {
    console.error("Error saat menyimpan import bkm:", err);
  } finally {
    isLoadingSave.value = false;
  }
}


function handleClose() {
  isLoadingSave.value = false;
  resetDialog.value = true;
  dialog.value = false;
}
</script>
