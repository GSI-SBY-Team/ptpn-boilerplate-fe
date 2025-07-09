import { ofetch } from "ofetch";
import { useCookies } from "vue3-cookies";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth";
export const useAPIs = (url:any, opts:any) => {
    let config = useRuntimeConfig();
    let { cookies } = useCookies();
    const { logout }: any = useAuthStore();
    let token = cookies.get(config.public.tokenKey)

    const apiFetch = ofetch.create({
        baseURL: "/api", 
        onRequest({ request, options }) {
            if (token) {
                options.headers = { Authorization: `Bearer ${token}` }
            }
        },
        async onResponseError({ response }) {
            const error = response._data.error
            useToast("error", error);
            if (response.status === 401) {
                navigateTo("/logout");
            }
        },
    });

    return apiFetch(url, opts)
}


export const useAPIsTransport = (url:any, opts:any) => {
    let config = useRuntimeConfig();
    let { cookies } = useCookies();
    const { logout }: any = useAuthStore();
    let token = cookies.get(config.public.tokenKey)

    const apiFetch = ofetch.create({
        baseURL: "/transport", 
        onRequest({ request, options }) {
            if (token) {
                options.headers = { Authorization: `Bearer ${token}` }
            }
        },
        async onResponseError({ response }) {
            const error = response._data.error
            useToast("error", error);
            if (response.status === 401) {
                navigateTo("/logout");
            }
        },
    });

    return apiFetch(url, opts)
}