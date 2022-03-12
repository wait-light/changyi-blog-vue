<template>
    <div id="app" class="basic_fontfamily" v-loading="loading">
        <router-view v-if="isOpen"></router-view>
    </div>
</template>
<script>
    export default {
        name: 'app',
        data() {
            return {
                theme_url: './assets/theme/circle/circle_theme.css',
                theme_font_url: './assets/theme/font/default_font/iconfont.css',
                isOpen: false,
                loading: true
            }
        },
        methods: {
        },
        async mounted() {
            await this.$basicConfigGet();
            this.isOpen = true
            this.loading = false
            let obj = (this.$basicConfig.map.find(k => k.key == "theme")).values
            //动态加载主题CSS文件,图标
            if (obj) {
                import(`${obj.current_theme.src}`) 
                import(`${obj.current_theme.font_src}`) 
            } else {
                import(`${this.theme_url}`) 
                import(`${this.theme_font_url}`)
            }

        },
        watch: {},
    }
</script>

<style>
    body,
    html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    #app {
        width: 100%;
        height: 100%;
    }
</style>