import { useAPIs } from "../composables/useAPIs";
const menuService = () => {
  const url = "/menu";
  const url2 = "/menu-role";
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
    return useAPIs(`${url}/${req.id}`, {
      method: "PUT",
      body: req,
    });
  }

  async function destroy(id: any) {
    return useAPIs(`${url}/${id}`, {
      method: "DELETE",
    });
  }

  /* ========== Endpoint Role Menu ========== */
  async function retrieveRoleMenu(req: any) {
    return useAPIs(url2, {
      method: "GET",
      params: req,
    });
  }

  async function retrieveRoleMenuTrx(req: any) {
    return useAPIs(`${url2}/trx`, {
      method: "GET",
      params: req,
    });
  }

  async function CreateBulkRoleMenu(req: any) {
    return useAPIs(`${url2}/bulk`, {
      method: "POST",
      body: req,
    });
  }

  return {
    retrieve,
    retrieveAll,
    retrieveById,
    retrieveRoleMenu,
    retrieveRoleMenuTrx,
    save,
    create,
    CreateBulkRoleMenu,
    update,
    destroy,
  };
};

export default menuService;
