<script setup lang="ts">
// import { HomeIcon } from "vue-tabler-icons";
const props = defineProps({
  title: String,
  breadcrumbs: Array as any,
  icon: String,
});
</script>

<template>
  <div class="mb-5" style="margin-top: -5px">
    <!-- <h3 class="text-h3 mb-2">{{ title }}</h3> -->
    <v-breadcrumbs
      :items="breadcrumbs"
      class="text-h6 font-weight-medium pa-0 ml-n1"
    >
      <template v-slot:divider>
        <h6 class="text-medium-emphasis text-subtitle-1">/</h6>
      </template>
      <!-- <template v-slot:prepend>
        <HomeIcon/>
      </template> -->
      <template v-slot:title="{ item }">
        <h6 class="text-medium-emphasis text-subtitle-1">
          {{ item.text }}
        </h6>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<style lang="scss">
.page-breadcrumb {
  .v-toolbar {
    background: transparent;
  }
}
</style>
