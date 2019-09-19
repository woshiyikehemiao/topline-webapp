<template>
  <div id="login">
    <van-nav-bar title="登录" />
    <van-cell-group>
        <ValidationObserver tag="form" ref="loginfrom">
        <ValidationProvider tag="div" name="手机号" rules="required" v-slot="{errors}">
            <van-field
                required
                clearable
                v-model="user.mobile"
                label="手机号"
                placeholder="请输入手机号"
                :error-message="errors[0]"
            />
        </ValidationProvider>
        <ValidationProvider tag="div" name="验证码" rules="required" v-slot="{errors}">
            <van-field
                required
                clearable
                v-model="user.code"
                label="验证码"
                placeholder="请输入验证码"
                :error-message="errors[0]"
            />
  </ValidationProvider>
  </ValidationObserver>
</van-cell-group>
<div class="loginbtn">
<van-button type="info" class="btn" @click='onLogin' :loading="isLoading">登录</van-button>
</div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'loginIndex',
  data () {
    return {
      isLoading: false,
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async onLogin () {
      try {
        const isValidate = await this.$refs.loginfrom.validate()
        if (!isValidate) {
          return
        }
        this.isLoading = true
        let { data } = await login(this.user)
        console.log(data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，请重新登录')
        }
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.loginbtn{
    padding: 20px;
.btn{
    width: 100%;
}
}
</style>
