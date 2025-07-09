<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
    width="270"
  >
    <!---Logo part -->
    <!---Logo part -->
    <v-locale-provider v-if="customizer.setRTLLayout" rtl>
      <div class="pa-5">
        <LcFullLogoRtlLogo />
      </div>
    </v-locale-provider>
    <v-locale-provider v-else>
      <div class="pa-3 text-center">
        <!-- <LcFullLogo /> -->
        <img src="/images/logos/logo-ptpn.png" style="width: 43%" />
      </div>
    </v-locale-provider>

    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4" density="compact">
        <!---Menu Loop -->
        <template v-for="(item, i) in computedMenus" :key="item.name">
          <!---Item Sub Header -->
          <LcFullVerticalSidebarNavGroup
            :item="item"
            v-if="item.header"
          />
          <!---If Has Child -->
          <LcFullVerticalSidebarNavCollapse
            class="leftPadding"
            :item="item"
            :level="0"
            v-else-if="item.children"
          />
          <!---Single Item-->
          <LcFullVerticalSidebarNavItem
            :item="item"
            v-else
            class="leftPadding"
          />
          <!---End Single Item-->
        </template>
      </v-list>
      <div class="pa-6 userbottom">
        <LcFullVerticalSidebarProfile />
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
// import { ref, shallowRef } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import { useAuthStore } from "@/stores/auth";
import menuService from "../../../../services/menu.service";
import sidebarItems from './sidebarItem';

const customizer = useCustomizerStore();
// const sidebarMenu = shallowRef(sidebarItems);
const authStore = useAuthStore();

const computedMenus = computed(() => authStore.dataMenus);

onMounted(async () => {});
</script>
