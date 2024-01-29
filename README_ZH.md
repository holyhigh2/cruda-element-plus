# cruda-element-plus
Cruda element-plus适配器。

## Demo
- [element-plus](https://stackblitz.com/edit/cruda-element-plus?file=src%2FApp.vue)

## 使用
### 1. 安装
```js
// 安装CRUD
import request from 'axios'
import CRUD from 'cruda-element-plus'
//通常request总是会使用封装后的axios实例
createApp(App).use(CRUD, { request: request })
```
### 2. 激活
```html
<script lang="ts" setup>
  import { useCrud } from 'cruda-element-plus'
  //通过useCrud函数获取$crud实例
  //对象方式激活时与element-ui行为一致
  const $crud = useCrud('/api/single')

  //自动加载
  onMounted(() => {
    $crud.reload()
  })
</script>
```
### 3. 多实例
```html
<script lang="ts" setup>
  import { useCruds } from 'cruda-element-plus'
  //通过useCruds函数获取$cruds实例
  const $cruds = useCruds({
    t1: '/api/single',
    t2: {
      url: '/api/multiple',
    },
  })

  //自动加载t1
  onMounted(() => {
    $cruds.t1.reload()
  })
</script>
```
```html
<script lang="ts" setup>
  import { useCruds } from 'cruda-element-plus'
  //对于同一地址，不同参数的使用场景（如分类列表）可使用默认查询参数
  const $cruds = useCruds({
    t1: {
      url:'/api/single',
      query:{type:'1'}
    },
    t2: {
      url: '/api/single',
      query:{type:'2'}
    },
  })

  //自动加载t1并附加type=1的查询参数
  onMounted(() => {
    //查询接口的相同参数会被覆盖
    $cruds.t1.reload({type:3})
  })
</script>
```
### 4. HOOK
```html
<script lang="ts" setup>
  import CRUD, { onHook } from 'cruda-element-plus'

  const $crud = useCrud()

  //使用onHook函数进行钩子注册
  onHook(CRUD.HOOK.AFTER_SUBMIT, (crud) => {
    ElNotification.success('提交成功')
    crud.toQuery()
  })
</script>
```
### 5. 自定义组件
自定义组件的核心是封装 crud 页面的数据及操作，比如 CrudTable，而前提就是获取$crud实例。通过`lookUpCrud`方法可以拿到页面入口的$crud 实例。下面以一个查询框为例展示自定义组件需要关注的几个方面

```html
<template>
  <el-table :data="$crud.table.data" @sort-change="(o) => $crud.changeOrder(o)">
    <el-table-column prop="uname" label="uname" width="180" />
    <el-table-column prop="email" label="email" width="180" sortable="custom" />
    <el-table-column prop="ip" label="ip" />
    <el-table-column align="right">
      <template #default="{ row }">
        <el-button size="small" @click="$crud.toEdit(row)">Edit</el-button>
        <el-button size="small" type="danger" @click="toDelete(row)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
  import { lookUpCrud } from 'cruda-element-plus'
  //element-plus的lookUpCrud函数只有一个可选入参`crudName`
  const $crud = lookUpCrud()

  //自定义组件封装删除逻辑
  function toDelete(row: Record<string, any>) {
    ElMessageBox.confirm('确认删除?').then(() => {
      $crud.toDelete(row)
    })
  }
</script>
```
### 6. URL 参数
CRUD 激活时，REST 地址支持 URL 参数来动态构建。通过 **`:varName`** 来声明变量，如下例

```js
//user实例的地址使用了orgId参数
export default {
  cruds: {
    org: '/api/orgs',
    user: '/api/orgs/:orgId/users'
  },
  ...
  methods:{
    //切换org时调用该方法
    setOrg(orgId){
      this.$cruds.user.setURLParams({orgId})
      this.$cruds.user.toQuery()
    }
  }
}
```

如你所见，动态 URL 最典型的使用场景就是关联业务(_当然，非动态 URL 也可实现相同功能_)。通过`setURLParams`方法可以动态修改请求地址，之后进行 C/R/U/D 操作

## 可导出

```js
import CRUD,{...} from 'cruda-element-plus'
```

- useCrud(restURL) : CRUD
  > 创建一个 crud 单实例入口并返回
- useCruds(restURLMap) : Record<string, CRUD>
  > 创建一个 crud 多实例入口并返回
- lookUpCrud(crudName?) : CRUD | null 
  > 向上查找最近的 crud 实例
- onHook(hookName,hook) : void
  > 用于注册钩子

## Cruda
CRUD相关API请前往[Cruda](https://github.com/holyhigh2/cruda)
