import defaultConfig from './config/defaults'
import { dispatchRequest} from './request'
import InterceptorManager from './InterceptorManager';


type AxiosConfig = {
    url: string;
    method: string;
    baseURL: string;
    headers: {[key: string]: string};
    params: {};
    data: {};
    adapter: Function;
    cancelToken?: number;
}
  
class Axios {
  public defaults: AxiosConfig;
  public createInstance!: Function;
  public interceptors: {
    request: InterceptorManager;
    response: InterceptorManager;
  }

  constructor(config: AxiosConfig) {
    this.defaults = config;
    this.createInstance = (cfg: AxiosConfig) => {
      return new Axios({ ...config, ...cfg });
    };

    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  public request(configOrUrl: AxiosConfig | string, config?: AxiosConfig) {
    if(typeof configOrUrl === 'string') {
      config!.url = configOrUrl
    }else {
      config = configOrUrl
    }

    const cfg = {...this.defaults, ...config}
      // 将拦截器与真实请求合并在一个数组内
    const requestInterceptors = this.interceptors.request.getAll();
    const responseInterceptors = this.interceptors.response.getAll();
    const handlers = [...requestInterceptors, dispatchRequest, ...responseInterceptors];

    // 使用 Promise 将数组串联调用
    let promise = Promise.resolve(cfg);
    while (handlers.length) {
      promise = promise.then(handlers.shift() as any);
    }

    return promise
  }


  public get(configOrUrl: AxiosConfig | string, config?: AxiosConfig) {
    return this.request(configOrUrl, {...(config || {} as any), method: 'get'});
  }
}

const defaultAxios = new Axios(defaultConfig);

export default defaultAxios;