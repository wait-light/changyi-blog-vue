<template>
    <div>
        <wave></wave>
        <div class="article_container_outSide">
            <div class="article_detail_box">
                <mavon-editor v-loading="loading" style="position: relative;" element-loading-text="拼命加载中"
                    class="index_article_displayBox" :boxShadow="boxShadow" :ishljs="ishljs" v-model="content"
                    :subfield="subfield" :defaultOpen="defaultOpen" :editable="editable" :toolbarsFlag="toolbarsFlag"
                    :navigation="navigation" :toolbars="toolbars" :style="sizeControll" @navigationToggle="changeSize" />
            </div>
            <div class="index_article_detail_message">
                <div>
                    <span class="iconfont icon-tag" style="margin-right: 5px;"></span>
                    <el-tag class="index_tag_hover" @click='pushTag(tag.id)' :key="tag.id" v-for="(tag,index) in tags"
                        :type="$color[index % $color.length]">
                        {{tag.name}}
                    </el-tag>
                </div>
                <div class="basic_font_assist"><span class="iconfont icon-time">
                        最近更新：{{new Date().format(new Date(update_time))}}</span></div>
            </div>
            <comment class="index_article_detail_message" :article_id="$route.params.id"></comment>
            <el-backtop style="z-index: 10000;"></el-backtop>
        </div>
    </div>
    
</template>
<script>
    import wave from './waves.vue'
    import comment from '../comment.vue';
    import { mapMutations } from 'vuex'
    import { mapState } from "vuex";
    export default {
        data() {
            return {
                sizeControll: "",
                tags: [],
                type: {},
                title: "",
                publish_time: "",
                pageviews: 0,
                update_time: "",
                author: "",
                content: "",//文章内容
                editable: false,//不可以编辑
                toolbarsFlag: true,//工具栏显示
                navigation: false,//显示导航栏
                subfield: false,//false只显示内容框
                ishljs: true,//开启代码高亮
                defaultOpen: "preview",//默认显示内容
                boxShadow: false, //阴影
                toolbars: {
                    readmodel: true, // 沉浸式阅读
                    navigation: true, // 导航目录
                },
                loading: false,
                pic: ""
            }
        },
        methods: {
            ...mapMutations([
                "changteStyle",
                "changeText",
                "changeDownButton",
                "openOrCloseButton",
                "changeContent"
            ]),
            pushType(id) {
                this.$router.push("/index/type/" + id);
            },
            pushTag(id) {
                this.$router.push("/index/tag/" + id);
            },
            changeSize(status) {
                if (status) {
                    this.sizeControll = "height:calc(100vh - 222px);"
                } else {
                    this.sizeControll = ""
                }
            },
            async getArtilceMessage(id) {
                this.loading = true
                let data = {}
                await this.$basicPost("/common/getArticleDetail", { aritlceID: id }, data);
                if (data.success && data.data.data.code == 200) {
                    data = data.data.data.data;
                    this.tags = data.tags;
                    this.title = data.article.title;
                    this.publish_time = data.article.publishTime;
                    this.update_time = data.article.updateTime;
                    this.pageviews = data.article.pageviews;
                    this.type = data.type;
                    this.content = data.article.content;
                    this.author = data.author;
                    this.pic = data.article.pic
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "文章获取失败"
                    });
                }
                this.loading = false
            }
        },
        async mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "indexsettings"))
            let background_img=""
            if(obj  && obj.values){
                obj = obj.values
            }
            if (obj) {
                background_img = obj.articleDefultBackground;
            }
            if(!background_img){
                background_img = "https://tva2.sinaimg.cn/large/008c2CqBly1gleducrpgyj311i1kyqg6.jpg";
            }
            this.changteStyle({ key: "height", value: "50vh" })
            this.bigTitle.downButton.anotherOpen = false
            this.mainer.additional = 0
            this.mainer.style["margin-top"] = -this.mainer.additional + "px"
            this.changeContent("")
            if (this.$route.params.id) {
                await this.getArtilceMessage(this.$route.params.id);
                this.changeText(this.title)
                this.changeContent(`<span class="iconfont icon-time" style="color:white;padding:10px;">` + new Date().format(this.publish_time) + `</span>
                                    <span class="iconfont icon-chakan" style="color:white;padding:10px;">` + this.pageviews + `</span>
                                   <a class="link_2_button" href='/index/type/` + this.type.id + `'>` + this.type.name + `</a>`)
                if (this.pic) {
                    this.changteStyle({ key: "background-image", value: "url('" + this.pic + "')" })
                } else {
                    this.changteStyle({key:"background-image",value:"url('" + background_img + "')"})
                }
            }
        },
        computed: {
            ...mapState({
                "bigTitle": state => state.title,
                "mainer": state => state.mainer
            }),
        },
        components: {
            comment,
            wave
        }

    }
</script>