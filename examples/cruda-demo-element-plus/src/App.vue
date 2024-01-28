<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { FormInstance, ElMessageBox, ElNotification } from 'element-plus';
import CRUD, { useCrud, onHook } from 'cruda-element-plus';
import CrudaPagination from './components/CrudaPagination.vue';
import ViewV from './View.vue';

///////////////////////////////// data
const rules = reactive({
  uname: [{ required: true, trigger: 'blur' }],
  email: [{ required: true, trigger: 'blur' }],
});

const showDialog = computed(() => {
  return $crud.formStatus > 0 && $crud.formStatus < 3;
});

// use cruda
const $crud = useCrud('/api/single');
$crud.recoverable = true

///////////////////////////////// refs
const formRef = ref<FormInstance>();

///////////////////////////////// lifecycle
onMounted(() => {
  $crud.reload();
});

///////////////////////////////// hooks
onHook(CRUD.HOOK.AFTER_DETAILS,async (crud:CRUD,rs:any)=>{
  console.log('App',rs.data,Date.now());
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log('App',rs.data,Date.now());
})

onHook(CRUD.HOOK.ON_VALIDATE,(crud,isvalid,invalidFields)=>{
  console.log(isvalid,invalidFields)
})

///////////////////////////////// methods

function getTitle() {
  if ($crud.formStatus == 1) return '新增';
  if ($crud.formStatus == 2) return '编辑';
}

function toDelete(row) {
  ElMessageBox.confirm('确认删除?', 'Warning', {
    type: 'warning',
  }).then(() => {
    $crud.toDelete(row);
  });
}

const customValidator = {
    validate:()=>Promise.reject(false)
  }
</script>

<template>
  <header>
    <el-input
      clearable
      placeholder="文本模糊查询"
      style="width: 200px"
      v-model="$crud.query.keyword"
      @keydown.enter="$crud.reload()"
      @clear="$crud.reload()"
    ></el-input>
    <el-button @click="$crud.reload()">查询</el-button>
    <el-button type="primary" @click="$crud.toAdd()">新增</el-button>
  </header>
  <main>
    <el-table
      :data="$crud.table.data"
      style="width: 100%"
      rowKey="id"
      @sort-change="(o) => $crud.changeOrder(o)"
      @row-click="(row)=>$crud.toView(row)"
    >
      <el-table-column prop="uname" label="uname" width="180" />
      <el-table-column
        prop="email"
        label="email"
        width="180"
        sortable="custom"
      />
      <el-table-column prop="ip" label="ip" />
      <el-table-column align="right">
        <template #default="{ row }">
          <el-button size="small" @click="$crud.toEdit(row)"  @click.stop>
            <div v-if="!!$crud.snapshots[row.id]" style="display: inline-block;background-color: gold;width: 8px;height: 8px;overflow: hidden;border-radius: 8px;border: 1px solid;"></div>
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="toDelete(row)" @click.stop>
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <CrudaPagination></CrudaPagination>
  </footer>

  <el-dialog :title="getTitle()" v-model="showDialog" width="30%">
    <!-- 表单通常要放在单独组件中，否则容易引起非必要重绘导致UI卡顿 -->
    <el-form
      ref="formRef"
      :rules="rules"
      :model="$crud.form"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="uname">
        <el-input v-model="$crud.form.uname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="$crud.form.email"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$crud.cancel()">取 消</el-button>
        <el-button type="primary" @click="$crud.submitForm(formRef!)">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <ViewV />
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
