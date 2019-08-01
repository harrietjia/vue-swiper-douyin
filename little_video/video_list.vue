<template>
  <div id="video-list">
    <c-title :hide="false" :text="'视频列表'">
    </c-title>
    <div style="height: 40px"></div>

    <div class="banner">
      <yd-slider autoplay="3000">
        <yd-slider-item>
          <a href="http://www.ydcss.com">
            <img class="banner-item" src="https://dev5.yunzmall.com/attachment/images/2/2018/07/TFaf5WAA35053kFza009F10f91F7Q9.png">
          </a>
        </yd-slider-item>
        <yd-slider-item>
          <a href="http://www.ydcss.com">
            <img src="https://dev5.yunzmall.com/attachment/images/2/2018/07/TFaf5WAA35053kFza009F10f91F7Q9.png">
          </a>
        </yd-slider-item>
        <yd-slider-item>
          <a href="http://www.ydcss.com">
            <img src="https://dev5.yunzmall.com/attachment/images/2/2018/07/TFaf5WAA35053kFza009F10f91F7Q9.png">
          </a>
        </yd-slider-item>
      </yd-slider>
    </div>

    <div class="video-list">
      <ul>
        <li @click="toVideo(item)" v-for="item in videoList">
          <img class="video-img" :src="item.cover" alt="">
          <p>{{item.title}}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar" alt="">
            <span>{{item.member.nickname}}</span>
          </div>
          <img class="play" src="../../../assets/images/home_play@2x.png" alt="">
        </li>
      </ul>
    </div>

    <div class="button">
      <img src="../../../assets/images/home_bot_but@2x.png" alt="">
    </div>
  </div>
</template>

<script>
  import video_list_controller from "./video_list_controller";

  export default video_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #video-list {
    .banner {
      width: 100%;
      height: 10rem;
      img{
        width: 100%;
        height: 10rem;
      }
    }
    .video-list {
      margin: .5rem;
      text-align: left;
      ul{
        display: flex;
        flex-wrap: wrap;
      }
      li{
        position: relative;
        display: flex;
        width: 48.7%;
        flex-direction: column;
        background-color: #ffffff;
        border-radius: 6px;
        margin-bottom: .5rem;
      }
      .play{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      li:nth-child(odd){
        margin-right: .5rem;
      }
      p{
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        padding: 5px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .video-img{
        width: 100%;
        height: 15rem;
      }
      .people{
        display: flex;
        padding: 5px;
        img{
          flex: 0 0 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          margin: 0 5px;
        }
        span{
          flex: 1;
          line-height: 1.5rem;
          margin: 0 5px;
          font-size: 11px;
          color: #8c8c8c;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .button{
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: 3.5rem;
      height: 3.5rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
