<template>
    <el-row class="basic_absolute_center" style="width: 100%;" type="flex" justify="center">
        <!-- 占位格 -->
        <el-col :xs="0" :sm="4" :md="7"></el-col>
        <!-- 内容格 -->
        <el-col :xs="24" :sm="16" :md="10">
            <div class="basic_border_shadow login_loginbox">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入原密码" v-model="form.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input placeholder="请输入新密码" v-model="form.newpassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input placeholder="请确认密码" v-model="form.repeatpassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="$toWhere('/login')">返回</el-button>
                        <el-button type="success" @click="modify">修改</el-button>
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
                    newpassword: '',
                    repeatpassword: ''
                },
                remember_me: false
            }
        }, computed: {
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
            async modify() {
                if (!this.form.username || !this.form.password || !this.form.newpassword || !this.form.repeatpassword) {
                    this.$message({
                        type: 'warning',
                        message: "请完整信息！"
                    });
                    return
                }
                if (this.form.newpassword != this.form.repeatpassword) {
                    this.$message({
                        type: 'warning',
                        message: '重复密码需与新密码相同'
                    });
                    return
                }
                if (this.form.newpassword.length < 5 || this.form.newpassword.length > 20) {
                    this.$message({
                        type: 'warning',
                        message: '密码长度请控制在5-20个'
                    });
                    return
                }
                let data = {}
                await this.$basicPost("/common/modify_password", this.form, data);
                if (data.success && data.data.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: data.data.data.message
                    });
                    this.$toWhere("/login")
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "修改失败"
                    });
                }
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