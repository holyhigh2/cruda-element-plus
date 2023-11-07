import * as fc from 'myfx';
import * as qs from 'qs';
import Mock from 'mockjs';

type Record = {
  id: string;
  email: string;
  uname: string;
  ip: string;
  domain: string;
};


const Random = Mock.Random;

let cacheKeySingle = 'cruda-demo-element-ui-multiple_single'
let singleCache = localStorage.getItem(cacheKeySingle)
const singleTableData = singleCache?JSON.parse(singleCache):fc.map(fc.range(0, 34), () => {
  return {
    id: Random.guid(),
    email: Random.email(),
    uname: Random.cname(),
    ip: Random.ip(),
    domain: Random.domain()
  }
})
localStorage.setItem(cacheKeySingle,JSON.stringify(singleTableData))

let cacheKeyMultiple = 'cruda-demo-element-ui-multiple_multiple'
let multipleCache = localStorage.getItem(cacheKeyMultiple)
const multipleTableData = multipleCache?JSON.parse(multipleCache):fc.map(fc.range(0, 34), () => {
  return {
    id: Random.guid(),
    email: Random.email(),
    uname: Random.cname(),
    ip: Random.ip(),
    domain: Random.domain()
  }
})
localStorage.setItem(cacheKeyMultiple,JSON.stringify(multipleTableData))

// Query
Mock.mock(/api\/single\/([a-zA-Z0-9-]+)/, 'get', function (options: any) {
  // query details
  let id = fc.last<string>(options.url.split('/'));
  id = id.split('?')[0];
  const data = fc.find(singleTableData, { id });
  return data;
});
Mock.mock(/api\/single/, 'get', function (options: any) {
  // 模拟分页
  const search = fc.substring(options.url, fc.indexOf(options.url, '?') + 1);
  const o = qs.parse(search);
  const keyword = o.keyword;

  const start = parseInt(o.pageSize) * (parseInt(o.currentPage) - 1);
  const rs = fc.slice(
    fc.filter<any>(singleTableData, (d) => {
      if (!keyword) return true;
      return (
        fc.test(d.email, keyword) ||
        fc.test(d.uname, keyword) ||
        fc.test(d.ip, keyword) ||
        fc.test(d.domain, keyword)
      );
    }),
    start,
    start + parseInt(o.pageSize)
  );

  return { rows: rs, total: singleTableData.length };
});

// Create
Mock.mock(/api\/single/, 'post', function (options: any) {
  const data = JSON.parse(options.body);
  singleTableData.push({
    id: Random.guid(),
    email: data.email,
    uname: data.uname,
    ip: Random.ip(),
    domain: Random.domain(),
  });
});

// Update
Mock.mock(/api\/single/, 'put', function (options: any) {
  const data = JSON.parse(options.body);
  const item = fc.find(singleTableData, { id: data.id })!;

  item.email = data.email;
  item.uname = data.uname;
});

// Delete
Mock.mock(/api\/single/, 'delete', function (options: any) {
  const data = JSON.parse(options.body);
  fc.remove(singleTableData, { id: data[0] });
});

/////////////////---------------------------------- multiple

// Query
Mock.mock(/api\/multiple\/([a-zA-Z0-9-]+)/, 'get', function (options: any) {
  // query details
  let id = fc.last<string>(options.url.split('/'));
  id = id.split('?')[0];
  const data = fc.find(multipleTableData, { id });
  return data;
});
Mock.mock(/api\/multiple/, 'get', function (options: any) {
  // 模拟分页
  const search = fc.substring(options.url, fc.indexOf(options.url, '?') + 1);
  const o = qs.parse(search);
  const keyword = o.keyword;

  const start = parseInt(o.pageSize) * (parseInt(o.currentPage) - 1);
  const rs = fc.slice(
    fc.filter<any>(multipleTableData, (d) => {
      if (!keyword) return true;
      return (
        fc.test(d.email, keyword) ||
        fc.test(d.uname, keyword) ||
        fc.test(d.ip, keyword) ||
        fc.test(d.domain, keyword)
      );
    }),
    start,
    start + parseInt(o.pageSize)
  );

  return { rows: rs, total: multipleTableData.length };
});

// Create
Mock.mock(/api\/multiple/, 'post', function (options: any) {
  const data = JSON.parse(options.body);
  multipleTableData.push({
    id: Random.guid(),
    email: data.email,
    uname: data.uname,
    ip: Random.ip(),
    domain: Random.domain(),
  });
});

// Update
Mock.mock(/api\/multiple/, 'put', function (options: any) {
  const data = JSON.parse(options.body);
  const item = fc.find(multipleTableData, { id: data.id })!;

  item.email = data.email;
  item.uname = data.uname;
});

// Delete
Mock.mock(/api\/multiple/, 'delete', function (options: any) {
  const data = JSON.parse(options.body);
  fc.remove(multipleTableData, { id: data[0] });
});