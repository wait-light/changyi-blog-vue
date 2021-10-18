<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <div class="admin_message_container">
            <div class="admin_message_box">
                <div class="el-icon-s-custom admin_message_title">用戶总数：</div><br>
                <div class="admin_message_context">{{userNumber}}</div>
            </div>
            <div class="admin_message_box">
                <div class="el-icon-reading admin_message_title">发布文章总数：</div><br>
                <div class="admin_message_context"> {{articleNumber}}</div>
            </div>
        </div>
        <div class="admin_message_container">
            <div class="admin_message_box">

                <div class="el-icon-s-comment admin_message_title">评论总数：</div><br>
                <div class="admin_message_context"> {{commentNumber}}</div>
            </div>
            <div class="admin_message_box">

                <div class="el-icon-connection admin_message_title">友链总数：</div><br>
                <div class="admin_message_context"> {{friendNumber}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                userNumber: 0,
                articleNumber: 0,
                commentNumber: 0,
                friendNumber: 0,
                loading :false
            }
        },
        methods: {
            async handleData() {
                this.loading = true;
                let data = {}
                await this.$basicPost("/admin/adminHomeMessage", "", data);
                if (data.success && data.data.data.code == 200) {
                    data = data.data.data.data
                    this.userNumber = data.userNumber
                    this.articleNumber = data.articleNumber
                    this.commentNumber = data.commentNumber
                    this.friendNumber = data.friendNumber
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "信息获取失败"
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