const fs = require('fs');
const config = require('../../config/config.json');
//  数据保存 至 /data/api.json
export const saveData_dev = (data: any) => {
  const content = JSON.stringify(data);
  if (fs.existsSync('data/')) {
    fs.writeFile('data/' + 'api.json', content, (err: any) => {
      if (err) throw err;
      console.log('Api.json saved successful!');
    });
  }
};

export const addZero = (num: any, length: any) => {
  return (Array(length).join('0') + num).slice(-length);
};

export const createMarkdownFile = (
  fileName: string,
  content: string,
  issuesID: string,
) => {
  const exportByYear = config.year;
  const fileDirectory = exportByYear
    ? config.folder + '/' + fileName.slice(0, 4) + '/'
    : config.folder + '/';

  // 判断文件夹路径是否存在
  if (fs.existsSync(fileDirectory)) {
    fs.writeFile(fileDirectory + fileName + '.md', content, (err: any) => {
      if (err) throw err;
      console.log(
        'Markdown - ' +
          addZero(issuesID, 3) +
          ' - ' +
          fileName +
          ' export successful! ',
      );
    });
  } else {
    fs.mkdir(fileDirectory, { recursive: true }, (err: any) => {
      if (err) throw err;
      fs.writeFile(fileDirectory + fileName + '.md', content, (err: any) => {
        if (err) throw err;
        console.log(
          'Markdown - ' +
            addZero(issuesID, 3) +
            ' - ' +
            fileName +
            ' export successful! [mkdir]',
        );
      });
    });
  }
};
