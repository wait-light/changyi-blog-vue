<template>
  <div class="about_me_box">
    <mavon-editor class="index_article_displayBox" :boxShadow="boxShadow" :ishljs="ishljs" v-model="content"
      :subfield="subfield" :defaultOpen="defaultOpen" :editable="editable" :toolbarsFlag="toolbarsFlag"
      :navigation="navigation" />
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import { mapState } from "vuex";
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        content: "",//文章内容
        editable: false,//不可以编辑
        toolbarsFlag: false,//工具栏显示
        navigation: false,//显示导航栏
        subfield: false,//false只显示内容框
        ishljs: true,//开启代码高亮
        defaultOpen: "preview",//默认显示内容
        boxShadow: false, //阴影

      }
    }, computed: {
      ...mapState(["title", "mainer"]),
    },
    methods: {
      ...mapMutations([
        "changteStyle",
        "changeText",
        "changeDownButton",
        "openOrCloseButton",
        "changeContent"
      ]),
    },
    mounted() {
      let obj = (this.$basicConfig.map.find(k => k.key == "about")).values
      if (obj) {
        this.content = obj;
      } else {
        this.content = "这个人很懒，什么都没有留下！"
      }
      obj = (this.$basicConfig.map.find(k => k.key == "indexsettings")).values
      let background_img = ""
      let text = ""
      if (obj && obj.values) {
        obj = obj.values
      }
      if (obj) {
        background_img = obj.aboutMeBackground;
        text = obj.aboutMeText
      }
      if (!background_img) {
        background_img = "https://tva4.sinaimg.cn/large/008c2CqBly1glei1odrjhj30xc0irkbc.jpg";
        text = "关于我";
      }
      this.mainer.additional = 100
      this.title.downButton.anotherOpen = false
      this.mainer.style["margin-top"] = -this.mainer.additional + "px"
      this.changteStyle({ key: "background-image", value: "url('" + background_img + "')" })
      this.changeContent("")
      this.changeText(text)
      this.changteStyle({ key: "height", value: "60vh" })
    },
  }
</script>