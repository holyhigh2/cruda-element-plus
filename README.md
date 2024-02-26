# cruda-element-plus
A Cruda adapter for element-plus.

## Demo
- [element-plus](https://stackblitz.com/edit/cruda-element-plus?file=src%2FApp.vue)

## Usage
### 1. Install
```js
// Usually init cruda in main.js
import request from 'axios'
import CRUD from 'cruda-element-plus'
// set requester
createApp(App).use(CRUD, { request: request })
```
### 2. Activate
```html
<script lang="ts" setup>
  import { useCrud } from 'cruda-element-plus'
  //通过useCrud函数获取$crud实例
  //对象方式激活时与element-ui行为一致
  const $crud = useCrud('/api/single')
  
  //Reload on mounted 
  onMounted(() => {
    $crud.reload()
  })
</script>
```
You can pass custom parameters to Cruda besides the URL when you activate it in object form

```js
const $crud = useCrud({url:'/api/single',permission:'a_b_c'}) object way
```

then you can read it via `params`

```js
this.$crud.params.permission
```

that's very useful if you want to do additional UI control like Auth

### 3. Multi-instance
```html
<script lang="ts" setup>
  import { useCruds } from 'cruda-element-plus'
  const $cruds = useCruds({
    t1: '/api/single',
    t2: {
      url: '/api/multiple',
    },
  })

  //Reload instance 't1' on mounted 
  onMounted(() => {
    $cruds.t1.reload()
  })
</script>
```
```html
<script lang="ts" setup>
  import { useCruds } from 'cruda-element-plus'
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

  //Reload instance 't1' with '?type=1' on mounted 
  onMounted(() => {
    //Same paramters will merged into query string
    $cruds.t1.reload({type:3})
  })
</script>
```
### 4. HOOK
```html
<script lang="ts" setup>
  import CRUD, { onHook } from 'cruda-element-plus'

  const $crud = useCrud()

  onHook(CRUD.HOOK.AFTER_SUBMIT, (crud) => {
    ElNotification.success('提交成功')
    crud.toQuery()
  })
</script>
```
### 5. CRUD component
The first thing you create a CRUD component is to get `$crud`. Use `lookUpCrud()` to get that then you can do other business like do queries, toggle views and so on

```html
<template>
  <el-table :data="$crud.table.data" @sort-change="(o) => $crud.changeSort(o)">
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
  // In element-plus, the lookUpCrud has only one optional argument `crudName`
  const $crud = lookUpCrud()

  function toDelete(row: Record<string, any>) {
    ElMessageBox.confirm('确认删除?').then(() => {
      $crud.toDelete(row)
    })
  }
</script>
```
### 6. URL params
Cruda supports URL param by **`:varName`** which makes you can build dynamic URLs. See below 

```html
<script lang="ts" setup>
  import { useCruds } from 'cruda-element-plus'
  const $cruds = useCruds({
    org: '/api/orgs',
    //param 'orgId' is used in 'user' instance
    user: '/api/orgs/:orgId/users'
  })

  //fill the param
  function setOrg(orgId){
    this.$cruds.user.setURLParams({orgId})
    this.$cruds.user.toQuery()
  }
</script>
```

## Exportable

```js
import CRUD,{...} from 'cruda-element-plus'
```

- useCrud(restURL) : CRUD
  > return a single instance 
- useCruds(restURLMap) : Record<string, CRUD>
  > return a multi instance map 
- lookUpCrud(crudName?) : CRUD | null
  > look up the nearest crud instance then return
- onHook(hookName,hook) : void
  > register a hook

## Cruda
CRUD API please to [Cruda](https://github.com/holyhigh2/cruda)
