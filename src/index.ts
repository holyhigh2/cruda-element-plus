/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * element-plus专用接口
 * @author holyhigh
 */
import { closest } from "myfx/tree";
import { each, size } from "myfx/collection";
import { noop } from "myfx/utils";
import { App, getCurrentInstance, reactive, watch } from "vue";
import CRUD, {
  crudError,
  RestUrl,
  _newCrud,
  _newCruds,
  _onHook,
  _setUpdater,
  _setSnapshot,
  FormValidator,
  callHook,
} from "cruda";
import * as packageInfo from "../package.json";
import { isArrayLike, set } from "myfx";

set(
  CRUD.prototype,
  "submitForm",
  async function (
    form:
      | FormValidator
      | FormValidator[]
      | (() => Promise<FormValidator | FormValidator[]>),
    ...args: unknown[]
  ): Promise<unknown> {
    let validators = form;
    if (form instanceof Function) {
      validators = await form();
    } else {
      validators = form;
    }
    if (!isArrayLike(validators)) {
      validators = [validators];
    }

    const invalidBreak = this.invalidBreak;

    let invalidFields = [];
    let isValid = true;
    for (let i = 0; i < validators.length; i++) {
      try {
        await validators[i].validate(...args);
      } catch (error) {
        isValid = false;
        invalidFields.push(error);
        if (invalidBreak) {
          break;
        }
      }
    }

    callHook(CRUD.HOOK.ON_VALIDATE, this, isValid, invalidFields);

    if (size(invalidFields) > 0) {
      return Promise.reject(invalidFields);
    }

    return this.submit(...args);
  }
);

function watchCrud(crudInstances: CRUD | Record<string, CRUD>) {
  if (crudInstances instanceof CRUD) {
    watch(
      () => crudInstances.form,
      (nv: any, ov: any) => {
        if (!crudInstances.recoverable) return;
        if (crudInstances.formStatus !== 1 && crudInstances.formStatus !== 2) {
          return;
        }

        _setSnapshot(crudInstances, nv);
      },
      { deep: true }
    );
  } else {
    each(crudInstances, (crud, k) => {
      watch(
        () => crud.form,
        (nv: any) => {
          if (!crud.recoverable) return;
          if (crud.formStatus !== 1 && crud.formStatus !== 2) {
            return;
          }

          _setSnapshot(crud, nv);
        },
        { deep: true }
      );
    });
  }

  return crudInstances;
}

/**
 * 创建一个crud单实例入口并返回
 * @param {string | RestUrl} restURL url字符串或包含url属性的配置对象
 * @return {CRUD} $crud
 */
export function useCrud(restURL: string | RestUrl): CRUD {
  const vm = getCurrentInstance();
  const $crud = watchCrud(
    reactive(_newCrud(restURL, vm as Record<string, any>)) as CRUD
  );

  //crud入口标识
  if (vm) {
    (vm as any).$isCrudEntry = true;
  }
  if ($crud !== (vm as any).__crud_) {
    (vm as any).__crud_ = $crud;
  }

  return $crud as CRUD;
}

/**
 * 创建一个crud多实例入口并返回
 * @param {Record<string,string | RestUrl>} restURL 明确指定实例key的url配置信息
 * @return {Record<string,CRUD>} $cruds
 */
export function useCruds(
  restURL: Record<string, string | RestUrl>
): Record<string, CRUD> {
  const vm = getCurrentInstance();
  let $cruds: Record<string, CRUD> = reactive(
    _newCruds(restURL, vm as Record<string, any>)
  );
  $cruds = watchCrud($cruds) as Record<string, CRUD>;

  //crud入口标识
  if (vm) {
    (vm as any).$isCrudEntry = true;
  }

  if ($cruds !== (vm as any).__cruds_) {
    (vm as any).__cruds_ = $cruds;
  }

  return $cruds;
}

/**
 * 用于注册钩子
 * @param {string} hookName 钩子名称
 * @param {Function} hook 回调函数
 * @returns 移除钩子的函数
 */
export function onHook(
  hookName: string,
  hook: (crud: CRUD, ...args: any[]) => void
): () => void {
  const vm = getCurrentInstance();
  let crudVM = closest(
    vm as any,
    (node: Record<any, any>) => !!node.__crud_nid_,
    "parent"
  );
  if (!crudVM) return noop;
  return _onHook(crudVM.__crud_nid_, hookName, hook, vm as Record<string, any>);
}

/**
 * 用于自定义组件向上查找最近的$crud并返回。用于自定义组件封装crud逻辑
 * @param {string} [crudName] 如果使用了cruds就必须指定crudName
 * @return {CRUD | null} $crud 向上查找最近的crud实例或null
 */
export function lookUpCrud(crudName?: string): CRUD | null {
  let vm = getCurrentInstance();
  let crudVM = closest(
    vm as any,
    (node: Record<any, any>) => !!node.__crud_nid_,
    "parent"
  );
  if (!crudVM) return crudVM;

  if (crudVM.__cruds_) {
    if (!crudName) {
      crudError(`Must specify 'crudName' when multiple instances detected`);
      return null;
    }
    return crudVM.__cruds_[crudName];
  }

  return crudVM.__crud_;
}

export function install(app: App, options: Record<string, any>) {
  if (!options.request) {
    crudError("Cannot find [request] in the installation options");
  }
  CRUD.request = options.request;

  _setUpdater((form: Record<string, any>, props: Record<string, any>) => {
    each<any, string>(props, (v, k) => {
      form[k] = v;
    });
  });

  // welcome info
  const ssAry: string[] = [];
  ["220,235,153", "179,208,75", "153,189,37"].forEach((v, i) => {
    const cu = "background:rgb(" + v + ");";
    if (i < 2) {
      ssAry[i] = ssAry[5 - 1 - i] = cu;
    } else {
      ssAry[i] = "color:#fff;" + cu;
    }
  });
  console.info(
    `%c %c %c Cruda/element-plus - ${packageInfo.description} | v${packageInfo.version} %c %c `,
    ...ssAry,
    "\u{1F4E6} https://github.com/holyhigh2/cruda-element-plus"
  );
}
export const HOOK = CRUD.HOOK;
export const RESTAPI = CRUD.RESTAPI;
export const defaults = CRUD.defaults;
export const xApi = CRUD.xApi;

CRUD.install = install;

export default CRUD;
