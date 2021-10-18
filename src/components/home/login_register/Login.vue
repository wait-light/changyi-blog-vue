<template>
    <el-row class="basic_absolute_center" style="width: 100%;" type="flex" justify="center">
        <!-- 占位格 -->
        <el-col :xs="0" :sm="4" :md="7"></el-col>
        <!-- 内容格 -->
        <el-col :xs="24" :sm="16" :md="10" v-loading="loading" element-loading-text="登录中">
            <div class="basic_border_shadow login_loginbox">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入密码" @keyup.enter.native="login" v-model="form.password" show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-row>
                            <el-col :xs="24" :md="24">
                                <el-checkbox v-model="remember_me" style="margin-right: 5px;">记住我</el-checkbox>
                            </el-col>
                            <el-col :xs="8" :md="6">
                                <el-button type="primary" @click="login">登录</el-button>
                            </el-col>
                            <el-col :xs="8" :md="6">
                                <el-button type="success" @click="$toWhere('/register')">注册</el-button>
                            </el-col>
                            <el-col :xs="8" :md="6">
                                <el-button type="info" @click="$toWhere('/modify_password')">修改密码</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
        <!-- 占位格 -->
        <el-col :xs="0" :sm="4" :md="7"><br /></el-col>
    </el-row>

</template>

<script>
    import { mapMutations } from 'vuex'
    import { mapState } from "vuex";
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                },
                loading: false,
                remember_me: false
            }
        },
        computed: {
            ...mapState(["title", "mainer"]),
        },
        methods: {
            ...mapMutations([
                "changteStyle",
                "changeText",
                "changeDownButton",
                "openOrCloseButton",
                "changeContent"
            ]),
            async login() {
                var data = {};
                this.loading = true
                await this.$basicPost("/login", {
                    username: this.form.username,
                    password: this.form.password,
                    "remember-me": this.remember_me
                }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$set(this.$basicPost, "user", data.data.data.data.user)
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.$toWhere("/index")
                    location.reload();
                } else {
                    this.$notify({
                        message: "请检查用户名或密码",
                        duration: 1000,
                        type: 'warning'
                    });
                }
                this.loading = false
            }
        },
        mounted() {
            this.mainer.additional = 300
            this.title.downButton.anotherOpen = false
            this.mainer.style["margin-top"] = -this.mainer.additional + "px"
            this.changteStyle({ key: "background-image", value: "url('https://tvax2.sinaimg.cn/large/008c2CqBly1gleij9yklrj30nl0xc7mj.jpg')" })
            this.changeContent("")
            this.changteStyle({ key: "height", value: "100vh" })
        },
    }
</script>

<style>

</style>