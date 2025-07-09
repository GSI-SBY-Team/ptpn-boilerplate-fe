<script setup>
const props = defineProps({
  title: String,
  persentase: Number,
  value1: Number,
  value2: Number,
});
</script>
<template>
  <v-card elevation="10">
    <v-card-item>
      <div class="mb-3 d-flex justify-space-between align-center">
        <div>
          <h4 class="text-h4">{{props.title}}</h4>
        </div>
        <v-chip
          rounded="sm"
          color="primary"
          class="text-subtitle-2 font-weight-semibold px-4"
          size="small"
          >{{props.persentase}}%</v-chip
        >
      </div>
      <v-progress-linear
        bg-color="lightprimary"
        height="4"
        color="primary"
        rounded
        v-model="skill1"
      ></v-progress-linear>
      <v-row>
        <v-col cols="6">
          <div class="d-flex align-center mt-md-6 mt-3">
            <v-avatar class="rounded-md bg-lightprimary text-primary">
              <UiIcon item="UserCheckIcon" size="22" />
            </v-avatar>
            <div class="pl-4">
              <h3 class="text-h6">{{props.value1}}</h3>
              <h6 class="text-subtitle-1 textSecondary">Absen</h6>
            </div>
          </div>
        </v-col>
        <v-col cols="6" class="d-flex justify-lg-start justify-end">
          <div class="d-flex align-center mt-md-6 mt-3">
            <v-avatar class="rounded-md bg-lighterror text-error">
              <UiIcon item="UserXIcon" size="22" />
            </v-avatar>
            <div class="pl-4">
              <h3 class="text-h6">{{props.value2}}</h3>
              <h6 class="text-subtitle-1 textSecondary">Belum Absen</h6>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
