const fs = require('fs');
const prettier = require('prettier');
const formatOptions = require('../../.prettierrc.js');

//  数据保存 至 data 文件夹
export const saveData_dev = (data: string, href: string, callback?: any) => {
  const content = JSON.stringify(data);
  const dir = 'docs/json/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  fs.writeFile('docs/json/' + href, content, (err: any) => {
    if (err) throw err;
    callback && callback();
    console.log(`${href} saved successful!`);
  });
};

export const addZero = (num: any, length: any) => {
  return (Array(length).join('0') + num).slice(-length);
};

export const createFile = (
  fileDirectory: string,
  fileName: string,
  content: string,
) => {
  // 判断文件夹路径是否存在
  if (fs.existsSync(fileDirectory)) {
    fs.writeFile(fileDirectory + fileName, content, (err: any) => {
      if (err) throw err;
      console.log(fileName + ' export successful! ');
    });
  } else {
    fs.mkdir(fileDirectory, { recursive: true }, (err: any) => {
      if (err) throw err;
      fs.writeFile(fileDirectory + fileName + '.md', content, (err: any) => {
        if (err) throw err;
        console.log(fileName + ' export successful! [mkdir]');
      });
    });
  }
};

export const formatMarkdown = (markdown: string) => {
  return prettier.format(markdown, { ...formatOptions, parser: 'markdown' });
};

export const githubToken = (token: string) => {
  return Buffer.from(token, 'base64').toString();
};
