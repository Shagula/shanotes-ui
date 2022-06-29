<template>
  <div id="user-card">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="float:left">用户信息</span>
          <el-button style="float:right" text @click="upd_pass_dialog=true">修改密码</el-button>
        </div>
      </template>
      <div style="text-align:left;color:gray;font-family:FiraCode">
        <p>用户名: {{username}}</p>
        <p>用户id: {{user_id}}</p>
        <p>用户权限: {{access_display}}</p>
      </div>
    </el-card>
    <el-dialog v-model="upd_pass_dialog" title="修改密码">
      <div>
        <el-form label-width="120px">
          <el-form-item label="新密码: ">
            <el-input type="password" v-model="upd_pass_input" :style="{'width':'400px'}" />
          </el-form-item>
          <el-form-item label="确认密码: ">
            <el-input type="password" v-model="comfirm_pass_input" :style="{'width':'400px'}" />
          </el-form-item>
        </el-form>
        <span style="margin-bottom:20px">
          <el-button @click="upd_pass_dialog = false">取消</el-button>
          <el-button type="primary" @click="handleUpdatePassword">确认</el-button>
        </span>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { ElMessageBox } from 'element-plus';
import { update_password } from '../../api/login'
export default {
  mounted() {
    this.username = window.localStorage.getItem('username');
    this.user_id = window.localStorage.getItem('userid');
    if (window.localStorage.getItem('is_admin'))
      this.access_display = 'admin'
  },
  data() {
    return {
      username: '',
      user_id: 0,
      access_display: '普通用户',
      upd_pass_dialog: false,
      upd_pass_input: '',
      comfirm_pass_input: '',
    }
  },
  methods: {
    async handleUpdatePassword() {
      if (this.upd_pass_input != this.comfirm_pass_input)
        return ElMessageBox({ type: 'err', message: '两次输入的密码不一致' });

      let resu = await update_password(this.upd_pass_input);
      if (resu.meta.status == 200) {
        this.upd_pass_dialog = false;
        return ElMessageBox({ type: 'success', message: '修改成功' });
      }
      return ElMessageBox({ type: 'err', message: resu.meta.message });
    }
  }

}
</script>
<style scoped>
#user-card {
  margin: 0 auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 14px;
}

.box-card {
  margin: 0 auto;
  width: 60%;
}
</style>
