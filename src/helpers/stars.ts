import { $axios } from './index';
import { saveData_dev, createFile } from '../utils';
const config = require('../config/config.json');
const table = require('markdown-table');

// 博客主页地址
let github_url = config.github.homepage;
const username = github_url.slice(github_url.lastIndexOf('/') + 1);

const api = `https://api.github.com/users/${username}/starred`;

function getAPI(url: string) {
  $axios
    .get(url)
    .then((result: any) => {
      getResult(getPageRequestList(result.headers.link));
    })
    .catch((err: any) => {
      console.log(err);
    });
}

function getPageRequestList(str: string) {
  let lastPage = str
    .match(/<(.+?)>/g)[1]
    .slice(1, -1)
    .split('=');
  let result = [];
  let href = lastPage[0];
  for (let i = 1; i <= Number(lastPage[1]); i++) {
    result.push(href + '=' + i);
  }
  return result;
}

function getResult(fetchList: string[]) {
  let obj: any = [];
  let stars_obj: any = [];
  let tableArr: any = [['Avatar', 'Repo', 'Description']];
  let getAvatorImg = (src: string, name: string) => {
    return `<img class="avatar ghh-user-x tooltipstered" height="50" width="50" alt="${name}" src="${src}" style="box-shadow: transparent 0px 0px;">`;
  };
  return Promise.all(fetchList.map(url => $axios.get(url))).then(
    (...res: any) => {
      let stars = res[0];
      for (let m = 0; m < stars.length; m++) {
        obj = obj.concat(stars[m].data);
      }
      console.log(`${obj.length}条数据--------------`);
      for (let n = 0; n < obj.length; n++) {
        let star = obj[n];
        tableArr.push([
          getAvatorImg(star.owner.avatar_url, star.owner.login),
          `[${star.name}](${star.html_url})`,
          star.description,
        ]);
        stars_obj.push({
          name: star.name,
          full_name: star.full_name,
          url: star.html_url,
          owner: star.owner.login,
          avatar_url: star.owner.avatar_url,
          description: star.description,
          forks_count: star.forks_count,
          stars_count: star.stargazers_count,
          language: star.language,
        });
      }
      // console.log(stars_obj);
      const content = table(tableArr, {
        align: ['c', 'c', 'l'],
      });
      createFile('docs/', 'stars.md', content);

      saveData_dev(stars_obj, 'stars.json');
    },
  );
}

getAPI(api);
