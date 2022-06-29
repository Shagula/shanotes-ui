import { root_path, create_folder, del, create_note, get_children, move_link, update_link } from "../../api/notes";
import { read_link, read_meta, rename } from '../../api/notes';
import { gen_folder_chilren_arr, out_folder_to_md } from '../../models/notes';
import { ElMessage } from 'element-plus'
const FOLDER_TAG = 1, FILE_TAG = 2;

export default {
    async mounted() {
        // 防止刷新丢失
        let cur_fid = parseInt(window.localStorage.getItem('cur_fid'));

        this.froot = this.folder[0];

        if (cur_fid) {
            await this.reload_root(cur_fid);
            this.selected_fid = cur_fid;
        }
        else {
            this.selected_fid = 0;
            this.selected_folder = this.froot;
            await this.reload_root();
        }
    },

    data() {
        return {
            create_info: {
                title: '',
                type: ''
            },

            output_md_info: {
                folder: '',
                file: '',
                finished: false,
            },

            // 选中的folder id 
            selected_fid: 0,
            //选中的folder 
            selected_folder: null,
            loading: false,
            // 创建对话框
            dialog_vis: false,
            // 删除对话框
            del_dia_vis: false,
            // 重命名对话框
            rename_dia_vis: false,
            // 与重命名输入框绑定
            rename_input: '',
            // 导出对话框
            output_dia_vis: false,
            is_empty_folder: false,
            froot: null,
            folder: [{
                label: '根目录',
                path_id: 0,
                link_type: 1,
                depth: 0,
                children: [],
                parent: 0,
            }]
        }
    },
    methods: {
        customNodeClass(tree, node) {
            let data = node.data;
            if (data.link_type == 1) {
                return `is-folder`;
            }
            return null;

        },
        // 加载根路径
        async reload_root(path_id = 0) {
            let root_folder;
            if (path_id == 0) {
                // init
                this.froot.parent = 0;
                this.froot.path_id = 0;
                this.froot.label = "根目录";
                this.froot.depth = 0;
                this.froot.children = [];

                this.loading = true;
                root_folder = await root_path();
                this.loading = false;

                this.is_empty_folder = root_folder.meta.status != 200;
                if (!this.is_empty_folder) {
                    this.froot.children = await this.process_folder(root_folder.value, 0, 1, 1);
                }
            }
            else {
                let folder_meta = await read_link(path_id);
                if (folder_meta.meta.status != 200)
                    return alert(folder_meta.meta.message);

                folder_meta = folder_meta.content;

                this.froot.path_id = folder_meta.id;
                this.froot.label = folder_meta.title;
                this.froot.parent = folder_meta.parent;
                this.froot.depth = 0;
                this.froot.children = [];

                this.loading = true;
                root_folder = await get_children(path_id);
                this.loading = false;

                this.is_empty_folder = root_folder == null;
                if (!this.is_empty_folder) {
                    this.froot.children = await this.process_folder(root_folder, this.froot.path_id, 1);
                }
            }

        },
        // 数据处理的一些函数 ==============================
        // 将文件列表转为element tree
        async process_folder(value, parent, depth = 1, end_depth) {
            let ret = [];
            for (let item of value) {
                let obj = { label: item.title, depth, path_id: item.id, link_type: item.link_type, children: null, parent };
                // 每次最多多读取一层
                if (depth <= end_depth && item.link_type == FOLDER_TAG) {
                    let sons = await get_children(item.id);
                    if (sons != null)
                        obj.children = await this.process_folder(sons, item.id, depth + 1, end_depth);
                }
                if (item.children != undefined && item.children != null)
                    obj.children = item.children;
                ret.push(obj);
            }
            return ret;
        },
        async sync_folder_info(folder) {
            let arr = gen_folder_chilren_arr(folder.children);
            return await update_link(folder.path_id, JSON.stringify(arr));
        },
        handleDiaClose() {
            this.dialog_vis = false;
        },
        async handleFolderBack() {
            if (this.froot.path_id != 0) {
                await this.reload_root(this.froot.parent);
                window.localStorage.setItem('cur_fid', this.froot.parent);
            }
        },
        async createLink() {
            if (this.create_info.title.length < 1)
                return alert("标题必须长度必须大于1");
            let par_id = this.selected_fid;
            if (this.selected_folder && this.selected_folder.link_type == 2)
                return ElMessage("必须选中一个文件夹来创建文件");

            if (this.create_info.type == "folder") {
                let id = await create_folder(par_id, this.create_info.title);
                if (id.meta.status != 200)
                    return alert('创建失败');

                id = id.id;
                let val = {
                    parent: par_id, label: this.create_info.title, path_id: id, link_type: 1, children: []
                }
                this.selected_folder.children.push(val);
            }
            else if (this.create_info.type == 'file') {
                let id = await create_note(par_id, this.create_info.title);
                if (id.meta.status != 200)
                    return alert('创建失败');

                id = id.id;
                let val = {
                    parent: par_id, label: this.create_info.title, path_id: id, link_type: 2, children: []
                }
                this.selected_folder.children.push(val);
            }
            this.dialog_vis = false;
        },

        del_link() {
            this.del_dia_vis = true;
        },
        async open_folder() {
            if (this.selected_folder.link_type != FOLDER_TAG)
                ElMessage({
                    message: '请打开一个文件夹',
                    type: 'error',
                })
            else {
                window.localStorage.setItem('cur_fid', this.selected_fid);

                await this.reload_root(this.selected_fid);
            }
        },
        async confirmDeleteLink() {
            await del(this.selected_fid);
            this.del_dia_vis = false;

            let iter = (value) => {
                if (value.link_type == FOLDER_TAG && value.children) {
                    value.children = value.children.filter((item) => {
                        return item.path_id != this.selected_fid;
                    })
                    for (let item of value.children)
                        iter(item);
                }
            }

            iter(this.froot);

        },

        // 树形控件的一些函数 ===============================
        allowDrop(draggingNode, dropNode, type) {
            if (type == 'inner')
                return dropNode.data.link_type == 1;
            else {
                if (dropNode.data.depth == 0) {
                    return false;
                }
            }
            return true;
        },
        // 处理点击事件
        async handleNodeClick(tree_node) {
            this.selected_fid = tree_node.path_id;
            this.selected_folder = tree_node;
            this.$emit('click_path', this.selected_folder);
            // 文件类型
            if (tree_node.link_type == '2') {
            }
            //文件夹
            else {
                if (!tree_node.children) {
                    let children_list = await get_children(tree_node.path_id);
                    tree_node.children = await this.process_folder(children_list, tree_node.depth + 1, tree_node.depth + 2);
                }
            }
        },
        // 处理拖拽
        async handleDrag(node, enter_node, type) {
            let raw_enter = enter_node;

            node = node.data, enter_node = enter_node.data;
            let mid = node.path_id, dest_id = enter_node.path_id;
            let node_meta = await read_meta(node.path_id), enter_meta = await read_meta(enter_node.path_id);

            if (type == 'inner') {
                // alert(`将${node.label} 移动到 ${enter_node.label}`);
                let res = await move_link(mid, dest_id);
                if (res.meta.status != 200) {
                    return alert(res.meta.message);
                }
                if (!this.sync_folder_info(enter_node))
                    return alert("更新文件夹信息失败");
            }
            else {
                if (node_meta.parent == enter_meta.parent) {
                    // alert("只要更新目录");
                    await this.sync_folder_info(raw_enter.parent.data)
                }
                else {
                    // alert(`将${node.label} 移动到 ${enter_node.label}的父亲`);
                    let res = await move_link(mid, enter_node.parent);
                    if (res.meta.status != 200)
                        return alert(res.meta.message);
                    await this.sync_folder_info(raw_enter.parent.data)
                }
            }
        },
        // 处理重命名
        async handleRename() {
            if (this.selected_fid == 0)
                return ElMessage({ type: 'error', message: '根目录不能重命名' });
            this.rename_dia_vis = true;
        },
        async confirmRename() {
            this.rename_dia_vis = false;
            let resu = await rename(this.selected_fid, this.rename_input);
            if (resu.meta.status != 200)
                return ElMessage({ type: 'error', message: resu.meta.message });

            this.selected_folder.label = this.rename_input;
            return ElMessage({ type: 'success', message: '重命名成功' });
        },
        // 处理导出文件夹
        async handleOutFolder() {
            this.output_dia_vis = true;
            await out_folder_to_md(this.selected_fid, this.output_md_info);
        }
    }
}