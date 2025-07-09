<script setup lang="ts">
import { MailIcon, PowerIcon } from "vue-tabler-icons";
import { profileDD } from "@/_mockApis/headerData";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();
var config = useRuntimeConfig();

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);

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

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
        <v-avatar size="35">
          <img
            :src="
              dataUser.foto
                ? `${config.public.apiBase}/files?path=${dataUser.foto}`
                : '/images/profile/user-1.jpg'
            "
            height="35"
            alt=""
          />
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="360" elevation="10">
      <div class="px-8 pt-6">
        <h6 class="text-h5 font-weight-medium">User Profile</h6>
        <div class="d-flex align-center mt-4 pb-6">
          <v-avatar size="80">
            <img
              :src="
                dataUser.foto
                  ? `${config.public.apiBase}/files?path=${dataUser.foto}`
                  : '/images/profile/user-1.jpg'
              "
              height="80"
            />
          </v-avatar>
          <div class="ml-3">
            <h6 class="text-h6 mb-n1">{{ dataUser.name }}</h6>
            <span class="text-subtitle-1 font-weight-regular textSecondary">{{
              dataUser.role.name
            }}</span>
            <div class="d-flex align-center mt-1">
              <UserIcon size="18" stroke-width="1.5" />
              <span
                class="text-subtitle-1 font-weight-regular textSecondary ml-2"
                >{{ dataUser.personData.nik }}</span
              >
            </div>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <perfect-scrollbar>
        <v-list class="py-0 theme-list" lines="two">
          <v-list-item
            v-for="item in profileDD"
            :key="item.title"
            class="py-4 px-8 custom-text-primary"
            :to="item.href"
          >
            <template v-slot:prepend>
              <v-avatar size="48" color="lightprimary" rounded="md">
                <img
                  :src="item.avatar"
                  width="24"
                  height="24"
                  :alt="item.avatar"
                />
              </v-avatar>
            </template>
            <div>
              <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">
                {{ item.title }}
              </h6>
            </div>
            <p class="text-subtitle-1 font-weight-regular textSecondary">
              {{ item.subtitle }}
            </p>
          </v-list-item>
        </v-list>
      </perfect-scrollbar>
      <div class="pt-4 pb-6 px-8 text-center">
        <v-btn color="primary" variant="outlined" block @click="handleLogout()"
          >Logout</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
