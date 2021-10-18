<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" height="calc(100vh - 136px)" border style="width: 100%;">
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" width="130">
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="130">
                <template slot-scope="scope">
                    {{new Date().format(scope.row.createTime)}}
                </template>
            </el-table-column>·
            <el-table-column prop="nickname" label="昵称">
            </el-table-column>
            <el-table-column prop="avatar" label="头像" width="70">
                <template slot-scope="scope">
                    <div class="demo-image__preview">
                        <el-image class="admin_table_img" :src='"data:image/jpg;base64,"+ scope.row.avatar'>
                        </el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="locked" label="启用" width="70">
                <template slot-scope="scope">
                    <el-button class="admin_display_button" @click="lockOrUnlock(scope.row.id)" v-if="scope.row.locked == 'F'" type="success"
                        size="mini">{{'已启用'}}</el-button>
                    <el-button class="admin_display_button" @click="lockOrUnlock(scope.row.id)" v-if="scope.row.locked == 'T'" type="info"
                        size="mini">{{'已禁用'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="userType" label="用户类型" width="90">
                <template slot-scope="scope">
                    <el-button class="admin_display_button" v-if="scope.row.userType == 0" type="info" size="mini">{{'普通用户'}}</el-button>
                    <el-button class="admin_display_button" v-if="scope.row.userType == 1" type="success" size="mini">{{'管理员'}}</el-button>
                    <el-button class="admin_display_button" v-if="scope.row.userType == 2" type="danger" size="mini">{{'超级管理员'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope" >
                    <el-button class="admin_display_button" v-if="bigerUser(scope.row.userType)" type="primary" size="small"
                        @click='handleDelete(scope.row.id)'>删除用户</el-button>
                    <br />
                    <el-button class="admin_display_button" v-if="bigerUser(scope.row.userType)" type="success" size="small"
                        @click="setID(scope.row.id)">重置密码</el-button>
                    <br />
                    <!-- 超级管理员可以提权 -->
                    <el-button class="admin_display_button" @click="upUser(scope.row.id)" v-if="isSuper() && scope.row.userType == 0" type="warning"
                        size="small">升成管理员</el-button>
                    <el-button class="admin_display_button" @click="downUser(scope.row.id)" v-if="isSuper() && scope.row.userType == 1"
                        type="warning" size="small">降级</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 3px;text-align: left;" @current-change="currentChange"
            :current-page.sync="page" :page-size="size" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>确认重置此用户的密码</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetPassword">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableData: [

                ],
                page: 1,//当前页数
                total: 0,//总数量
                size: 0,//单页数量
                dialogVisible: false,
                id: 0,
                loading :false
            }
        },
        methods: {
            async currentChange(){
                await this.handleData()
            },
            async handleDelete(id) {
                this.$confirm('此操作将永久删除该用户，同时相关文章也会删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let data = {}
                    await this.$basicPost("/admin/deleteUser", { id: id }, data);
                    if (data.success && data.data.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: data.data.data.message
                        });
                        this.handleData()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: data.data.data.code == 600 ? data.data.data.message : "删除失败"
                        });
                    }
                })
            },
            async handleData() {
                this.loading = true
                let data = {}
                await this.$basicPost("/admin/users", { page: this.page }, data);
                if (data.success && data.data.data.code == 200) {
                    this.tableData = data.data.data.data.users.records;
                    this.total = data.data.data.data.users.total;
                    this.size = data.data.data.data.users.size;
                    this.page = data.data.data.data.users.current;
                } else {
                    this.$notify({
                        title: '提示',
                        message: data.data.data.code == 600 ? data.data.data.message : "获取用户失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
                this.loading = false
            },
            isSuper() {
                if (this.$basicConfig.user == "anonymousUser") {
                    return false;
                }
                if (this.$basicConfig.user.userType != 2) {
                    return false;
                }
                return true;
            },
            bigerUser(userType) {
                if (this.$basicConfig.user.userType > userType) {
                    return true;
                } else {
                    return false;
                }
            },
            async setID(id) {
                this.id = id;
                this.dialogVisible = true;
            },
            async upUser(id) {
                let data = {}
                await this.$basicPost("/admin/upUser", { id: id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.handleData()
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "升级失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            },
            async downUser(id) {
                let data = {}
                await this.$basicPost("/admin/downUser", { id: id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.handleData()
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "升级失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            },
            async resetPassword() {
                let data = {}
                await this.$basicPost("/admin/resetPassword", { id: this.id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "重置密码失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
                this.dialogVisible = false;
            },
            async lockOrUnlock(id) {
                let data = {}
                await this.$basicPost("/admin/lockOrUnlockUser", { id: id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.handleData()
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "操作失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            }
        },
        mounted() {
            this.handleData();
        },

    }
</script>