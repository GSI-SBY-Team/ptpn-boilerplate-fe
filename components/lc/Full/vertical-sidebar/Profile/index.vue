<template>
  <v-sheet rounded="md" color="lightsecondary" class="px-4 py-3 ExtraBox">
    <div class="d-flex align-center hide-menu">
      <v-avatar size="40">
        <img
          :src="
            dataUser.foto
              ? `${config.public.apiBase}/files?path=${dataUser.foto}`
              : '/images/profile/user-1.jpg'
          "
          alt="user"
          height="40"
        />
      </v-avatar>
      <div class="ml-4">
        <h4 class="mb-n1 text-h6 textPrimary">
          {{
            (dataUser.name || "").length > 6
              ? (dataUser.name || "").substring(0, 6) + "..."
              : dataUser.name || ""
          }}
        </h4>
        <span class="text-subtitle-2 textSecondary">{{
          dataUser.role.name || ""
        }}</span>
      </div>
      <div class="ml-auto">
        <v-btn
          variant="text"
          icon
          rounded="md"
          color="primary"
          @click="handleLogout()"
        >
          <PowerIcon />
          <v-tooltip activator="parent" location="top">Logout</v-tooltip>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>
<script setup lang="ts">
import { PowerIcon } from "vue-tabler-icons";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";
const { statusLogin, logout }: any = useAuthStore();

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);
const router = useRouter();
var config = useRuntimeConfig();

function handleLogout() {
  Swal.fire({
    title: "Logout",
    text: "Apakah Anda yakin ingin keluar dari aplikasi?",
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
      router.push("/logout");
    }
  });
}
</script>
<style lang="scss">
.ExtraBox {
  position: relative;
  overflow: hidden;
}
.line-height-none {
  line-height: normal;
}
</style>
