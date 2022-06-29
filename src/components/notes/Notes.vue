<template>
  <div id="main">
    <PathTree id="tree-nav" @click_path="handleClickPath" />

    <div class="md" style="oveflow:auto">
      <mavon-editor v-loading="loading" v-if="cur_path && cur_path.link_type!=1" id="md-editor"
        v-model="markdown_content" @save="saveFile" :defaultOpen="'preview'" :subfield="false"
        :toolbars="markdown_options">
      </mavon-editor>
    </div>
  </div>
</template>
<script>
import PathTree from './PathTree.vue'
import { read_link, update_link } from '../../api/notes';
import { ElMessage } from 'element-plus';
export default {
  components: { PathTree },
  data() {
    return {
      markdown_options: {
        navigation: true,
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        subfield: true,
        preview: true,
      },
      markdown_content: '',
      cur_path: '',
      raw_content: '',
      loading: false,
    }
  },
  computed: {
    updated() {
      return this.raw_content != this.markdown_content;
    }
  },
  methods: {
    async saveFile() {
      this.loading = true;
      let path_id = this.cur_path.path_id;
      let res = await update_link(path_id, this.markdown_content);
      this.loading = false;
      if (res.meta.status != 200)
        return ElMessage("保存失败");
      this.raw_content = this.markdown_content;
      return ElMessage({type:'success',message:"保存成功"});
    },
    async handleClickPath(val) {
      if (!val || val.path_id == 0 || val.link_type == 1)
        return;
      if (this.updated)
        await this.saveFile();
      this.cur_path = val;
      console.log(val);
      // 读取链接

      this.loading = true;
      let res = await read_link(val.path_id);
      this.loading = false;

      if (res.meta.status != 200)
        return alert('请求数据失败');
      res = res.content;
      this.markdown_content = res.content == null ? '' : res.content;
      this.raw_content = this.markdown_content;

    }
  }
}
</script>
<style scoped lang="less">
#main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 90vh;
  #tree-nav
  {
    width: 280px;
  };
  .md {
    height: 100%;
    width: 80%;
    overflow-y: auto;
  }
}
</style>
