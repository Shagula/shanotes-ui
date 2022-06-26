export function gen_folder_chilren_arr(value) {
    let arr = [];
    for (let item of value)
        arr.push(item.path_id);
    return arr;
}