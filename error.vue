<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
const router = useRouter();
</script>

<template>
  <div class="v-application d-flex">
    <div class="nopage">
      <div class="d-flex justify-center align-center text-center h-100">
        <div>
          <img src="/images/backgrounds/errorimg.svg" width="500" alt="404" />
          <h1 class="text-h1 pt-3">Opps!!!</h1>
          <h4 class="text-h4 my-8">
            This page you are looking for could not be found.
          </h4>
          <v-btn flat color="primary" class="mb-4" @click="router.go(-1)"
            >Go Back to Home</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>
