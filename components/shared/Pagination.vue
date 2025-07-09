<template>
  <div>
    <nav>
      <ul class="pagination justify-content-end mb-0">
        <li
          class="page-item"
          @click="setPage(currentPage - 1)"
          :class="currentPage === 1 ? 'disable' : ''"
        >
          <a class="page-link" href="javascript:;">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <li v-if="startPage > 1" class="active page-item">
          <a class="page-link" href="javascript:;">...</a>
        </li>

        <li
          class="page-item"
          v-for="n in range(startPage, endPage)"
          :key="n"
          @click="setPage(n)"
        >
          <a
            href="javascript:;"
            :class="`page-link cursor-pointer ${
              currentPage === n ? 'active' : ''
            }`"
            >{{ n }}</a
          >
        </li>

        <li v-if="totalPages > endPage" class="active page-item">
          <a class="page-link" href="javascript:;">...</a>
        </li>

        <li
          class="page-item"
          @click="setPage(currentPage + 1)"
          :class="currentPage === totalPages ? 'disable' : ''"
        >
          <a class="page-link" href="javascript:;">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
const emit = defineEmits(["handlePaginate"]);
const route = useRoute();

interface IProps {
  value?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  value: 0,
  totalItems: 0,
  itemsPerPage: 10,
});

const currentPage = ref<number>(1);
const pagingShow = ref<number>(3);
const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);

const startPage = computed(() => {
  let startPg = currentPage.value - pagingShow.value;
  startPg = startPg < 1 ? 1 : startPg;
  return startPg;
});

const endPage = computed(() => {
  let totalPg = Math.ceil(props.totalItems / props.itemsPerPage);
  var endPg = currentPage.value + pagingShow.value;
  endPg = totalPg > 1 ? endPg : 1;
  endPg = totalPg > endPg ? endPg : totalPg;

  return endPg;
});

const setPage = (idx: number) => {
  if (idx <= 0 || idx > totalPages.value) {
    return;
  }

  currentPage.value = idx;
  emit("handlePaginate", currentPage.value);
};

const range = (start: any, end: any) => {
  let arr: any = [];
  if (end == 1) {
    arr = [1];
  }

  for (let i = start; i <= end - 1; i++) {
    arr.push(i);
  }

  return arr;
};

onMounted(() => {});

watch(
  () => props.value,
  (newStatus) => {
    currentPage.value = props.value;
  }
);
</script>
