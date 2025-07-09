import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useToast } from "@/composables/useToast";
import { useAPIs } from "@/composables/useAPIs";
interface authType {
  user?: any;
  token?: any;
  loggedIn?: boolean;
  menus?: Array<any>;
  permissions?: Array<any>;
};

export const useAuthStore = defineStore({
  id: "auth",
  state: (): authType => ({
    user: {},
    token: null,
    loggedIn: false,
    menus: [],
    permissions: [],
  }),
  persist: true,
  actions: {
    async login(payload: any) {
      try {
        var config = useRuntimeConfig();
        var router = useRouter();
        var { cookies } = useCookies();
        const { data }: any = await useAPIs("/user/login", {
          method: "POST",
          body: payload,
        }).catch((err) => {
          if (err.data) {
            useToast("error", err.data.message);
          }
          return err;
        });

        if (data.success == false) {
          return useToast("error", data.message);
        }

        

        cookies.set(config.public.tokenKey, data.token.AccessToken);
        // set localy
        this.user = data.user;
        this.token = data.token;
        this.loggedIn = true;

        router.push("/dashboard");
      } catch (err) {
        console.log("error.login", err);
        throw err;
      } finally {
        console.log("Finally Login");
        // window.$nuxt.$root.$loading.finish()
      }
    },
    async logout() {
      const router = useRouter();
      router.push("/");

      this.loggedIn = false;
      // this.user = null;
      this.token = null;
      this.loggedIn = false;
      this.menus = [];
      this.permissions = [];

      const config = useRuntimeConfig();
      const { cookies } = useCookies();

      cookies.remove(config.public.tokenKey);
      

      localStorage.clear();
    },

    async loadAuthMenu(payload:any) {
      let permissions:any= []
      await useAPIs("/menu-role", {
        method: "GET",
        params: {
          roleId: payload.roleId,
          commodityId: payload.commodityId,
        },
      })
      .then((res) => {
        const data = res.data || []
        this.menus = data
        data.forEach((el:any) => {
          if (el.permissionList) {
            el.permissionList.forEach((els:any) => {
              permissions.push(els)
            });
          }
  
          if (el.children) {
            el.children.forEach((el2:any) => {
              if (el2.permissionList) {
                el2.permissionList.forEach((els2:any) => {
                  permissions.push(els2)
                });
              }
            });
          }
        });
      
        this.permissions = permissions
      })
      .catch((err) => {
        if (err.data) {
          useToast("error", err.data.message);
        }
        return err;
      });
    },
  },
  getters: {
    dataUser: (state) => state.user,
    dataMenus: (state) => state.menus,
    dataPermissions: (state) => state.permissions,
    statusLogin: (state) => state.loggedIn,
    getToken: (state) => state.token,
  },
});
