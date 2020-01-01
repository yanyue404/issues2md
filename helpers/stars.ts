import { $axios } from './index';
import { saveData_dev } from '../src/utils';

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
  let stars_obj: any = [];
  return Promise.all(fetchList.map(url => $axios.get(url))).then(
    (...res: any) => {
      let stars = res[0];
      for (let m = 0; m < stars.length; m++) {
        obj = obj.concat(stars[m].data);
      }
      console.log(obj.length);
      for (let n = 0; n < obj.length; n++) {
        let star = obj[n];
        stars_obj.push({
          name: star.name,
          full_name: star.full_name,
          url: star.html_url,
          owner: star.owner.login,
          avatar_url: star.avatar_url,
          description: star.description,
          forks_count: star.forks_count,
          stars_count: star.stargazers_count,
          language: star.language,
        });
      }
      console.log(stars_obj);

      saveData_dev(stars_obj, 'stars.json');
    },
  );
}

getAPI('https://api.github.com/users/yanyue404/starred');

// https://segmentfault.com/q/1010000008917183
