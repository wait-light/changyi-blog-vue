<template>
    <div class="admin_mainer_article">

        <!-- 居中显示 -->
        <el-row>
            <!-- 占位格,便于调整位置 -->
            <el-col :xs="0" :sm="1" :md="8" :lg="8"><br /></el-col>
            <el-col :xs="24" :sm="22" :md="8" :lg="8"> 
                <el-input class="admin_mainer_article_title" placeholder="请输入标题" v-model="article.title">
                </el-input>
            </el-col>
            <el-col :span="24" v-loading="article_loading" element-loading-text="数据获取中">
                <div class="admin_mainer_article_content">
                    <mavon-editor :toolbars="toolbars" @fullScreen="fullScreen" :style="sizeControll" v-model="article.content"
                        :ishljs="true" />
                </div>
            </el-col>
            <el-col :span="24">
                <div class="admin_mainer_article_types" >
                    类别(必选)：
                    <el-select v-model="article.type" placeholder="请选择类别" >
                        <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id">
                        </el-option>
                    </el-select>
                    <div style="width: 150px;margin-left: 10px;" >
                        <el-input v-model="addtype" placeholder="添加分类（回车确认添加）"  @keyup.enter.native="addType" v-loading="loadingtype" element-loading-text="添加中"></el-input>
                    </div>
                </div>
                
            </el-col>
            <el-col :xs="0" :sm="1" :md="8" :lg="8"><br /></el-col>
            <el-col :xs="24" :sm="22" :md="8" :lg="8"> 
                <el-input class="admin_mainer_article_title" placeholder="请输入主题图片(可选)" v-model="article.pic">
                </el-input>
            </el-col>
            <el-col :span="24">
                <div class="admin_mainer_article_tags">
                    标签（可选）：
                    <el-checkbox-group v-model="article.tags">
                        <el-checkbox v-for="(tag,index) in tags" :key="tag.id" :label="tag.id">{{tag.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <div style="width: 150px;margin-left: 40px;" >
                        <el-input v-model="addtag" placeholder="添加标签（回车确认添加）"  v-loading="loadingtag" element-loading-text="添加中" @keyup.enter.native="addTag"></el-input>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="admin_mainer_article_time">
                发布时间（可选）：
                <el-checkbox v-model="time_open" style="margin-right: 5px;">开启</el-checkbox>
                <el-date-picker v-model="time" type="datetime" placeholder="选择发布日期">
                </el-date-picker>
            </el-col>
            <el-col :span="24" class="admin_mainer_article_time">
                私人文章：
                <el-checkbox v-model="article.personal" style="margin-right: 5px;">开启</el-checkbox>
            </el-col>
            <el-col :span="24" style="text-align: center;">
                <div v-if="!this.$route.params.id" v-loading="loading" element-loading-text="保存中">
                    <el-button icon="el-icon-upload" type="success" @click="submit">发布</el-button>
                    <el-button icon="el-icon-s-order" type="info" @click="submit('1')">存为草稿</el-button>
                </div>
                <div v-if="this.$route.params.id" v-loading="loading" element-loading-text="保存中">
                    <el-button icon="el-icon-s-check" type="warning" @click="edit">修改</el-button>
                </div>
            </el-col>

        </el-row>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading:false,
                article_loading:false,
                loadingtype:false,
                loadingtag:false,
                id: -1,
                time_open: false,
                time: new Date(),
                addtype:"",
                addtag:"",
                article: {
                    title: "",
                    content: "",
                    type: '',
                    tags: [],
                    personal:false,
                    pic:""
                },
                sizeControll: "height: calc(100vh - 362.2px);",
                types: [
                ],
                tags: [

                ],
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
            async submit(isSave) {
                if (!this.article.title) {
                    this.$notify({
                        title: '提示',
                        message: "请填写标题",
                        duration: 1000,
                        type: 'warning'
                    })
                    return;
                }
                if (!this.article.type) {
                    this.$notify({
                        title: '提示',
                        message: "请选择分类",
                        duration: 1000,
                        type: 'warning'
                    })
                    return;
                }
                this.loading = true
                let data = {}
                let post = this.article;
                if (this.time_open) {
                    post.time = this.time
                } else {
                    post.time = undefined
                }
                let url = "/admin/addArticle";
                if(isSave == "1"){
                    url = "/admin/saveArticle"
                }
                await this.$jsonPost(url, post, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        title: '提示',
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    })
                    if(this.id == -1){
                        this.$toWhere("/admin/article_list")
                    }
                } else {
                    this.$notify({
                        title: '提示',
                        message: data.data.data.code == 600 ? data.data.data.message : "文章操作失败",
                        duration: 1000,
                        type: 'warning'
                    })
                }
                this.loading = false
            },
            getTypesAndTags() {
                this.tags = this.$basicConfig.tags;
                this.types = this.$basicConfig.types;
            },
            async getDetail(id){
                this.article_loading = true
                let data = {};
                await this.$basicPost("/admin/articleDetail",{articleID:id},data);
                if(data.success){
                    data = data.data.data.data;
                    this.article.tags = data.tags;
                    this.article.type = data.type.id
                    this.article.content = data.article.content
                    this.article.title = data.article.title;
                    this.id = data.article.id;
                    this.personal = (data.article.status & 2) == 2
                    this.article.pic = data.article.pic
                }else{
                    thisVue.$notify({
                        title: '提示',
                        message: data.data.data.code==600?data.data.data.message:"获取文章详情失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
                this.article_loading = false
            },
            async addTag(){
                let data = {};
                this.loadingtag = true
                await this.$basicPost("/admin/addTag",{name:this.addtag},data);
                if(data.success &&data.data.data.code == 200){
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.addTag = ""
                    await this.$basicConfigGet()
                    this.getTypesAndTags();
                }else{
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code==600?data.data.data.message:'添加失败!'
                    });
                }
                this.loadingtag = false
            },
            async addType(){
                let data = {};
                this.loadingtype = true
                await this.$basicPost("/admin/addType",{name:this.addtype},data);
                if(data.success &&data.data.data.code == 200){
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.addtype = ""
                    await this.$basicConfigGet()
                    this.getTypesAndTags();
                }else{
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code==600?data.data.data.message:'添加失败!'
                    });
                }
                this.loadingtype = false
            },
            async edit(){
                if (!this.article.title) {
                    this.$notify({
                        title: '提示',
                        message: "请填写标题",
                        duration: 1000,
                        type: 'warning'
                    })
                    return;
                }
                if (!this.article.type) {
                    this.$notify({
                        title: '提示',
                        message: "请选择分类",
                        duration: 1000,
                        type: 'warning'
                    })
                    return;
                }
                let data = {}
                let post = this.article;
                this.loading = true
                if (this.time_open) {
                    post.time = this.time
                } else {
                    post.time = undefined
                }
                post.id = this.id;
                await this.$jsonPost("/admin/editArticle", post, data);
                if (data.success && data.data.data.code == 200) {
                    this.$notify({
                        message: data.data.data.message,
                        duration: 1000,
                        type: 'success'
                    })
                } else {
                    this.$notify({
                        message: data.data.data.code == 600 ? data.data.data.message : "文章操作失败",
                        duration: 1000,
                        type: 'warning'
                    })
                }
                this.loading = false
            }
        },
        mounted() {
            this.getTypesAndTags();
            if(this.$route.params.id){
                this.getDetail(this.$route.params.id);
            }
        },
    }
</script>