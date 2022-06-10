import {doGet,doPost} from '../utils/request'

export async function test(){
    return await doGet('/')
}