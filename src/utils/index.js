const fs = require('fs');
const prettier = require('prettier');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const formatOptions = require('../../.prettierrc.js');

// Convert HTML into Markdown with JavaScript.
// Usage: var markdown = turndownService.turndown('<h1>Hello world!</h1>')
export const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

// 使用 GitHub Flavored Markdown Spec https://github.github.com/gfm/#introduction
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

export const prettierFormatMarkdown = markdown => {
  return prettier.format(
    markdown,
    Object.assign(Object.assign({}, formatOptions), { parser: 'markdown' }),
  );
};

//  数据保存 至 db 文件夹
export const saveData_dev = (data, href, callback) => {
  const content = JSON.stringify(data);
  const dir = 'db/';
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  fs.writeFile('db/' + href, content, err => {
    if (err) throw err;
    callback && callback();
    console.log(`${href} saved successful!`);
  });
};

// 读取数据从 db 文件夹
export const readData_dev = (href, callback) => {
  let readFileURL = 'db/' + href;
  if (fs.existsSync(readFileURL)) {
    fs.readFile(readFileURL, 'utf8', function(err, data) {
      if (err) console.log(err);
      callback(data);
    });
  } else {
    console.log('not find ' + readFileURL);
  }
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
