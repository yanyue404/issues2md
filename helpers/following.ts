import { axios, cheerio } from './index';
import { saveData_dev, check_npm_argv } from '../src/utils';
import { Api } from '../src/type';

// 博客主页地址
let blog_url = 'https://github.com/yanyue404';

function getAPI(url: string) {
  return axios
    .get(url + '?tab=following')
    .then(function(response: any) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array: any = [];
      $('.float-md-left .position-relative .table-fixed').each(function() {
        let obj: any = {};
        // 头像
        obj.avatar = $(this)
          .find('.d-inline-block')
          .html();
        // 图片地址
        obj.avatarUrl = $(this)
          .find('.avatar')
          .attr('src');
        // github 显示用户名
        obj.displayName = $(this)
          .find('.link-gray-dark')
          .text()
          .trimStart()
          .trimEnd();
        // 团队组织
        obj.organization = $(this)
          .find('.mr-3')
          .text()
          .trimStart()
          .trimEnd();
        // github地址
        obj.github =
          `https://github.com` +
          $(this)
            .find('.no-underline')
            .attr('href');
        // 简介
        obj.porfile = $(this)
          .find('div.text-gray')
          .text()
          .trimStart()
          .trimEnd();
        // 地址
        obj.address = $(this)
          .find('p.text-gray')
          .text()
          .trimStart()
          .trimEnd();

        list_array.push(obj);
      });
      return list_array;
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

getAPI(blog_url).then((html: any) => {
  console.log(html);
  saveData_dev(html, 'following.json');
});
