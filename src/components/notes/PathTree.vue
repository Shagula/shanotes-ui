<template>
  <div class="main">
    <el-card id="card">
      <!-- 操作栏 -->
      <template #header>
        <div>
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
          <!--  重命名，导出文件夹 -->
          <div style="text-align:left">
            <el-button-group>
              <el-button text @click="handleRename">
                <el-icon>
                  <EditPen />
                </el-icon>
              </el-button>
              <el-button type="success" @click="handleOutFolder">
                <el-icon>
                  <DocumentCopy />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>
      <div class="tree-div">
        <!-- 目录树 -->
        <el-tree @node-drop="handleDrag" draggable v-loading="loading" highlight-current :data="folder"
          :allow-drop="allowDrop" @node-click="handleNodeClick" :props="{ class: customNodeClass }">
        </el-tree>
      </div>
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
          你确定要删除{{selected_folder.label}}吗？删除操作不可撤销<br />
        </p>
      </span>
      <span class="dialog-footer">
        <el-button @click="dialog_vis = false">取消</el-button>
        <el-button type="primary" @click="confirmDeleteLink">确认</el-button>
      </span>
    </el-dialog>
    <!-- 重命名对话框 -->
    <el-dialog v-model="rename_dia_vis" title="重命名">
      <el-form label-width="120px">
        <el-form-item label="新的路径名称: ">
          <el-input v-model="rename_input" :style="{'width':'400px'}" />
        </el-form-item>
      </el-form>
      <span style="margin-bottom:20px">
        <el-button @click="rename_dia_vis = false">取消</el-button>
        <el-button type="primary" @click="confirmRename">确认</el-button>
      </span>
    </el-dialog>
    <!-- 导出文件对话框 -->
    <el-dialog v-model="output_dia_vis" title="导出中">
      <span style="font-size:20px">
        <p >正在导出的文件夹: {{output_md_info.folder}}</p>
        <br />
        <p>正在导出的文件: {{output_md_info.file}}</p>
        <br />
      </span>
      <p v-if="output_md_info.finished" style='color:red;font-size:20px;'> 导出完成</p>
    </el-dialog>
  </div>
</template>
<script src="./PathTree.js"></script>
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
    margin-bottom: 20px;
  }
}
</style>
<style>
.is-folder > .el-tree-node__content {
  font-weight: bolder;
}
</style>