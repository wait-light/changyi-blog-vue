<template>
  <div class="index_container_outside">
    <div :class="header_class">
      <div :class="music_class" v-if="music.open">
        <aplayer autoplay :music="music.current_music" :mini="music.mini" :autoplay="music.autoplay" :list="music.list"
          :listFolded="music.listFolded" :float="music.float" />
      </div>
    
      <div class="index_header_router hidden-xs-only">
        <div class="header_button">
          <span class="iconfont icon-home spen_2_canclick" style="color: white;" @click="$toWhere('/index/1')">首页</span>
        </div>
        <div class="header_button">
          <span class="iconfont icon-time spen_2_canclick" style="color: white;" @click="$toWhere('/time')">归档</span>
        </div>
        <div class="header_button">
          <span class="iconfont icon-pengyou spen_2_canclick"style="color: white;"  @click="$toWhere('/friends')">友链</span>
        </div>
        <div class="header_button">
          <span class="iconfont icon-feed spen_2_canclick" style="color: white;" @click="$toWhere('/about')">关于我</span>
        </div>
        <div class="header_button" v-if="$basicConfig.user == 'anonymousUser'">
          <span class="iconfont icon-user spen_2_canclick"style="color: white;"  @click="$toWhere('/login')">登录</span>
        </div>
        <div class="header_button" v-if="$basicConfig.user != 'anonymousUser' && $basicConfig.user.userType >= 1">
          <span class="iconfont icon-user spen_2_canclick" style="color: white;" @click="$toWhere('/admin')">后台</span>
        </div>
        <div class="header_button" v-if="$basicConfig.user != 'anonymousUser'">
          <span class="iconfont icon-user spen_2_canclick" style="color: white;" @click="logout">退出</span>
        </div>
        <el-input @keyup.enter.native="search" placeholder="请输入内容" clearable v-model="search_string"
          style="margin-left: 10px;padding:5px" >
          <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div @click="siderOpen = true" class="iconfont icon-category index_header_tool hidden-sm-and-up"></div>
    </div>
    <div>
      <div :style="title.style">
        <div class="max_title basic_untouch" :style="title.textColor">{{ title.text }}</div>
        <div class="title_inner_content" v-html="title.content"></div>
        <div v-if="title.downButton.open && title.downButton.anotherOpen" class="max_title_down_box"
          @click="clickButton">
          <img class="max_title_down_box_button" src="../../assets/screen_dwon.png">
        </div>
      </div>

    </div>
    <div :class="mainer_class" :style="mainer.style">
      <router-view ref="mainRef"></router-view>
    </div>
    <el-drawer :visible.sync="siderOpen" :with-header="false" :size="'60%'">
      <div class="index_sider_inner">
        <el-menu style="text-align: center">
          <el-menu-item index="1">
            <i class="iconfont icon-home"></i>
            <span slot="title" @click="$toWhere('/index')">首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="iconfont icon-time"></i>
            <span slot="title" @click="$toWhere('/time')">归档</span>
          </el-menu-item>
          <el-menu-item index="7" @click="$toWhere('/friends')">
            <i class="iconfont icon-pengyou"></i>
            <span slot="title">友链</span>
          </el-menu-item>
          <el-menu-item index="9" @click="$toWhere('/about')">
            <i class="iconfont icon-feed"></i>
            <span slot="title">关于我</span>
          </el-menu-item>
          <el-menu-item index="3" v-if="$basicConfig.user == 'anonymousUser'" @click="$toWhere('/login')">
            <i class="iconfont icon-user"></i>
            <span slot="title">登录</span>
          </el-menu-item>
          <el-menu-item index="6" class="iconfont icon-earth"
            v-if="$basicConfig.user != 'anonymousUser' && $basicConfig.user.userType >= 1" @click="$toWhere('/admin')"
            size="mini" round>后台</el-menu-item>
          <el-menu-item index="3" v-if="$basicConfig.user != 'anonymousUser'" @click="logout">
            <i class="iconfont icon-user"></i>
            <span slot="title">退出</span>
          </el-menu-item>
          <el-menu-item>
            <el-input clearable @keyup.enter.native="search" placeholder="请输入内容" v-model="search_string"
              style="margin-left: 10px">
              <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  import { mapActions } from "vuex";
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
        music_class: ["music_box"],
        header_class: ["index_header", "basic_text_vertical"],
        mainer_class: ["index_mainer"],
        footer_class: ["index_footer"],
        blog_name: "徜逸的博客",
        scroll_flag: 0,
        music: {
          open: false,
        },
        search_string: "",
        style: {
          // "background-image": "url('https://w.wallhaven.cc/full/2e/wallhaven-2em38y.jpg')",
          "background-size": "contain",
          "background-repeat": "repeat",
        },
        siderOpen: false,
      };
    },
    computed: {
      ...mapState(["title", "mainer"]),
    },
    mounted() {
      // 监听滚动事件
      this.$nextTick(() => {
        window.addEventListener("scroll", this.handleScroll, true);
      });
      let obj = this.$basicConfig.map.find((k) => k.key == "music").values;
      if (obj) {
        this.music = obj;
        if (!obj.mini) {
          this.music_class.push("make_music_box");
        }
      }
      obj = this.$basicConfig.map.find((k) => k.key == "setting").values;
      if (obj) {
        document.title = obj.name + "的博客";
        this.blog_name = obj.name;
      }
    },
    methods: {
      ...mapActions(["scrollTo"]),
      ...mapMutations([
        "clickButton", "changeMainerStyle", "openOrCloseButton"
      ]),
      search() {
        if (this.$route.fullPath.indexOf("/index") == 0) {
          this.$refs.mainRef.getSearchArticle(this.search_string, 1);
        } else {
          this.$toWhere("/index/1");
          this.$refs.mainRef.getSearchArticle(this.search_string, 1);
        }
      },
      handleScroll() {
        // 页面滚动距顶部距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var scroll = scrollTop - this.scroll_flag;
        this.scroll_flag = scrollTop;
        let makeMainerUp = (scrollTop / 15) >= 150 ? 150 : scrollTop / 15;
        makeMainerUp += this.mainer.additional;
        this.changeMainerStyle({ key: "margin-top", value: - makeMainerUp + "px" })
        if (scrollTop >= 100) {
          this.openOrCloseButton(false)
        } else {
          this.openOrCloseButton(true)
        }
        if (scrollTop != 0) {
          if (!this.isContainElement(this.header_class, "index_header_down")) {
            this.header_class.push("index_header_down");
          }
        } else {
          this.delElement(this.header_class, "index_header_down");
        }
        if (scroll < 0) {
          //向上显示顶栏
          this.delElement(this.header_class, "index_make_up");
        } else {
          //向下隐藏顶栏
          if (!this.isContainElement(this.header_class, "index_make_up")) {
            this.header_class.push("index_make_up");
          }
        }
      },
      // // 判断是否含有指定元素
      isContainElement(arrays, elementName) {
        let length = arrays.length;
        for (let i = 0; i < length; i++) {
          if (arrays[i] == elementName) {
            return true;
          }
        }
        return false;
      },
      // 删除指定元素
      delElement(arrays, elementName) {
        let length = arrays.length;
        for (let i = 0; i < length; i++) {
          if (arrays[i] == elementName) {
            arrays.splice(i, 1);
            break;
          }
        }
      },
      async logout() {
        let data = {};
        await this.$basicPost("/logout", "", data);
        if (data.success && data.data.data.code == 200) {
          this.$message({
            type: "success",
            message: data.data.data.message,
          });
        }
        location.reload();
      },
      loadScript(url, innerHTML) {
        const oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = url;
        oScript.innerHTML = innerHTML
        document.body.appendChild(oScript);
      }
    },
  };
</script>
<style></style>