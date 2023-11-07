<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { FormInstance, ElMessageBox, ElNotification } from 'element-plus';
import CRUD, { onHook, useCruds } from 'cruda-element-plus';
import CrudaPagination from './components/CrudaPagination.vue';
import ViewV from './View.vue';

///////////////////////////////// data
const rules = reactive({
  uname: [{ required: true, trigger: 'blur' }],
  email: [{ required: true, trigger: 'blur' }],
});

const showDialog1 = computed(() => {
  return $cruds.single.formStatus > 0 && $cruds.single.formStatus < 3;
});

const showDialog2 = computed(() => {
  return $cruds.multiple.formStatus > 0 && $cruds.multiple.formStatus < 3;
});

// use cruda
const $cruds = useCruds({
  single:{url:"api/single"},
    multiple:{url:"api/multiple"},
});

///////////////////////////////// refs
const formRef = ref<FormInstance>();

///////////////////////////////// lifecycle
onMounted(() => {
  $cruds.multiple.reload();
  $cruds.single.reload();
});

///////////////////////////////// hooks
onHook(CRUD.HOOK.AFTER_DETAILS,async (crud:CRUD,rs:any)=>{
  console.log('App',rs.data,Date.now());
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log('App',rs.data,Date.now());
})

///////////////////////////////// methods

function getTitle(crud:CRUD) {
  if (crud.formStatus == 1) return "新增-"+crud.key;
  if (crud.formStatus == 2) return "编辑-"+crud.key;
}

function toDelete(crud:CRUD,row:any) {
  ElMessageBox.confirm('确认删除?', 'Warning', {
    type: 'warning',
  }).then(() => {
    crud.toDelete(row);
  });
}
</script>

<template>
  <section class="left" style="flex: 1;display: flex;flex-direction: column;">
  <header>
    <el-input
      clearable
      placeholder="文本模糊查询"
      style="width: 200px"
      v-model="$cruds.single.query.keyword"
      @keydown.enter="$cruds.single.reload()"
      @clear="$cruds.single.reload()"
    ></el-input>
    <el-button @click="$cruds.single.reload()">查询</el-button>
    <el-button type="primary" @click="$cruds.single.toAdd()">新增</el-button>
  </header>
  <main>
    <el-table
      :data="$cruds.single.table.data"
      style="width: 100%"
      rowKey="id"
      @sort-change="(o) => $cruds.single.changeOrder(o)"
      @row-click="(row)=>$cruds.single.toView(row)"
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
          <el-button size="small" @click="$cruds.single.toEdit(row)"  @click.stop>
            <div v-if="!!$cruds.single.snapshots[row.id]" style="display: inline-block;background-color: gold;width: 8px;height: 8px;overflow: hidden;border-radius: 8px;border: 1px solid;"></div>
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="$cruds.single.toDelete(row)" @click.stop>
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <CrudaPagination crud="single"></CrudaPagination>
  </footer>
</section>
<hr style="    width: 100%;"/>
<section class="right" style="flex: 1;display: flex;flex-direction: column;">
  <header>
    <el-input
      clearable
      placeholder="文本模糊查询"
      style="width: 200px"
      v-model="$cruds.multiple.query.keyword"
      @keydown.enter="$cruds.multiple.reload()"
      @clear="$cruds.multiple.reload()"
    ></el-input>
    <el-button @click="$cruds.multiple.reload()">查询</el-button>
    <el-button type="primary" @click="$cruds.multiple.toAdd()">新增</el-button>
  </header>
  <main>
    <el-table
      :data="$cruds.multiple.table.data"
      style="width: 100%"
      rowKey="id"
      @sort-change="(o) => $cruds.multiple.changeOrder(o)"
      @row-click="(row)=>$cruds.multiple.toView(row)"
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
          <el-button size="small" @click="$cruds.multiple.toEdit(row)"  @click.stop>
            <div v-if="!!$cruds.multiple.snapshots[row.id]" style="display: inline-block;background-color: gold;width: 8px;height: 8px;overflow: hidden;border-radius: 8px;border: 1px solid;"></div>
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="toDelete($cruds.multiple,row)" @click.stop>
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <CrudaPagination crud="multiple"></CrudaPagination>
  </footer>
</section>

  <el-dialog :title="getTitle($cruds.single)" v-model="showDialog1" width="30%">
    <!-- 表单通常要放在单独组件中，否则容易引起非必要重绘导致UI卡顿 -->
    <el-form
      ref="formRef"
      :rules="rules"
      :model="$cruds.single.form"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="uname">
        <el-input v-model="$cruds.single.form.uname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="$cruds.single.form.email"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$cruds.single.cancel()">取 消</el-button>
        <el-button type="primary" @click="$cruds.single.submit(formRef)">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog :title="getTitle($cruds.multiple)" v-model="showDialog2" width="30%">
    <!-- 表单通常要放在单独组件中，否则容易引起非必要重绘导致UI卡顿 -->
    <el-form
      ref="formRef"
      :rules="rules"
      :model="$cruds.multiple.form"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="uname">
        <el-input v-model="$cruds.multiple.form.uname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="$cruds.multiple.form.email"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$cruds.multiple.cancel()">取 消</el-button>
        <el-button type="primary" @click="$cruds.multiple.submit(formRef)">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <ViewV crud="single"/>
  <ViewV crud="multiple"/>
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
</style>
