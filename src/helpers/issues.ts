import { $axios } from './index';
import { createFile, saveData_dev } from '../utils';
const table = require('markdown-table');

function getAPI(url: string) {
  $axios.get(url).then((result: any) => {
    console.log(result.data.length);
    console.log(result.headers.link);
    getResult(getPageRequestList(result.headers.link));
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
  let issues_obj: any = [];
  let tableArr: any = [['Avatar', 'UserName', 'Repos_url']];
  let getAvatorImg = (src: string, name: string) => {
    return `<img class="avatar ghh-user-x tooltipstered" height="50" width="50" alt="${name}" src="${src}" style="box-shadow: transparent 0px 0px;">`;
  };
  return Promise.all(fetchList.map(url => $axios.get(url))).then(
    (...res: any) => {
      let issues = res[0];
      for (let m = 0; m < issues.length; m++) {
        obj = obj.concat(issues[m].data);
      }
      for (let n = 0; n < obj.length; n++) {
        let issue_simgle = obj[n];
        console.log(issue_simgle);

        // tableArr.push([
        //   getAvatorImg(issue_simgle.avatar_url, issue_simgle.login),
        //   `[${issue_simgle.login}](${issue_simgle.html_url})`,
        //   issue_simgle.repos_url,
        // ]);
        issues_obj.push({
          id: issue_simgle.number,
          title: issue_simgle.title,
          labels: issue_simgle.labels[0].name,
          created_at: issue_simgle.created_at,
          updated_at: issue_simgle.updated_at,
          body_html: issue_simgle.body_html,
        });
      }
      // console.log(issues_obj);
      // const content = table(tableArr, {
      //   align: ['c', 'c', 'l'],
      // });
      // createFile('docs/', 'following.md', content);

      saveData_dev(issues_obj, 'issues.json');
    },
  );
}

getAPI('https://api.github.com/repos/yanyue404/blog/issues');
