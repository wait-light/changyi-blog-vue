<template>
    <div>
        <!-- 居中显示 -->
        <el-row style="position: relative;">
            <!-- 占位格,便于调整位置 -->
            <el-col :xs="0" :sm="1" :md="2" :lg="2"><br></el-col>
            <!-- 文章内容格子 -->
            <el-col :xs="24" :sm="14" :md="18" :lg="18">
                <div class="index_mainer_container" v-loading="loading" element-loading-text="拼命加载中">
                    <div>
                        <div style="width: 100%;" class="index_mainer_container_box index_article_list_title basic_untouch"
                            v-if="!articles || articles.length == 0">
                            这个标签/分类什么都没有，看看其他的吧！
                        </div>
                        <div class="index_mainer_container_box" :key="index" v-for="(article,index) in articles">
                            <div class="index_article_list_innerbox">
                                <div class="index_article_list_left">
                                    <div v-if="article.pic" class="index_article_pic" :style="'background-image:url('+  article.pic + ')' "><br></div>
                                    <div v-if="!article.pic" class="index_article_pic" :style="'background-image:url(https://tva2.sinaimg.cn/large/008c2CqBly1gleducrpgyj311i1kyqg6.jpg)'"><br></div>
                                </div>
                                <div class="index_article_list_right">
                                    <div>
                                        <a class="index_article_list_title"
                                            :href="'/artileDetai/'+article.id">{{article.title}}</a>
                                        <span @click="$toWhere('/admin/article/edit/' + article.id)"
                                            v-if="canEdit(authors[index])" class="el-icon-edit spen_2_canclick">
                                        </span>
                                    </div>
                                    <div class="basic_font_text index_article_list_title_initially">
                                        {{article.pureString + " ...."}}</div>
                                    <div class="index_article_list_title_tips" style="text-align: center;">
                                        <span class="iconfont icon-time">
                                            <span>
                                                {{new Date().format(new Date(article.publishTime))}}
                                            </span>
                                        </span>

                                        <span class="iconfont icon-user">
                                            <span>
                                                {{authors[index].nickname}}
                                            </span>
                                        </span>
                                        <span class="iconfont icon-category ">
                                            <span class="span_2_button"
                                                @click='getArticleListByTypeid(article.typeid,1)'>
                                                {{(getType(article.typeid)).name}}
                                            </span>
                                        </span>
                                        <span class="iconfont icon-view">
                                            <span>
                                                {{article.pageviews}}
                                            </span>
                                        </span>
                                    </div>
                                    <div class="index_article_tags">
                                        <span class="iconfont icon-tag" style="margin-right: 5px;"></span>
                                        <el-tag class="index_tag_hover" :key="tag.id"
                                            v-for="(tag,tagindex) in tags[index]"
                                            @click='getArticleListByTagid(tag.id,1)'
                                            :type="$color[tagindex % $color.length]">
                                            {{tag.name}}
                                        </el-tag>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="block index_article_page">
                        <el-pagination @current-change="currentChange" :current-page.sync="current" :page-size="size"
                            layout="prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
            <!-- 侧边信息栏  -->
            <el-col :xs="24" :sm="9" :md="4" :lg="4" class="index_sider_outter">
                <div class="index_mainer_container_sm">
                    <div class="index_mainer_container_box_sm basic_font_title_xs">
                        <label class="basic_untouch">分类</label><br>
                        <el-button class="type_button" type="primary" round size="mini" v-for="type in this.$basicConfig.types"
                            :key="type.name" @click="getArticleListByTypeid(type.id,1)">
                            {{type.name}}
                        </el-button>
                    </div>
                    <div class="index_mainer_container_box_sm basic_font_title_xs">
                        <label class="basic_untouch">标签云</label><br>
                        <el-tag class="index_tag_hover" :key="tag.id" v-for="(tag,index) in this.$basicConfig.tags"
                            :disable-transitions="false" @click='getArticleListByTagid(tag.id,1)'
                            :type="$color[index % $color.length]">
                            {{tag.name}}
                        </el-tag>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import { mapMutations } from 'vuex'
    import { mapState } from "vuex";
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                articles: [],//文章列表
                tags: [],//每个文章对应的标签
                authors: [],//作者
                current: 0,//当前页
                pages: 0,//总页数，应该是吧。。
                size: 0,//每页数量
                total: 0,//文章总数
                type: "",//分页类型：''【普通】,'type'【类型】,tag【标签】
                id: 0,
                loading: false,
                searchString: "",
            }
        },
        methods: {
            ...mapMutations([
                "changteStyle",
                "changeText",
                "changeDownButton",
                "openOrCloseButton",
                "changeContent",
                "clickButton"
            ]),
            ...mapActions(
                ["scrollTo"]),
            canEdit(user) {
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
            fillData(data) {
                this.tags.length = 0;//清空数组，防止组件重用，数据污染
                this.articles = data.articles.records;
                this.pages = data.articles.pages;
                for (let i = 0; i < data.tags.length; i++) {
                    let tagArray = []
                    for (let j = 0; j < data.tags[i].length; j++) {
                        tagArray.push(this.$tagsMap.get(data.tags[i][j]));
                    }
                    this.tags.push(tagArray);
                }
                this.authors = data.authors;
                this.current = data.articles.current;
                this.size = data.articles.size;
                this.total = data.articles.total;
            },
            async getArticleList(page) {
                this.loading = true
                let outdate;
                let url;
                if (this.type == 'tag') {
                    outdate = { tagid: this.id, page };
                    url = "/common/indexArticlePageByTag"
                } else if (this.type == "type") {
                    outdate = { page, type: this.id }
                    url = "/common/indexArticlePageByType"
                } else if (this.type == "search") {
                    outdate = { page, searchString: this.searchString }
                    url = "/common/indexArticlePageSearch"
                } else {
                    outdate = { page }
                    url = "/common/indexArticlePage"
                }
                let data = {}
                await this.$basicPost(url, outdate, data);
                if (data.success && data.data.data.code == 200) {
                    data = data.data.data.data;
                    this.fillData(data);
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "文章获取失败"
                    });
                }
                this.loading = false
                scrollTo(0, 0);//返回页面开头
            },
            getType(id) {
                for (let i = 0; i < this.$basicConfig.types.length; i++) {
                    if (this.$basicConfig.types[i].id == id) {
                        return this.$basicConfig.types[i];
                    }
                }
            },
            async getArticleListByTagid(tagid, page) {
                this.type = "tag";
                this.id = tagid;
                await this.getArticleList(page);
            },
            async getArticleListByTypeid(type, page) {
                this.type = "type";
                this.id = type;
                await this.getArticleList(page);
            },
            async currentChange(page) {
                await this.getArticleList(page);
                this.clickButton()
            },
            async getSearchArticle(searchString, page) {
                this.type = "search",
                    this.searchString = searchString;
                await this.getArticleList(page);
            }
        },
        mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "indexsettings"))
            let background_img=""
            let text = ""
            if(obj  && obj.values){
                obj = obj.values
            }
            if (obj) {
                background_img = obj.indexBackground;
                text = obj.indexText
            }
            console.log(background_img)
            if(!background_img){
                background_img = "https://tva4.sinaimg.cn/large/008c2CqBly1glez5j8jf9j33uw2kle82.jpg";
                text = "主页";
            }
            this.changeText(text)
            this.changteStyle({key:"background-image",value:"url('" + background_img + "')"})
            this.mainer.additional = 0
            this.title.downButton.anotherOpen = true
            this.mainer.style["margin-top"] = -this.mainer.additional +"px"
            this.changeContent("")
            this.changteStyle({key:"height",value:"100vh"})
            this.changeDownButton({
                "fun": () => {
                    this.scrollTo({x:0,y:600})
                },
            })
            if (this.$route.params.page) {
                this.type = ''
                this.getArticleList(this.$route.params.page)
            } else if (this.$route.params.type) {
                this.type = 'type'
                this.id = this.$route.params.type
                this.getArticleList(1)
            } else if (this.$route.params.tag) {
                this.type = 'tag'
                this.id = this.$route.params.tag
                this.getArticleList(1)
            }
        },
        computed: {
            ...mapState(["title","mainer"]),
        },
    }
</script>