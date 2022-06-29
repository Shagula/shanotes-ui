import { read_link } from "@/api/notes";
export function gen_folder_chilren_arr(value) {
    let arr = [];
    for (let item of value)
        arr.push(item.path_id);
    return arr;
}

async function out_folder_iter(path_id, depth, msg) {
    let ret = '';
    let link_info = await read_link(path_id);
    if (link_info.meta.status != 200) {
        return ret = '\n# 导出id 为' + path_id + '失败了QAQ\n';
    }
    link_info = link_info.content;
    // folder
    if (link_info.link_type == 1) {
        msg.folder = link_info.title;
        let sharp_cnt = depth;

        let sharps = '';
        while (sharp_cnt--)
            sharps += '#';

        if (depth)
            ret += '\n' + sharps + ' ' + link_info.title + '\n\n';

        let children = JSON.parse(link_info.content);
        for (let child of children)
            ret += await out_folder_iter(child, depth + 1, msg);
        msg.folder = `loading folder: ${link_info.title}`;

    }
    else {
        msg.file =  link_info.title;
        ret += '\n' + (link_info.content ? link_info.content : '') + '\n';
    }
    return ret;
}

export async function out_folder_to_md(path_id, msg = { folder: '', file: '' }) {
    msg.finished = false;
    let text = await out_folder_iter(path_id, 0, msg);
    msg.finished = true;
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', '文档.md')
    element.style.display = 'none'
    element.click()
}