<template>
    <div>
        <el-table :data="tableData" height="calc(100vh - 136px)" border style="width: 100%;">
            <el-table-column prop="title" label="名称">
            </el-table-column>
            <el-table-column prop="content" label="介绍">
            </el-table-column>
            <el-table-column prop="order" label="权重">
            </el-table-column>
            <el-table-column prop="url" label="链接">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="60">
                <template slot-scope="scope">
                    <el-popconfirm title="确认删除友链？" @onConfirm='handleDelete(scope.row.id)'>
                        <el-button class="admin_display_button" slot="reference" type="danger" size="small">删除</el-button><br />
                    </el-popconfirm>
                    <el-button class="admin_display_button" @click="prepareModify(scope.row)" type="warning" size="small">修改</el-button><br />
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;margin-top: 3px;">
            <el-pagination style="text-align: left;" @current-change="currentChange" :current-page.sync="page"
                :page-size="size" layout="prev, pager, next, jumper" :total="total">
            </el-pagination>
            <el-button style="margin-left: 10px;" size="mini" type="success" @click="dialogVisible = true">添加
            </el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="30%" @close="closeHandler">
            <el-form ref="form" :model="addData" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="addData.title" placeholder="填入友链名称"></el-input>
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input v-model="addData.content" placeholder="填入友链介绍"></el-input>
                </el-form-item>
                <el-form-item label="链接">
                    <el-input v-model="addData.url" placeholder="填入友链链接"></el-input>
                </el-form-item>
                <el-form-item label="权重">
                    <el-input v-model="addData.order" placeholder="填入友链权重，0为默认"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="addData.id == -1" @click="addFriend">添 加</el-button>
                <el-button type="primary" v-if="addData.id != -1" @click="handleModify">修 改</el-button>
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
                addData: {
                    id: -1,
                    title: "",
                    url: "",
                    content: "",
                    order: 0,
                },
                page: 1,//当前页数
                total: 0,//总数量
                size: 0,//单页数量
                dialogVisible: false,
                id: 0,
            }
        },
        methods: {
            async currentChange() {
                await this.handleData()
            },
            closeHandler() {
                this.addData.id = -1;
                this.addData.title = "";
                this.addData.url = "";
                this.addData.content = "";
                this.addData.order = 0;

            },
            prepareModify(data) {
                this.addData.id = data.id;
                this.addData.title = data.title;
                this.addData.url = data.url;
                this.addData.content = data.content;
                this.addData.order = data.order;
                this.dialogVisible = true
            },
            async addFriend() {
                let data = {}
                await this.$basicPost("/superAdmin/addFriend", this.addData, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.dialogVisible = false
                    this.handleData();
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "添加友情链接失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            },
            async handleModify() {
                let data = {}
                await this.$basicPost("/superAdmin/modifyFriend", this.addData, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.dialogVisible = false
                    this.handleData();
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "修改友情链接失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            },
            async handleDelete(id) {
                let data = {}
                await this.$basicPost("/superAdmin/deleteFriend", { id: id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    this.handleData()
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "删除友情链接失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            },
            async handleData() {
                let data = {}
                await this.$basicPost("/common/friends", { page: this.page }, data);
                if (data.success && data.data.data.code == 200) {
                    this.tableData = data.data.data.data.friends.records;
                    this.total = data.data.data.data.friends.total;
                    this.size = data.data.data.data.friends.size;
                    this.page = data.data.data.data.friends.current;
                } else {
                    this.$notify({
                        title: '提示',
                        message: data.data.data.code == 600 ? data.data.data.message : "获取友情链接失败",
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