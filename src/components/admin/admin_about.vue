<template>
    <div class="admin_mainer_article">

        <!-- 居中显示 -->
        <el-row>
            <!-- 占位格,便于调整位置 -->
            <el-col :xs="0" :sm="1" :md="8" :lg="8"><br /></el-col>
            <el-col :span="24">
                
            </el-col>
        </el-row>
        <div class="admin_mainer_article_content">
            <mavon-editor :toolbars="toolbars" @fullScreen="fullScreen" :style="sizeControll" v-model="content"
                :ishljs="true" />
        </div>
        <el-button type="primary" @click="save"  v-loading="loading" element-loading-text="保存中">保存</el-button>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading:false,
                id: -1,
                time_open: false,
                time: new Date(),
                content: "",
                sizeControll: "height: calc(100vh - 362.2px);",
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: false, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }
            }
        },
        methods: {
            fullScreen(status, value) {//填充整个屏幕事件
                if (status) {
                    this.sizeControll = "height: 100vh;"
                } else {
                    this.sizeControll = "height: calc(100vh - 362.2px);"
                }
            },
            async save() {
                let data = {}
                this.loading = true
                await this.$basicPost("/superAdmin/setMap", { key: "about", value:JSON.stringify(this.content) }, data)
                if (data.success && data.data.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: data.data.data.message
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "设置失败"
                    });
                }
                this.loading = false
            }

        },
        mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "about")).values
            if (obj) {
                this.content = obj;
            }
        },
    }
</script>