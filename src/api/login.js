import { request } from '@/utils/request.js'

export function login(username, password) {
    return request({
        url: '/signin/login',
        method: 'post',
        data: {
            username, password
        }
    })
}