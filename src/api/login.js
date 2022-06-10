import { doGet, doPost } from "@/utils/request";

export async function signin(username, password) {
    return doPost('/login/signin', { username, password });
}

export async function signup(username, password) {
    return doPost('/login/signup', { username, password });
}

