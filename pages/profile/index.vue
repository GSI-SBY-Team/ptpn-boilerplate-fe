<script setup lang="ts">
import { ref } from "vue";

import {
  UserCircleIcon,
  BellIcon,
  ArticleIcon,
  LockIcon,
} from "vue-tabler-icons";

import AccountTab from "@/components/account-settings/AccountTab.vue";
import PasswordTab from "@/components/account-settings/PasswordTab.vue";

/*tab*/
const tab = ref(null);
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

// theme breadcrumb
const page = ref({ title: "Account Setting" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/",
  },
  {
    text: "Account Setting",
    disabled: true,
    href: "",
  },
]);
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row class="justify-center">
    <!--Account Settings tabs-->
    <v-col cols="12" md="12">
      <v-card elevation="10" class=" " rounded="md">
        <v-tabs
          v-model="tab"
          bg-color="transparent"
          min-height="70"
          height="70"
          color="primary"
        >
          <v-tab value="Account" class="text-medium-emphasis"
            ><UserCircleIcon class="mr-2" size="20" /> Account</v-tab
          >
          <v-tab value="Password" class="text-medium-emphasis"
            ><LockIcon class="mr-2" size="20" />Password</v-tab
          >
        </v-tabs>
        <v-divider></v-divider>
        <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
          <v-window v-model="tab">
            <v-window-item value="Account">
              <AccountTab />
            </v-window-item>
            <v-window-item value="Password">
              <PasswordTab />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
