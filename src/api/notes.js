import { doGet, doPost } from "@/utils/request";
// raw
export async function root_path() {
    return await doGet('/notes/root');
}
export async function create_folder(parent, title) {
    return await doPost('/notes/create_folder', { parent, title })
}
export async function create_note(parent, title) {
    return await doPost('/notes/create_note', { parent, title })
}
export async function del(id){
    return await doPost('/notes/del_link',{path_id:id});
}
export async function read_link(id){
    return await doGet('/notes/read_link',{path_id:id});
}
// processed
export async function get_children(parent) {
    let ret = [];

    let pinfo = await doGet('/notes/read_link', { path_id: parent });
    if (pinfo.meta.status != 200)
        return [];
    let value = pinfo.content;
    let file_list = JSON.parse(value.content);
    let cinfo = await doGet('/notes/read_child', { path_id: parent });
    if (cinfo.meta.status != 200 || !cinfo.value)
        return [];
    let tab = new Map();
    cinfo = cinfo.value;

    for (let item of cinfo)
        tab.set(item.id, item);
    for (let item of file_list)
        if (tab.has(item))
            ret.push(tab.get(item));
    return ret;
}
