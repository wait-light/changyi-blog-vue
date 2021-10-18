<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" height="calc(100vh - 136px)" border style="width: 100%;">
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="user.nickname" label="作者" width="120px" s>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="126px">
                    <template slot-scope="scope">
                        {{new Date().format(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="126px">
                    <template slot-scope="scope">
                        {{new Date().format(scope.row.updateTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="126px">
                    <template slot-scope="scope">
                        {{new Date().format(scope.row.publishTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="90px">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="24" v-for="(code,index) in article_status_code">
                                <el-button class="admin_display_button" @click="functionControl(index,true,scope.row)"
                                    v-if="(scope.row.status&code) == code" :type="article_status[index][2]" size="mini">
                                    {{article_status[index][0]}}
                                </el-button>
                            </el-col>
                            <el-col :span="24" v-for="(code,index) in article_status_code">
                                <el-button class="admin_display_button" @click="functionControl(index,false,scope.row)"
                                    v-if="(scope.row.status&code) != code" :type="article_status[index][3]" size="mini">
                                    {{article_status[index][1]}}
                                </el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="pureString" label="内容" width="200px">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="80px">
                    <template slot-scope="scope">
                        <el-button size="small">{{scope.row.type.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="pageviews" label="浏览量" width="80px">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button class="admin_display_button" type="danger" size="small"
                            @click='handleDelete(scope.row.id)'>删除</el-button><br />
                        <el-button class="admin_display_button" type="primary" size="small"
                            @click="$toWhere('/admin/article/edit/'+scope.row.id)">文章编辑
                        </el-button><br />
                        <el-button class="admin_display_button" type="success" size="small"
                            @click='prepareHistory(scope.row.id)'>恢复历史</el-button><br />
                    </template>
                </el-table-column>
        </el-table>

        <el-pagination style="margin-top: 3px;text-align: left;" @current-change="currentChange"
            :current-page.sync="page" :page-size="size" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog :visible.sync="dialogVisible" width="100%">
            <div style="text-align: center;" v-if="historyDis">
                <div style="margin-bottom: 20px;" class="basic_font_title_xs">{{historyDis.title}}</div>
                <el-button style="margin-bottom: 10px;" type="primary">{{($typesMap.get(historyDis.typeid)).name}}
                </el-button>
                <mavon-editor :boxShadow="boxShadow" :ishljs="ishljs" v-model="historyDis.content" :subfield="subfield"
                    :defaultOpen="defaultOpen" :editable="editable" :toolbarsFlag="toolbarsFlag" />
            </div>
            <span slot="footer" class="dialog-footer">
                <template>
                    <el-select v-model="historyIndex" @change="historyDis = historys[historyIndex]" placeholder="请选择"
                        style="margin-right: 10px;">
                        <el-option v-for="(history,index) in historys" :key="history.id"
                            :label="index +'.  '+ history.title" :value="index">
                        </el-option>
                    </el-select>
                </template>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="backArticle">恢复</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                article_status: [["已发布", "未发布", "success", "info"], ["私人文章", "非私人文章", "danger", "info"]],
                article_status_code: [1, 2],
                tableData: [

                ],
                historyDis: "",
                historyIndex: 0,
                historyID: -1,
                page: 1,//当前页数
                total: 0,//文章总数量
                size: 0,//单页数量
                historys: [],//恢复历史
                dialogVisible: false,
                editable: false,//不可以编辑
                toolbarsFlag: false,//工具栏显示
                subfield: false,//false只显示内容框
                ishljs: true,//开启代码高亮
                defaultOpen: "preview",//默认显示内容
                boxShadow: true, //阴影
                loading: false,

            }
        },
        methods: {
            async functionControl(index, is, row) {
                //根据不同的index和is调用不同的方法
                let url = ""
                let da = this.tableData.find(data => data.id == row.id);
                let newStatus = (da.status ^= (1 << index));
                let data = {}
                if (is) {
                    switch (index) {
                        case 0: url = "/admin/downArticle"; break;
                        case 1: url = "/admin/changeArticlePersonal"; break;
                    }
                } else {
                    switch (index) {
                        case 0: url = "/admin/upArticle"; break;
                        case 1: url = "/admin/changeArticlePersonal"; break;
                    }
                }
                this.loading = true
                await this.$basicPost(url, { id: row.id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                    da.status = newStatus
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "失败",
                        duration: 1000,
                        type: 'warning'
                    });
                }
                this.loading = false
            },
            async currentChange() {
                await this.handleData()
            },
            async handleDelete(id) {
                this.$confirm('此操作将永久删除该文章，同时历史记录也会删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let data = {}
                    await this.$basicPost("/admin/articleDelete", { id: id }, data);
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
                await this.$basicPost("/admin/articleList", { page: this.page }, data);
                if (data.success && data.data.data.code == 200) {
                    this.tableData = data.data.data.data.articles.records;
                    this.total = data.data.data.data.articles.total;
                    this.size = data.data.data.data.articles.size;
                    this.page = data.data.data.data.articles.current;
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.tableData[i].user = data.data.data.data.authors[i]
                        this.tableData[i].type = this.$typesMap.get(this.tableData[i].typeid)
                    }
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "获取文章失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
                this.loading = false
            },
            async prepareHistory(id) {
                this.historyID = id;
                await this.getHistory();
            },
            async getHistory() {
                let data = {}
                await this.$basicPost("/admin/articleHistory", { id: this.historyID }, data)
                if (data.success && data.data.data.code == 200) {
                    this.historys = data.data.data.data.historys;
                    if (this.historys.length != 0) {
                        this.dialogVisible = true;
                        this.historyDis = this.historys[0];
                    } else {
                        this.dialogVisible = false;
                        this.$notify({
                            message: "无历史记录",
                            duration: 1000,
                            type: 'info'
                        });
                    }
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "获取文章历史失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
            },
            async backArticle() {
                let data = {}
                await this.$basicPost("/admin/historyToArticle", { historyId: this.historyDis.id, articleID: this.historyID }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "恢复失败",
                        duration: 1000,
                        type: 'warning'
                    });
                }
                this.dialogVisible = false;
            }
        },
        mounted() {
            this.handleData();
        },

    }
</script>