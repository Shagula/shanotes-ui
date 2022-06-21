import { doGet, doPost } from "@/utils/request";

export async function signin(username, password) {
    return doPost('/user/signin', { username, password });
}

export async function signup(username, password) {
    return doPost('/user/signup', { username, password });
}

