<template>
    <div class="comment_conpents">
        <el-dialog title="评论" :visible.sync="centerDialogVisible" width="30%" :modal-append-to-body='false' center>
            <span slot="footer" class="dialog-footer">
                <el-input type="textarea" :rows="2" placeholder="输入你的评论" v-model="comment_string"></el-input>
                <div style="margin-left: 5px;" class="comment_button" @click="sendBack">评论</div>
            </span>
        </el-dialog>
        <div>
            <el-row>
                <el-col :xs="4" :sm="1" :md="1" :lg="1">
                    <img class="avatar_style" v-if="$basicConfig.user.avatar!=undefined"
                        :src='"data:image/jpg;base64,"+ $basicConfig.user.avatar' />
                    <el-image class="avatar_style" v-if="$basicConfig.user.avatar==undefined">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </el-col>
                <el-col :xs="16" :sm="22" :md="22" :lg="22">
                    <el-input type="textarea" :rows="2" placeholder="输入你的评论" v-model="comment_string"></el-input>
                </el-col>
                <el-col style="margin-top: 12px;" :xs="4" :sm="1" :md="1" :lg="1">
                    <div style="margin-left: 5px;" class="comment_button" @click="makeComment">评论</div>
                </el-col>
            </el-row>
            <div class="comment_big_box" v-for="(comment,index) in comments">
                <el-divider content-position="left">{{"第"+(index+1)+"楼"}}</el-divider>
                <div v-for="(com,comindex) in comment" :key="com.id">
                    <el-row v-if='comindex == 0'>
                        <el-col :xs="4" :sm="2" :md="2" :lg="1" class="comment_header">
                            {{findUser(com.userid).nickname}}
                            <img class="avatar_style" :src='"data:image/jpg;base64,"+ findUser(com.userid).avatar' />
                        </el-col>
                        <el-col :xs="20" :sm="22" :md="22" :lg="23" class="basic_font_text_sm">
                            <div class="comment_detail">
                                {{com.content}}
                                <div class="comment_button" style="margin-left: 10px;"
                                    @click='rebackBox(com.floorId,com.id)'>回复</div>
                                <el-popconfirm title="确定删除吗？(删除层主评论会导致整层被删除)" @onConfirm="deleteComment(com.id)">
                                    <div slot="reference" v-if="canDelete(com.userid)" class="comment_button"
                                        style="margin-left: 10px;background: red;color: white;">
                                        删除</div>
                                </el-popconfirm>

                            </div>
                        </el-col>
                    </el-row>
                    <el-row v-if='comindex != 0' class="comment_small_box">
                        <el-col :xs="4" :sm="2" :md="2" :lg="1" class="comment_header">
                            {{findUser(com.userid).nickname}}
                            <img class="avatar_style" :src='"data:image/jpg;base64,"+ findUser(com.userid).avatar' />
                        </el-col>
                        <el-col :xs="20" :sm="22" :md="22" :lg="23" class="basic_font_text_sm">
                            <div class="comment_detail">
                                {{com.content}}
                                <div class="comment_button" style="margin-left: 10px;"
                                    @click='rebackBox(com.floorId,com.id)'>回复</div>
                                <el-popconfirm title="确定删除吗？(删除层主评论会导致整层被删除)" @onConfirm="deleteComment(com.id)">
                                    <div slot="reference" v-if="canDelete(com.userid)" class="comment_button"
                                        style="margin-left: 10px;background: red;color: white;">
                                        删除</div>
                                </el-popconfirm>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div @click="makeMore" class="make_more_comment" v-if='page * size < total'>
                <el-button type="text" size="mini">加载更多</el-button>
            </div>

        </div>
    </div>
</template>
<script>
    export default {
        name: "comment",
        props: {
            article_id: {
                required: true
            }
        },
        data() {
            return {
                comments: [],
                comment_string: "",
                users: [],
                page: 1,
                size: 0,
                total: 0,
                centerDialogVisible: false,
                floor_id: -1,
                parent_id: -1
            }
        },
        mounted() {
            this.getArticleComment()
        },
        methods: {
            async makeMore() {
                this.page++;
                await this.getArticleComment();
            },
            async deleteComment(id) {
                let data = {}
                await this.$basicPost("/user/deleteComment", { id: id }, data);
                if (data.success && data.data.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: data.data.data.message
                    });
                    this.getClearArticleComment()
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "删除失败"
                    });
                }
            },
            canDelete(userid) {
                let user = this.findUser(userid);
                if (this.$basicConfig.user == "anonymousUser") {
                    return false;
                }
                if (this.$basicConfig.user.id = user.id) {
                    return true;
                }
                if (this.$basicConfig.user.userType > user.userType) {
                    return true;
                }
                return false;
            },
            async getClearArticleComment() {
                let data = {}
                await this.$basicPost("/common/articleComments", { id: this.article_id, page: this.page }, data)
                if (data.success && data.data.data.code == 200) {
                    data = data.data.data.data;
                    if (data.comments)
                        this.comments = data.comments
                    if (data.users)
                        this.users = data.users
                    this.size = data.pageMessage.size
                    this.total = data.pageMessage.total
                } else {
                    this.$message({
                        type: 'warning',
                        message: "获取评论失败"
                    });
                }
            },
            async getArticleComment() {
                let data = {}
                await this.$basicPost("/common/articleComments", { id: this.article_id, page: this.page }, data)
                if (data.success && data.data.data.code == 200) {
                    data = data.data.data.data;
                    if (data.comments)
                        for (let i = 0; i < data.comments.length; i++) {
                            this.comments.push(data.comments[i])
                        }
                    if (data.users)
                        for (let i = 0; i < data.users.length; i++) {
                            this.users.push(data.users[i]);
                        }
                    this.size = data.pageMessage.size
                    this.total = data.pageMessage.total
                } else {
                    this.$message({
                        type: 'warning',
                        message: "获取评论失败"
                    });
                }
            },
            async makeComment(floor_id, parent_id) {
                if (this.$basicConfig.user == "anonymousUser") {
                    this.$message({
                        type: 'warning',
                        message: "请先登录！"
                    });
                    return;
                }
                if (this.comment_string.length <= 1) {
                    this.$message({
                        type: 'warning',
                        message: "请至少大于1个字！"
                    });
                    return;
                }
                let data = {}
                let outdate = {}
                outdate.article_id = this.article_id;
                outdate.content = this.comment_string;
                if (floor_id != undefined && (typeof floor_id == "number"))
                    outdate.floor_id = floor_id;
                if (parent_id != undefined)
                    outdate.parent_id = parent_id;
                await this.$basicPost("/user/makeComment", outdate, data);
                if (data.success && data.data.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: data.data.data.message
                    });
                    this.comments = []
                    this.users = []
                    this.comment_string = ""
                    this.getArticleComment()
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "评论获取失败"
                    });
                }
            },
            findUser(userid) {
                let whereUserIn = (element) => element.id == userid;
                let index = this.users.findIndex(whereUserIn);
                return this.users[index];
            },
            rebackBox(floor_id, parent_id) {
                this.comment_string = ""
                this.centerDialogVisible = true;
                this.floor_id = floor_id
                this.parent_id = parent_id
            },
            sendBack() {
                this.makeComment(this.floor_id, this.parent_id)
                this.comment_string = ""
                this.centerDialogVisible = false
            }

        },
    }
</script>