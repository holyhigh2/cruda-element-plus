import { defaultTo } from "myfx/utils";
import { FormInstance, ElMessageBox, ElNotification } from "element-plus";
import CRUD from "cruda-element-plus";
// Global defaults
// export function initCRUD(CRUD: CRUD) {
CRUD.defaults.table.rowKey = "id";
CRUD.defaults.pagination.pageSize = 15;
// set the table data after query
CRUD.defaults[CRUD.HOOK.AFTER_QUERY] = function (
  crud: CRUD,
  rs: Record<any, any>
) {
  crud.pagination.total = defaultTo(parseInt(rs.data.total), 0);
  crud.table.data = defaultTo(rs.data.rows, []);
};
// show tip after submit
CRUD.defaults[CRUD.HOOK.AFTER_SUBMIT] = function (
  crud: CRUD,
  rs: Record<any, any>
) {
  ElNotification.success("submit success");
  crud.toQuery();
  crud.cancel();
};
// clear the form before add
CRUD.defaults[CRUD.HOOK.BEFORE_ADD] = function (crud: CRUD, ...args: any[]) {
  crud.form = {};
};
// fill the form before edit view is shown
CRUD.defaults[CRUD.HOOK.BEFORE_EDIT] = function (
  crud: CRUD,
  row: Record<any, any>,
  cancel: Function,
  skip: Function
) {
  console.log("before_edit", row);
  skip();
  crud.form = row;
};
CRUD.defaults[CRUD.HOOK.AFTER_DETAILS] = function (crud: CRUD, rs: any) {
  crud.form = rs.data || {};
};
// reload the table after delete
CRUD.defaults[CRUD.HOOK.AFTER_DELETE] = function (
  crud: CRUD,
  rs: Record<any, any>
) {
  ElNotification.success("delete success");
  crud.reload();
};
// }
