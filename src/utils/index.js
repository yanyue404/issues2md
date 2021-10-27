const fs = require('fs');
const request = require('request');
const prettier = require('prettier');
const formatOptions = require('../../.prettierrc.js');

// * 国内代理访问 github , toc 与 articles 命令需要
// const PROXY = 'http://127.0.0.1:11181';
// * 不需要代理访问 github
const PROXY = false;

//  数据保存 至 data 文件夹
export const saveData_dev = (data, href, callback) => {
  const content = JSON.stringify(data);
  const dir = 'docs/json/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  fs.writeFile('docs/json/' + href, content, err => {
    if (err) throw err;
    callback && callback();
    console.log(`${href} saved successful!`);
  });
};

export const addZero = (num, length) => {
  return (Array(length).join('0') + num).slice(-length);
};

export const createFile = (fileDirectory, fileName, content) => {
  // 判断文件夹路径是否存在
  if (fs.existsSync(fileDirectory)) {
    fs.writeFile(fileDirectory + fileName, content, err => {
      if (err) throw err;
      console.log(fileName + ' export successful! ');
    });
  } else {
    fs.mkdir(fileDirectory, { recursive: true }, err => {
      if (err) throw err;
      fs.writeFile(fileDirectory + fileName + '.md', content, err => {
        if (err) throw err;
        console.log(fileName + ' export successful! [mkdir]');
      });
    });
  }
};

export const formatMarkdown = markdown => {
  return prettier.format(
    markdown,
    Object.assign(Object.assign({}, formatOptions), { parser: 'markdown' }),
  );
};

export const githubToken = token => {
  return Buffer.from(token, 'base64').toString();
};

// 如何 api 请求墙外网址 https://cnodejs.org/topic/5af24e62adea947348e761ec
// https://www.npmjs.com/package/request
export const fetch = (url, config = {}) => {
  const options = {
    uri: url,
    method: 'GET',
    timeout: 30, // 30s 连接超时
  };

  PROXY && Object.assign(options, { proxy: PROXY });

  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      if (!err) {
        resolve(body);
      } else {
        reject(err);
        console.error('error:', error); // Print the error if one occurred
      }
    });
  });
};
