<template>
    <el-row class="basic_absolute_center" style="width: 100%;" type="flex" justify="center">
        <!-- 占位格 -->
        <el-col :xs="0" :sm="6" :md="8"></el-col>
        <!-- 内容格 -->
        <el-col :xs="24" :sm="12" :md="8">
            <div class="login_loginbox" v-loading="loading" element-loading-text="注册中">
                <el-form label-width="80px">
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input placeholder="请输入昵称" v-model="nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input placeholder="请输入手机号" v-model="mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="头像">
                        <input type="file" @change="addImg" accept="image/png,image/jpeg,image/gif,image/jpg"
                            ref="inputer"></input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="onSubmit">注册</el-button>
                        <el-button type="primary" @click="$toWhere('/login')">返回</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </el-col>
        <!-- 占位格 -->
        <el-col :xs="0" :sm="6" :md="8"></el-col>
    </el-row>

</template>

<script>
    import { mapMutations } from 'vuex'
    import { mapState } from "vuex";
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                loading: false,
                avatar: '',
                username: '',
                password: '',
                mobile: '',
                nickname: '',
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
            async onSubmit() {
                if (this.username.length < 5 || this.username.length > 20) {
                    this.$message({
                        type: 'warning',
                        message: '用户名长度请控制在5-20个'
                    });
                    return
                }
                if (this.password.length < 5 || this.password.length > 20) {
                    this.$message({
                        type: 'warning',
                        message: '密码长度请控制在5-20个'
                    });
                    return
                }
                if (this.nickname.length < 2 || this.nickname.length > 12) {
                    this.$message({
                        type: 'warning',
                        message: '昵称长度请控制在2-12个'
                    });
                    return
                }
                if ((this.mobile + "").search("^[0-9]{11,11}$") == -1) {
                    this.$message({
                        type: 'warning',
                        message: '请输入符合规定的手机号'
                    });
                    return
                }

                if (!this.avatar) {
                    this.$message({
                        type: 'warning',
                        message: '请上传头像'
                    });
                    return
                }
                if (!this.match(5, 20, this.username)) {
                    this.$message({
                        type: 'warning',
                        message: '请不要包含特殊符号'
                    });
                    return
                }
                let data = {}
                let formdata = new FormData();
                formdata.append("username", this.username);
                formdata.append("password", this.password);
                formdata.append("mobile", this.mobile);
                formdata.append("nickname", this.nickname);
                formdata.append("avatar", this.avatar);
                this.loading = true
                await this.$multiPost("/common/register", formdata, data)
                if (data.success && data.data.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '注册成功'
                    });
                    this.$toWhere("/login")
                } else {
                    this.$message({
                        type: 'warning',
                        message: '注册失败'
                    });
                }
                this.loading = false
            },
            addImg() {
                let inputDOM = this.$refs.inputer.files;
                if (inputDOM.length == 1 && inputDOM[0].size >= 1048576) {
                    this.$message({
                        type: 'warning',
                        message: '图片请小于1M'
                    });
                    return
                }
                if (inputDOM.length == 1) {
                    this.avatar = inputDOM[0]
                }
            },
            match(min, max, str) {
                let pattern = "^[a-zA-z0-9_]{" + min + "," + max + "}$"
                return str.search(pattern) != -1 ? true : false;
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