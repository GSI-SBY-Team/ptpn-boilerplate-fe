import { useAPIs } from "../composables/useAPIs";
const userService = () => {
  const url = "/user";
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

     async function aktif(id: any) {
      return useAPIs(`${url}/aktif-user/${id}`, {
        method: "PUT",
      });
    }


  async function resetPassword(req: any) {
    
    return useAPIs(`${url}/password/reset/${req.id}`, {
      method: "PUT",
      body: req,
    });
  }

  async function uploadFoto(req: any) {
    
    return useAPIs(`${url}/update-foto`, {
      method: "POST",
      body: req,
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
    aktif,
    resetPassword,
    uploadFoto,
  };
};

export default userService;
