import { useAPIs } from "../composables/useAPIs";
const afdelingService = () => {
  const url = "/master/afdeling";
  async function retrieve(req: any) {
    return useAPIs(url, {
      method: "GET",
      params: req,
    });
  }

  async function retrieveAll(req: any) {
    return useAPIs(`${url}/all`, {
      method: "GET",
      params: req,
    });
  }

  async function retrieveById(id: any) {
    return useAPIs(`${url}/${id}`, {
      method: "GET",
    });
  }

  async function save(req: any) {
    if (req.id) {
      return update(req);
    } else {
      return create(req);
    }
  }

  async function create(req: any) {
    return useAPIs(url, {
      method: "POST",
      body: req,
    });
  }

  async function update(req: any) {
    return useAPIs(url, {
      method: "PUT",
      body: req,
    });
  }

  async function destroy(id: any) {
    return useAPIs(`${url}/${id}`, {
      method: "DELETE",
    });
  }

  async function exportExcel(req: any) {
    return useAPIs(`${url}/export`, {
      method: "GET",
      params: req,
      responseType: "blob",
    });
  }

  return {
    retrieve,
    retrieveAll,
    retrieveById,
    save,
    create,
    update,
    destroy,
    exportExcel
  };
};

export default afdelingService;
