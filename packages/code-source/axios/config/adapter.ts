import { AxiosConfig } from "./defaults";
const fetch = require('node-fetch');

// 检测是否为超链接
const getEffectiveUrl = (config: AxiosConfig) => /^http?/.test(config.url) ? config.url : config.baseURL + config.url;

// 获取 query 字符串
const getQueryStr = (config: AxiosConfig) => {
  const { params } = config;
  if (!Object.keys(params).length) return '';

  let queryStr = '';
  for (const key in params) {
    queryStr += `&${key}=${(params as any)[key]}`;
  }

  return config.url.indexOf('?') > -1 
    ? queryStr
    : '?' + queryStr.slice(1);
};

export default function getAdapter() {
    return async function(config: AxiosConfig) {
        const { method, headers, data } = config;
        let url = getEffectiveUrl(config);
        url += getQueryStr(config);



        const response = await fetch(url, {
            method,
            headers,
             // 非 GET 方法才发送 body
            body: method !== 'get' ? JSON.stringify(data) : null,
        })

        const result = {
            data: await response.json(),
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: config,
        }

        return result
    }
}