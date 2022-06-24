<template>
  <div class="main">
    <el-card id="card">
      <!-- 操作栏 -->
      <template #header>
        <div class="operator-bar">
          <!-- 返回 -->
          <el-button text @click="handleFolderBack">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </el-button>
          <!-- 打开，添加，删除 -->
          <el-button-group>
            <el-button text @click="open_folder">
              <el-icon>
                <FolderOpened />
              </el-icon>
            </el-button>
            <el-button text @click="dialog_vis=true">
              <el-icon>
                <FolderAdd />
              </el-icon>
            </el-button>
            <el-button type="danger" @click="del_link">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-button-group>
        </div>
      </template>
      <!-- 目录树 -->
      <el-tree v-loading="loading" highlight-current :data="folder"
        @node-click="handleNodeClick" :props="{ class: customNodeClass }"></el-tree>
    </el-card>
    <!-- 创建文件(夹)对话框 -->
    <el-dialog v-model="dialog_vis" title="创建新路径" :before-close="handleDiaClose">

      <el-form label-width="120px">
        <el-form-item label="目录类型">
          <el-radio-group v-model="create_info.type">
            <el-radio label="folder">文件夹</el-radio>
            <el-radio label="file">文件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="create_info.title" :style="{'width':'200px'}" id="path-name-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog_vis = false">取消</el-button>
          <el-button type="primary" @click="createLink">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除文件夹对话框 -->
    <el-dialog v-model="del_dia_vis" title="删除确认">
      <span>
        <p style="margin-bottom:40px; font-size:30px;color:red">
          你确定要删除{{selected_folder.title}}吗？删除操作不可撤销<br />
        </p>
      </span>
      <span class="dialog-footer">
        <el-button @click="dialog_vis = false">取消</el-button>
        <el-button type="primary" @click="confirmDeleteLink">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { root_path, create_folder, del, create_note, get_children } from "../../api/notes";
import { read_link } from '../../api/notes';

import { ElMessage } from 'element-plus'


const FOLDER_TAG = 1, FILE_TAG = 2;


export default {
  async mounted() {
    this.froot = this.folder[0];
    this.selected_folder = this.froot;
    await this.reload_root();
  },

  data() {
    return {
      create_info: {
        title: '',
        type: ''
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
          this.froot.children = await this.process_folder(root_folder.value, 1);
        }
      }
      else {
        let folder_meta = await read_link(path_id);
        if (folder_meta.meta.status != 200)
          return alert(folder_meta.meta.message);
        folder_meta = folder_meta.content;
        console.log(folder_meta);
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
    // 将文件列表转为element tree
    async process_folder(value, parent, depth = 1) {
      let ret = [];
      for (let item of value) {
        let obj = { label: item.title, path_id: item.id, link_type: item.link_type, children: null, parent };
        // 每次最多多读取一层
        if (depth < this.froot.depth + 2 && item.link_type == FOLDER_TAG) {
          let sons = await get_children(item.id);
          if (sons != null)
            obj.children = await this.process_folder(sons, item.id, depth + 1);
        }
        if (item.children != undefined && item.children != null)
          obj.children = item.children;
        ret.push(obj);
      }
      return ret;
    },

    handleDiaClose() {
      this.dialog_vis = false;
    },
    async handleFolderBack() {
      if (this.froot.path_id != 0) {
        await this.reload_root(this.froot.parent);
      }
    },
    async createLink() {
      if (this.create_info.title.length < 1)
        return alert("标题必须长度必须大于1");
      if (this.create_info.type == "folder") {
        let id = await create_folder(this.selected_fid, this.create_info.title);
        if (id.meta.status != 200)
          return alert('创建失败');

        id = id.id;
        let val = {
          label: this.create_info.title, path_id: id, link_type: 1, children: []
        }
        this.selected_folder.children.push(val);
      }
      else if (this.create_info.type == 'file') {
        let id = await create_note(this.selected_fid, this.create_info.title);
        if (id.meta.status != 200)
          return alert('创建失败');

        id = id.id;
        let val = {
          label: this.create_info.title, path_id: id, link_type: 2, children: []
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
    handleNodeClick(tree_node) {
      this.selected_fid = tree_node.path_id;
      this.selected_folder = tree_node;
      // 文件类型
      if (tree_node.link_type == '2') {

      }
      //文件夹
      else {
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  width: 250px;
}
.el-card {
  margin-left: 10px;
  margin-right: 10px;
  min-height: 90vh;
}

#card {
  .operator-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
<style>
.is-folder > .el-tree-node__content {
  font-weight: bolder;
}
</style>