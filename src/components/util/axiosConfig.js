 import axios from 'axios' //

 // http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
    config => {
        /* console.log(JSON.stringify(11111111111));
        if (token) { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.Authorization = token;
        } */
        return config;
    },
    err => {
        return Promise.reject(err); //请求错误时，直接结束
        //return Promise.resolve(err);//请求错误时，不会直接结束，将会继续传到then里面,无论请求成功还是失败，在成功的回调中都能收到通知

    });
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    err.message = '请求错误(400)';
                    break;
                case 401:
                    // 这里写清除token的代码
                    err.message = '未授权，请重新登录(401)';
                    router.replace({
                        path: 'login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        } //登录成功后跳入浏览的当前页面
                    })

                    break;
                case 403:
                    err.message = '拒绝访问(403)';
                    break;
                case 404:
                    err.message = `请求出错(404)`;
                    break;
                case 408:
                    err.message = '请求超时(408)';
                    break;
                case 500:
                    err.message = '服务器错误(500)';
                    break;
                case 501:
                    err.message = '服务未实现(501)';
                    break;
                case 502:
                    err.message = '网络错误(502)';
                    break;
                case 503:
                    err.message = '服务不可用(503)';
                    break;
                case 504:
                    err.message = '网络超时(504)';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持(505)';
                    break;
                default:
                    err.message = `连接出错(${err.response.status})!`;

            }
        }
        return Promise.reject(error) 
        //return Promise.resolve(error);//请求错误时，不会直接结束，将会继续传到then里面,无论请求成功还是失败，在成功的回调中都能收到通知

    });

export default axios
