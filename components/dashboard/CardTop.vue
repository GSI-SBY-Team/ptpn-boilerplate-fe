<script setup>
const props = defineProps({
  title: String,
  img: String,
  bgcolor: String,
  textcolor: String,
  number: Number,
});
</script>
<template>
  <div
    :class="
      'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-' +
      props.bgcolor
    "
  >
    <div :class="'bg-' + props.bgcolor">
      <img :src="props.img" alt="icon" />
      <div
        :class="
          'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-' +
          props.textcolor
        "
        v-text="props.title"
      ></div>
      <h4
        :class="'text-h4 mt-1 text-' + props.textcolor"
        v-text="props.number"
      ></h4>
    </div>
  </div>
</template>
