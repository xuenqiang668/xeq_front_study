import axios from './Axios';
import CancelToken from './CancelToken';
import { AxiosConfig } from './config/defaults';

const service = axios.createInstance({
  baseURL: "http://localhost:9000"
});


// 添加请求拦截器
service.interceptors.request.use((config: AxiosConfig) => {
  config.headers.test = 'A';
  config.headers.check = 'B';
  return config;
});

// 添加响应拦截器
service.interceptors.response.use((response: any) => ({ data: response.data, config: response.config }));


(async () => {
  const source = CancelToken.source();
  setTimeout(() => {
    source.cancel('Operation canceled by the user.');
  }, 10);

  try{
    const reply = await service.get('/list', {
      cancelToken: source.token
    });
    console.log(reply);
    console.log(reply.data);
  }catch(error: any) {
    // console.log(error.name, "CancelError");
    console.log(source.token);
    

    if(error.name === "CancelError") {
      
      console.log('request is cancel.............');
    }
  }
})();



