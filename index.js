const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
const express = require("express");
var TurndownService = require("turndown");
var markdown = require("markdown-js");
const app = express();
var turndownService = new TurndownService();

function getData(time, language) {
  let url = "https://github.com/yanyue404/blog/issues/1"; // 拼接请求的页面链接
  return axios
    .get(url)
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      // console.log($("table").html());
      var content = turndownService.turndown($("table").html());
      console.log(content);
      fs.writeFile("./test/git入门与实践.md", content, err => {
        if (err) throw err;
        console.log("It's saved!");
      });
      return Promise.resolve(content);
    })
    .catch(function(error) {
      console.log(error);
    });
}

app.get("/", (req, res) => {
  let promise = getData("daily"); // 发起抓取
  promise.then(response => {
    //markdown.markHtml(); 是将markdown格式的字符转换成Html
    var html = markdown.makeHtml(response);
    res.send(html);
    res.end();
  });
});

app.listen(3000, () => console.log("Listening on port 3000!")); // 监听3000端口
