const axios = require('axios');

// 适用于爬取 html 地址，axios 适用于 get 等请求
// 如何 api 请求墙外网址 https://cnodejs.org/topic/5af24e62adea947348e761ec
// 改进：代理使用终端代理的方式实现

export const _get = (url, config = {}) => {
  const defaultConfig = {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent': 'axios/0.18.0',
    },
    timeout: 30000, // 30s 连接超时
  };

  // 合并用户配置和默认配置
  const finalConfig = { ...defaultConfig, ...config };

  return axios
    .get(url, finalConfig)
    .then(response => {
      return response.data; // 返回响应体的数据
    })
    .catch(error => {
      console.error('[_get error]:', error); // Print the error if one occurred
      throw error; // 重新抛出错误以便调用者处理
    });
};
