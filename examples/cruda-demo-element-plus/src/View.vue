<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { FormInstance, ElMessageBox, ElNotification } from 'element-plus';
import CRUD, { useCrud, onHook, lookUpCrud } from 'cruda-element-plus';

///////////////////////////////// data
const rules = reactive({
  uname: [{ required: true, trigger: 'blur' }],
  email: [{ required: true, trigger: 'blur' }],
});

const showView = computed(() => {
  console.log($crud.formStatus)
  return $crud.formStatus == 3;
});

// use cruda
const $crud = lookUpCrud()!
console.log($crud,'xxx')

///////////////////////////////// refs
const formRef = ref<FormInstance>();

///////////////////////////////// lifecycle
onMounted(() => {
  $crud.reload();
});

///////////////////////////////// hooks
onHook(CRUD.HOOK.AFTER_DETAILS,(crud:CRUD,rs:any)=>{
    console.log('View',rs)
  })
///////////////////////////////// methods

function getTitle() {
  if ($crud.formStatus == 1) return '新增';
  if ($crud.formStatus == 2) return '编辑';
}

</script>

<template>
  <el-dialog :title="getTitle()" v-model="showView" width="30%">
    <el-form
      ref="formRef"
      :rules="rules"
      :model="$crud.form"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="uname">
        {{ $crud.form.uname }}
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        {{ $crud.form.email }}
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$crud.cancel()">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
body {
  position: absolute;
  height: 100%;
  width: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0 1rem;
}
#app header,
#app footer {
  padding: 0.5rem 0;
}
#app main {
  flex: 1;
}
</style>
