<template>
    <div>
        <div class="friends_big_box" v-loading="loading" element-loading-text="拼命加载中">
            <el-row>
                <el-col :xs="24" :md="6" :lg="4" v-for="friend in friends" style="margin: 10px;">
                    <div class="friends_small_box basic_border_shadow friends_small_box_title"  @click="toWhere(friend.url)">
                        <div :src="friend.url">
                            {{friend.title}}</div>
                        <div class="friends_content_box">{{friend.content}}</div>
                    </div>
                </el-col>
            </el-row>
            <wave></wave>
        </div>
    </div>
</template>
<script>
    import wave from './waves.vue'
    import { mapMutations } from 'vuex'
    import { mapState } from "vuex";
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                friends: [

                ],
                loading: false
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
            toWhere(url) {
                let index = url.indexOf("http://");
                let sindex = url.indexOf("https://");
                if (index != 0 && sindex != 0) {
                    url = "http://" + url;
                }
                window.open(url);
            },
            async handleData() {
                this.loading = true
                let data = {}
                await this.$basicPost("/common/allFriends", "", data);
                if (data.success && data.data.data.code == 200) {
                    this.friends = data.data.data.data.friends;
                } else {
                    this.$notify({
                        title: '提示',
                        message: data.data.data.code == 600 ? data.data.data.message : "获取友情链接失败",
                        duration: 1000,
                        type: 'warining'
                    });
                }
                this.loading = false
            }
        },
        computed: {
            ...mapState(["title","mainer"]),
        },
        async mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "indexsettings"))
            let background_img=""
            let text = ""
            if(obj  && obj.values){
                obj = obj.values
            }
            if (obj) {
                background_img = obj.friendsBackground;
                text = obj.friendsText
            }
            if(!background_img){
                background_img = "https://tvax1.sinaimg.cn/large/008c2CqBly1glehwisprej31hc0u0u0y.jpg";
                text = "朋友们";
            }
            this.changeText(text)
            this.changteStyle({key:"background-image",value:"url('" + background_img + "')"})
            this.mainer.additional = 100
            this.title.downButton.anotherOpen = false
            this.mainer.style["margin-top"] = -this.mainer.additional +"px"
            this.changeContent("")
            this.changteStyle({key:"height",value:"50vh"})
            await this.handleData();
        },
        components:{
            wave
        }
    }
</script>