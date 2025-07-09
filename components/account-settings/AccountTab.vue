<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import userService from "@/services/user.service";
var config = useRuntimeConfig();

const authStore = useAuthStore();
const dataUser = computed(() => authStore.dataUser);
onMounted(() => {
  dataFoto(); // load data foto user saat page dibuka
});

const fileInput = ref<HTMLInputElement | null>(null);
const originalImageUrl = ref<string | null>(null);
const imagePreview = ref<string | null>(null);
const hasNewImage = ref(false);


const openFilePicker = () => {
  fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    hasNewImage.value = true;
  }
};

const dataFoto = async () => {
  try {
    const res = await userService().retrieveById(dataUser.value.id.toString());
    const fotoPath = res.data.foto;

    if (fotoPath) {
      const fullUrl = `${config.public.apiBase}/files?path=${fotoPath}`;
      originalImageUrl.value = fullUrl;
      imagePreview.value = fullUrl;
    } else {
      // Jika tidak ada foto, beri default image (optional)
      const defaultImage = "/images/profile/user-1.jpg";
      originalImageUrl.value = defaultImage;
      imagePreview.value = defaultImage;
    }

    hasNewImage.value = false;
  } catch (error) {
    useToast("error", error);
  }
};

const saveImage = async () => {
  const file = fileInput.value?.files?.[0];
  if (!file) {
    console.warn("Tidak ada file yang dipilih.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("id", dataUser.value.id.toString());

  try {
    await userService()
      .uploadFoto(formData)
      .then((res: any) => {
        useToast("success", res.data);
        dataFoto();
      });

    hasNewImage.value = false;
  } catch (error) {
    useToast("error", error);
  }
};
</script>

<template>
  <v-card elevation="10">
    <v-row class="ma-sm-n2 ma-n1">
      <v-col cols="12" md="4">
        <v-card elevation="10">
          <v-card-item>
            <h5 class="text-h5">Change Profile</h5>
            <div class="text-subtitle-1 text-medium-emphasis mt-2">
              Rubah Foto Profil Anda
            </div>
            <div class="text-center mt-6 mb-6">
              <v-avatar size="120">
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  height="120"
                  alt="image"
                />
                <div
                  v-else
                  style="
                    width: 120px;
                    height: 120px;
                    background: #eee;
                    border-radius: 50%;
                  "
                ></div>
              </v-avatar>
            </div>
            <div class="d-flex justify-center">
              <v-btn color="primary" class="mx-2" flat @click="openFilePicker">
                Upload
              </v-btn>
              <v-btn
                v-if="hasNewImage"
                color="success"
                class="mx-2"
                variant="flat"
                @click="saveImage"
              >
                Simpan
              </v-btn>
              <input
                type="file"
                accept="image/*"
                ref="fileInput"
                @change="onFileSelected"
                style="display: none"
              />
            </div>
            <div
              class="text-subtitle-1 text-medium-emphasis text-center my-sm-8 my-6"
            >
              Allowed JPG, GIF or PNG. Max size of 800K
            </div>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card elevation="10">
          <v-card-item>
            <h5 class="text-h5">Personal Details</h5>
            <div class="text-subtitle-1 text-medium-emphasis mt-2">
              Informasi Tentang Akun Pribadi Anda
            </div>
            <div class="mt-5">
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Nama</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.name"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Username</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.username"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Email</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.email"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">NIK</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.nik"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Role</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.role.description"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Afdeling</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.personData.afdeling"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Nama Kebun</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    readonly
                    v-model="dataUser.personData.namaKebun"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium"
                    >Deskripsi Jabatan</v-label
                  >
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="dataUser.personData.positionsDesc"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
