<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" height="calc(100vh - 136px)" border style="width: 100%;">
            <el-table-column prop="id" label="评论ID" width="100">
            </el-table-column>
            <el-table-column prop="userid" label="评论者ID" width="100">
            </el-table-column>
            <el-table-column prop="content" label="内容" width="250">
            </el-table-column>
            <el-table-column prop="createTime" label="评论时间" width="150">
                <template slot-scope="scope">
                    {{new Date().format(scope.row.createTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="articleId" label="评论文章ID" width="100">
            </el-table-column>
            <el-table-column prop="parentId" label="是否层主" width="100">
                <template slot-scope="scope">
                    <el-button class="admin_display_button" v-if="scope.row.parentId != undefined" type="info">{{'否'}}</el-button>
                    <el-button class="admin_display_button" v-if="scope.row.parentId ==undefined" type="primary">{{'是'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90px">
                <template slot-scope="scope">
                    <el-popconfirm title="确定删除吗？(删除层主评论会导致整层被删除)" @onConfirm="deleteComment(scope.row.id)">
                        <el-button slot="reference" class="admin_display_button" type="danger"
                            size="mini">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 3px;text-align: left;" @current-change="currentChange"
            :current-page.sync="page" :page-size="size" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
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
            async deleteComment(id) {
                let data = {}
                await this.$basicPost("/user/deleteComment", { id: id }, data);
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
            },
            async handleData() {
                this.loading = true
                let data = {}
                await this.$basicPost("/admin/comments", { page: this.page }, data);
                if (data.success && data.data.data.code == 200) {
                    this.tableData = data.data.data.data.comments.records;
                    this.total = data.data.data.data.comments.total;
                    this.size = data.data.data.data.comments.size;
                    this.page = data.data.data.data.comments.current;
                } else {
                    this.$notify({
                        title: '提示',
                        message: data.data.data.code == 600 ? data.data.data.message : "获取评论失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
                this.loading = false
            }
        },
        mounted() {
            this.handleData();
        },
    }
</script>