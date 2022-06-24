import router from '@/router';
import axios from 'axios'
import conf from '../config'
export function request(config) {
    const instance = axios.create({
        baseURL: conf.baseUrl, // 根路径，网关统一入口路径
        timeout: 5000 // 请求超时时间，请求达到5秒，不让请求
    })
    instance.interceptors.response.use(
        (res) => {
            let status = res.data.meta.status;
            if (status == 401 || status == 403) {
                console.log('由于token失效被拦截: 状态', status);
                router.push({ path: '/login' });
                return res;
            }
            return res;
        }
    );
    // 请求拦截, 检查token
    instance.interceptors.request.use(
        (req) => {
            const token = window.localStorage.getItem('token')
            if (token != undefined) {
                req.headers.Authorization = 'Bearer ' + token // Bearer 右边有一个空格
            }
            else {
                router.push({ path: '/login' })
            }
            return req
        }
        // (error) => {
        //   // 什么也不要做
        // }
    )
    return instance(config)
}

export async function doGet(url, params) {
    return (await request({
        url,
        method: 'get',
        params: params
    })).data;
}

export async function doPost(url, body) {
    let data = (await request({
        url,
        method: 'post',
        data: body
    })).data;
    return data;
}