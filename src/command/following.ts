import { $axios } from './index';
import { createFile, saveData_dev } from '../utils';
const table = require('markdown-table');

function getAPI(username: string) {
  const url = `https://api.github.com/users/${username}/following`;
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
  let folling_obj: any = [];
  let tableArr: any = [['Avatar', 'UserName', 'Repos_url']];
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
          getAvatorImg(star.avatar_url, star.login),
          `[${star.login}](${star.html_url})`,
          star.repos_url,
        ]);
        folling_obj.push({
          name: star.login,
          url: star.html_url,
          repos_url: star.repos_url,
          avatar_url: star.avatar_url,
        });
      }
      // console.log(folling_obj);
      const content = table(tableArr, {
        align: ['c', 'c', 'l'],
      });
      createFile('docs/', 'Following.md', content);
      saveData_dev(folling_obj, 'following.json');
    },
  );
}

const exportGithubUserFolling = (githubUsername: string) => {
  getAPI(githubUsername);
};

export { exportGithubUserFolling };
