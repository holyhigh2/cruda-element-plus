<template>
  <el-pagination layout="prev, pager, next, sizes" v-model:current-page="$crud.pagination.currentPage"
    v-model:page-size="$crud.pagination.pageSize" @update:current-page="$crud.toQuery()"
    @update:page-size="$crud.reload()" :page-sizes="[5, 15, 20]" :total="$crud.pagination.total" />
</template>
<script setup lang="ts">
import { lookUpCrud } from 'cruda-element-plus';
import { defineProps } from 'vue';

const props = defineProps({
  crud: String
})

const $crud = lookUpCrud(props.crud)!;

</script>
