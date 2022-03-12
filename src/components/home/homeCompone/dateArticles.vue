<template>
    <el-row v-loading="loading" element-loading-text="拼命加载中">
        <el-col :xs="0" :sm="1" :md="4" :lg="4">
            <br />
        </el-col>
        <el-col :xs="24" :sm="20" :md="16" :lg="16">
            <div class="date_article_box basic_border_shadow">
                <h2 class="basic_untouch " v-if="!articles || articles.length == 0">什么都没有</h2>
                <el-collapse v-model="activeName" accordion class="basic_font_title_xs">
                    <el-collapse-item
                        style="background: black;"
                        v-for="(date, index) in dates"
                        :key="date"
                        :title="new Date().format_maxMouth(date)"
                        :name="index + 1"
                    >
                        <el-button
                            @click="$toWhere("/artileDetai/" + article.id)"
                            style="width: 100%;font-size: medium;"
                            v-for="article in articles[index]"
                            size="small"
                            type="text"
                        >{{ article.title }}</el-button>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { mapMutations } from 'vuex'
import { mapState } from "vuex";
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            articles: [],
            dates: [],
            activeName: "1",
            loading: false
        }
    },
    methods: {
        ...mapMutations([
            "changeDownButton", "changteStyle", "changeText", "openOrCloseButton", "changeContent"
        ]),
        ...mapActions(["scrollTo"]),
        async getDateArticle() {
            this.loading = true
            let data = {}
            await this.$basicPost("/common/dateArticles", "", data);
            if (data.success) {
                this.articles = data.data.data.data.articles;
                this.dates = data.data.data.data.dates;
            } else {
                this.$message({
                    type: 'warning',
                    message: data.data.data.code == 600 ? data.data.data.message : "获取失败"
                });
            }
            this.loading = false
        }
    },
    computed: {
        ...mapState(["title", "mainer"]),
    },
    mounted() {
        let obj = (this.$basicConfig.map.find(k => k.key == "indexsettings"))
        let background_img = ""
        let text = ""
        if (obj && obj.values) {
            obj = obj.values
        }
        if (obj) {
            background_img = obj.dateBackground;
            text = obj.dateText
        }
        if (!background_img) {
            background_img = "https://tva1.sinaimg.cn/large/008c2CqBly1glezado8ikj32yo1o0hdt.jpg";
            text = "归档";
        }
        this.changeText(text)
        this.changteStyle({ key: "background-image", value: "url('" + background_img + "')" })
        this.getDateArticle();
        this.mainer.additional = 150
        this.changeContent("")
        this.mainer.style["margin-top"] = -this.mainer.additional + "px"
        this.changteStyle({ key: "height", value: "80vh" })
        this.title.downButton.anotherOpen = false
    },
}
</script>