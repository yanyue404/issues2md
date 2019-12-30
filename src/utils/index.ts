const fs = require('fs');
const config = require('../../config/config.json');
const prettier = require('prettier');
const formatOptions = require('../../.prettierrc.js');
//  数据保存 至 /data/api.json
export const saveData_dev = (data: any, href: string) => {
  const content = JSON.stringify(data);
  if (fs.existsSync('data/')) {
    fs.writeFile('data/' + href, content, (err: any) => {
      if (err) throw err;
      console.log(`${href} saved successful!`);
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

export const formatMarkdown = (markdown: string) => {
  return prettier.format(markdown, { ...formatOptions, parser: 'markdown' });
};

// 命令行传参校验支持
export const check_npm_argv = (
  command: string,
  defaultVariable: string,
  typeErrorToast: string,
) => {
  const npm_argv = JSON.parse(process.env.npm_config_argv);
  if (!(npm_argv && npm_argv.original instanceof Array)) {
    throw TypeError('npm argv Error'); // 异常的抛出会终止log:issues命令
  }
  if (npm_argv.original[0] === command) {
    if (
      npm_argv.original[1] &&
      npm_argv.original[1].indexOf('https://github.com/') !== -1
    ) {
      // 使用命令行传过来的 blog 地址链接参数
      defaultVariable = npm_argv.original[1];
    } else if (npm_argv.original[1]) {
      throw TypeError(typeErrorToast);
    }
  }
};
