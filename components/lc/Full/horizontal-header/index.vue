<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import { useEcomStore } from "@/stores/apps/eCommerce";
// Icon Imports
import {
  GridDotsIcon,
  LanguageIcon,
  SearchIcon,
  Menu2Icon,
  BellRingingIcon,
  ShoppingCartIcon,
} from "vue-tabler-icons";
const customizer = useCustomizerStore();
const showSearch = ref(false);
const drawer = ref(false);
const appsdrawer = ref(false);
const priority = ref(customizer.setHorizontalLayout ? 0 : 0);
function searchbox() {
  showSearch.value = !showSearch.value;
}
watch(priority, (newPriority) => {
  // yes, console.log() is a side effect
  priority.value = newPriority;
});
// count items
const store = useEcomStore();
const getCart = computed(() => {
  return store.cart;
});
</script>

<template>
  <v-app-bar elevation="10" :priority="priority" height="70">
    <div
      :class="
        customizer.boxed
          ? 'maxWidth v-toolbar__content'
          : 'v-toolbar__content px-6'
      "
    >
      <v-locale-provider v-if="customizer.setRTLLayout" rtl>
        <div class="hidden-md-and-down mr-3">
          <LcFullLogoRtlLogo />
        </div>
      </v-locale-provider>
      <v-locale-provider v-else>
        <!-- <div class="hidden-md-and-down mr-3">
          <LcFullLogo />
        </div> -->
        <div class="hidden-md-and-down pa-3 text-center">
          <img src="/images/logos/logo-ptpn.png" style="width: 100px;" />
        </div>
      </v-locale-provider>

      <v-btn
        class="hidden-lg-and-up ms-3 custom-hover-primary"
        icon
        rounded="sm"
        variant="flat"
        @click.stop="customizer.SET_SIDEBAR_DRAWER"
        size="small"
      >
        <Menu2Icon size="20" stroke-width="1.5" />
      </v-btn>

      <v-spacer />
      <!-- ---------------------------------------------- -->
      <!---right part -->
      <!-- ---------------------------------------------- -->
      <div class="me-2">
        <LcFullVerticalHeaderThemeToggler />
      </div>

      <!-- ---------------------------------------------- -->
      <!-- translate -->
      <!-- ---------------------------------------------- -->
      <div class="me-2">
        <!-- <LcFullVerticalHeaderLanguageDD /> -->
      </div>

      <!-- ---------------------------------------------- -->
      <!-- Notification -->
      <!-- ---------------------------------------------- -->

      <!-- <LcFullVerticalHeaderNotificationDD /> -->

      <!-- right sidebar -->
      <v-btn
        class="hidden-lg-and-up ml-3"
        icon
        rounded="sm"
        @click.stop="appsdrawer = !appsdrawer"
        variant="flat"
      >
        <GridDotsIcon size="17" stroke-width="1.5" />
      </v-btn>

      <!-- ---------------------------------------------- -->
      <!-- User Profile -->
      <!-- ---------------------------------------------- -->
      <div class="ml-3 mr-sm-0 mr-3">
        <LcFullVerticalHeaderProfileDD />
      </div>
    </div>
  </v-app-bar>
  <v-navigation-drawer v-model="appsdrawer" location="right" temporary>
    <LcFullVerticalHeaderRightMobileSidebar />
  </v-navigation-drawer>
</template>
