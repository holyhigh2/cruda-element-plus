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

let cacheKeySingle = 'cruda-demo-element-plus-single'
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

// const singleTableData = fc.map<any, any, Record>(fc.range(0, 34), () => {
//   return {
//     id: Random.guid(),
//     email: Random.email(),
//     uname: Random.cname(),
//     ip: Random.ip(),
//     domain: Random.domain(),
//   };
// });

const multiTableData = fc.map<any, any, Record>(fc.range(0, 14), () => {
  return {
    id: Random.guid(),
    email: Random.email(),
    uname: Random.cname(),
    ip: Random.ip(),
    domain: Random.domain(),
  };
});
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

Mock.mock(/api\/multi/, 'get', function (options: any) {
  return { rows: multiTableData, total: multiTableData.length };
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
