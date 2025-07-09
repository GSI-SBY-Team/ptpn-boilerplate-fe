<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";

import UserService from "@/services/user.service";

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);

const editedItem: any = ref({});
editedItem.value = {
  newPassword: "",
  confirmPassword: "",
};
const isLoading: any = ref(false);

const handleSave = async () => {
  isLoading.value = true;

  try {
    if (editedItem.value.newPassword !== editedItem.value.confirmPassword) {
      await Swal.fire({
        title: "Gagal",
        text: "Password baru dan konfirmasi baru tidak cocok!",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin mengubah password ?",
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
        editedItem.value.id = dataUser.value.id;
        UserService()
          .resetPassword(editedItem.value)
          .then((response) => {
            if (response.data) {
              useToast("success", "Password Berhasil Diubah");
            }
            editedItem.value = {
              newPassword: "",
              confirmPassword: "",
            };
          });
      }
    });
  } catch (error) {
    console.error("Error saving password:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <v-card elevation="10">
    <v-row class="ma-sm-n2 ma-n1">
      <v-col cols="12">
        <v-card elevation="10">
          <v-card-item>
            <h5 class="text-h5">Ganti Password</h5>
            <div class="text-subtitle-1 text-medium-emphasis mt-2">
              Untuk mengubah password, silahkan masukkan password baru
            </div>
            <div class="mt-5">
              <v-label class="mb-2 font-weight-medium">Password Baru</v-label>
              <v-text-field
                color="primary"
                variant="outlined"
                type="password"
                :rules="[(v) => !!v || 'Wajib diisi']"
                v-model="editedItem.newPassword"
              />
              <v-label class="mb-2 font-weight-medium"
                >Konfirmasi Password</v-label
              >
              <v-text-field
                color="primary"
                variant="outlined"
                type="password"
                :rules="[(v) => !!v || 'Wajib diisi']"
                v-model="editedItem.confirmPassword"
                hide-details
              />
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <div class="d-flex justify-end mt-5">
      <v-btn size="large" color="primary" class="mr-4" @click="handleSave" flat
        >Save</v-btn
      >
      <v-btn size="large" class="bg-lighterror text-error" flat>Cancel</v-btn>
    </div>
  </v-card>
</template>
