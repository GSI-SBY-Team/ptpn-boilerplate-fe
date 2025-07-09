<script setup>
import { getSecondary } from "@/utils/UpdateColors";
const props = defineProps({
  title: String,
  subtitle: String,
  icon: String,
  bgcolor: String,
  textcolor: String,
  value: Number,
});
</script>
<template>
  <v-card elevation="10">
    <v-card-item style="padding: 10px 20px 22px !important;">
      <div class="d-flex align-center justify-space-between">
        <v-card-title class="text-h5">{{props.title}}</v-card-title>
        <v-btn size="small" icon variant="flat" class="bg-secondary">
          <v-avatar size="small" class="text-white">
            <UiIcon :item="props.icon" size="20" />
          </v-avatar>
        </v-btn>
      </div>
      <v-row>
        <v-col cols="12">
          <div class="mt-1">
            <h6 class="text-h6">{{props.value}}</h6>
            <div class="mt-2 d-flex gap-2 align-center">
              <span class="text-subtitle-1 textSecondary">{{props.subtitle}}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
