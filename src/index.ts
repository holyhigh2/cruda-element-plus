/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * element-plus专用接口
 * @author holyhigh
 */
import { each } from 'myfx/collection'
import { getCurrentInstance, reactive } from 'vue'
import CRUD, { crudError, RestUrl } from 'cruda'
import * as packageInfo from '../package.json'

/**
 * 创建一个crud单实例入口并返回
 * @param {string | RestUrl} restURL url字符串或包含url属性的配置对象
 * @return {CRUD} $crud
 */
export function useCrud(restURL: string | RestUrl): CRUD {
  const $crud = reactive(new CRUD(restURL))
  const vm = getCurrentInstance()
  Object.defineProperty($crud, 'vm', {
    value: vm as Record<string, any>,
    enumerable: false,
  })
  Object.defineProperty(vm, '_crud', {
    value: $crud,
    enumerable: false,
  })
  
  //crud入口标识
  if(vm){
    (vm as any).$isCrudEntry = true
  }

  return $crud as CRUD
}

/**
 * 创建一个crud多实例入口并返回
 * @param {Record<string,string | RestUrl>} restURL 明确指定实例key的url配置信息
 * @return {Record<string,CRUD>} $cruds
 */
export function useCruds(
  restURL: Record<string, string | RestUrl>
): Record<string, CRUD> {
  const $cruds: Record<string, CRUD> = {}
  const vm = getCurrentInstance()
  each(restURL, (v: RestUrl | string, k: string) => {
    const $crud = reactive(new CRUD(v))
    Object.defineProperty($crud, 'vm', {
      value: vm as Record<string, any>,
      enumerable: false,
    })

    $cruds[k] = $crud as CRUD
  })
  Object.defineProperty(vm, '_cruds', {
    value: $cruds,
    enumerable: false,
  })

  //crud入口标识
  if(vm){
    (vm as any).$isCrudEntry = true
  }

  return $cruds
}

/**
 * 用于注册钩子
 * @param {string} hookName 钩子名称
 * @param {Function} hook 回调函数
 */
export function onHook(
  hookName: string,
  hook: (crud: CRUD, ...args: any[]) => void
): void {
  const vm = getCurrentInstance()
  if (vm) {
    ;(vm as Record<string, any>)[hookName] = hook
  }
}

/**
 * 用于自定义组件向上查找最近的$crud并返回。用于自定义组件封装crud逻辑
 * @param {string} [crudName] 如果使用了cruds就必须指定crudName
 * @return {CRUD | null} $crud 向上查找最近的crud实例或null
 */
export function lookUpCrud(crudName?: string): CRUD | null {
  let parent = getCurrentInstance()
  let crud: CRUD | null = null
  while (parent) {
    let vm: Record<string, any> = parent as Record<string, any>
    if (vm['_crud']) {
      crud = vm['_crud'] as CRUD
      break
    } else if (vm['_cruds'] && crudName) {
      crud = vm['_cruds'][crudName]
      break
    }
    parent = parent.parent
  }

  return crud
}

CRUD.install = function (app, options) {
  if (!options.request) {
    crudError('Cannot find [request] in the installation options')
  }
  CRUD.request = options.request

  // welcome info
  const ssAry: string[] = []
  ;['220,235,153', '179,208,75', '153,189,37'].forEach((v, i) => {
    const cu = 'background:rgb(' + v + ');'
    if (i < 2) {
      ssAry[i] = ssAry[5 - 1 - i] = cu
    } else {
      ssAry[i] = 'color:#fff;' + cu
    }
  })
  console.info(
    `%c %c %c CRUD-vue - ${packageInfo.description} | v${packageInfo.version} %c %c `,
    ...ssAry,
    '\u{1F4E6} https://gitee.com/holyhigh2/crud-vue'
  )
}

export default CRUD
