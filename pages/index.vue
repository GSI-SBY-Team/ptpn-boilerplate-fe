<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
</script>
<template>
  <div class="pa-3">
    <v-row class="h-100vh mh-100 auth">
      <v-col
        cols="12"
        lg="7"
        xl="8"
        class="d-lg-flex align-center justify-center authentication position-relative login"
      >
        <div class="auth-header pt-lg-6 pt-2 px-sm-6 px-3 pb-lg-6 pb-0">
          <div class="position-relative">
            <!-- <LcFullLogo /> -->
            <div class="logo">
              <img
                src="/images/logos/logo-ptpn.png"
                style="width:20%;"
              />
            </div>
          </div>
        </div>
        <!-- <div class="">
          <img
            src="/images/backgrounds/login-bg.svg"
            class="position-relative d-none d-lg-flex"
            alt="login-background"
          />
        </div> -->
      </v-col>
      <v-col cols="12" lg="5" xl="4" class="d-flex align-center justify-center">
        <div class="mt-xl-0 mt-5">
          <h2 class="text-h3 font-weight-bold mb-2">Login</h2>
          <div class="text-subtitle-1 mb-6">
            Silahkan login menggunakan username dan password Anda.
          </div>
          <AuthLoginForm />
          <div class="text-center mt-8">
            <p class="mb-0 text-subtitle-1">Copyright © 2024 PTPN I</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
 .auth-max-width {
  width: 100%;
  max-width: 400px;
}

.img-logo {
  width: 370px;
}

@media (max-width: 575px) {
  .img-logo {
    width: 240px;
  }
}

@media (max-width: 1199px) {
  .login {
    background: none !important;
  }
} 

.login {
  min-height: 100%;
  background: url("/images/backgrounds/bg-auth.jpg");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.authentication::before {
  background: transparent !important;
}
</style>
