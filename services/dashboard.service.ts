const dashboardService = () => {
    const url = "/dashboard";
    async function retrieveDBPresensi(req: any) {
      return useAPIs(`${url}/presensi`, {
        method: "GET",
        params: req,
      });
    }
  
    
    async function retrieveDBPrestasiKomoditas(req: any) {
      return useAPIs(`${url}/prestasi-komoditas`, {
        method: "GET",
        params: req,
      });
    }
  
    async function retrieveDBSummaryPresensi(req: any) {
      return useAPIs(`${url}/summary-presensi`, {
        method: "GET",
        params: req,
      });
    }
  
    async function retrieveDBSummaryProduksiKaret(req: any) {
      return useAPIs(`${url}/summary-produksi-karet`, {
        method: "GET",
        params: req,
      });
    }
  
    async function retrieveDBSummaryProduksiTeh(req: any) {
      return useAPIs(`${url}/summary-produksi-teh`, {
        method: "GET",
        params: req,
      });
    }
  
    async function retrieveDBSummaryTapInspeksi(req: any) {
      return useAPIs(`${url}/summary-tap-inspeksi`, {
        method: "GET",
        params: req,
      });
    }

    
  
    async function importBkm(req: any) {
      return useAPIs(`${url}/import-bkm`, {
        method: "POST",
        body: req,
      });
    }   
  
    async function saveImportbkm(req: any) {
      return useAPIs(`${url}/save-import-bkm`, {
        method: "POST",
        body: req,
      });
    }
  
    return {
      retrieveDBPrestasiKomoditas,
      retrieveDBPresensi,
      retrieveDBSummaryPresensi,
      retrieveDBSummaryProduksiKaret,
      retrieveDBSummaryProduksiTeh,
      retrieveDBSummaryTapInspeksi,
      importBkm,
      saveImportbkm,
    };
  };
  
  export default dashboardService;
  