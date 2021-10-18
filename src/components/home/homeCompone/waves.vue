<template>
    <div class="article_detail_waves_container">
        <div class="article_detail_waves"></div>
        <div class="article_detail_waves"></div>
        <div class="article_detail_waves"></div>
        <div class="article_detail_waves"></div>
        <div class="article_detail_waves"></div>
        <div class="article_detail_waves"></div>
    </div>
</template>
<script>
    export default {
        name: "wave",
        data() {
            return {

            }
        }
    }
</script>
<style>
    .article_detail_waves_container {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 50px;
        margin-top: -50px;
        background: rgba(0, 0, 0, 0);
    }

    .article_detail_waves {
        width: 2000px;
        height: 2000px;
        border-radius: 45%;
        position: absolute;
        bottom: -2015px;
        z-index: 2;
        background-color: rgb(118, 218, 255);
        animation: wave 4s infinite;
    }
    .article_detail_waves:nth-child(2) {
        left: 320px;
        animation: wave 5s infinite;
    }

    .article_detail_waves:nth-child(3) {
        background-color: rgba(118, 218, 255, 0.644);
        z-index: 1;
        left: 320px;
        animation: wave 5.05s infinite;
    }

    .article_detail_waves:nth-child(4) {
        background-color: rgba(118, 218, 255, 0.644);
        z-index: 1;
        animation: wave 4.05s infinite;
    }

    .article_detail_waves:nth-child(5) {
        left: -700px;
        animation: wave 7s infinite;
        bottom: -2010px;
    }

    .article_detail_waves:nth-child(6) {
        left: -700px;
        animation: wave 7.05s infinite;
        z-index: 1;
        bottom: -2010px;
        background-color: rgba(118, 218, 255, 0.644);
    }
    @keyframes wave {
        from {
            transform: rotate(180deg)
        }

        to {
            transform: rotate(360deg)
        }
    }
</style>