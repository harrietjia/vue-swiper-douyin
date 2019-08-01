<template>
  <div class="wrap">
    <div class="my-video" v-show="show" :style="VideoItemHeightStyle">
      <video :class="minStyle ? '' : 'video-style'" :src="showVideo.video"
             :poster="showVideo.cover"
             webkit-playsinline="true"
             controlslist="nodownload"
             playsinline="true"
             x5-video-player-type="h5"
             x5-video-player-fullscreen="true"
             preload="metadata"
             loop="loop"
             @loadeddata="watchHandler"
             ref="video"
      >
        <!--@pause="onpause"-->
        <!--@play="onplay"-->
        <source :src="showVideo.video" type="video/mp4">
      </video>
    </div>

    <swiper :options="swiperOption" v-if="popularVideo.length > 0">
      <swiper-slide v-for="(item, index) in popularVideo">
        <div>
          <div class="works_wrap" v-show="!item.show" @click="clickSwiper(index)">
            <div class="poster">
              <img class="pic" ref="pic" :src="item.cover">
            </div>
            <div class="playWorks"></div>
            <img class="play" src="../../../assets/images/find_play@2x.png" alt="">
          </div>

          <div class="side-bar">
            <div class="avatar" v-if="item.member">
              <img :src="item.member.avatar" alt="" width="40" height="40"
                   @click.stop="chooseUser">
            </div>
            <div class="like" @click.stop="toggleLike(item)">
              <img v-if="like" src="../../../assets/images/find_heart_r@2x.png" alt="">
              <img v-if="!like" src="../../../assets/images/find_heart_w@2x.png" alt="">
              <span class="likenum">{{item.like_num}}</span>
            </div>
            <div class="share" style="font-size: 30px;" @click="shareVideo">
              <img src="../../../assets/images/find_share@2x.png" alt="">
              <span class="sharenum" v-if="item.share_num">{{item.share_num}}</span>
            </div>
          </div>
          <div class="good-box" @click.stop="toGood(item)" v-if="item.goods">
            <div class="good-img">
              <img :src="item.goods.thumb" alt="">
            </div>
            <div class="text-wrap">
              <p class="desc">{{item.goods.title}}</p>
              <div><span class="price">￥{{item.goods.price}}</span><span class="old-price">原价：￥{{item.goods.market_price}}</span>
              </div>
            </div>
            <div class="cart">
              <img src="../../../assets/images/find_cart@2x.png" alt="">
            </div>
          </div>
          <div class="play-video" v-if="item.show" @click="clickSwiper(index)"></div>
          <div class="play-video" v-if="showShare" style="z-index: 13" @click="close">
            <img src="../../../assets/images/share_bg.png" alt=""/>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import video_detail_controller from "./video_detail_controller";

  export default video_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .my-video {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    right: 0;
    height: 100%;
    visibility: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    overflow: hidden;
    video{
      width: 100%;
      height: 100%
    }
    .video-style {
      object-fit: fill;
    }
  }

  .up-enter-active, .up-leave-active {
    transition: all .5s
  }

  .up-enter, .up-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }

  .wrap {
    background: #999;
    width: 100%;
    height: 100%;
    .icon-search {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 10px;
      font-size: 24px;
      z-index: 222;
    }
    .scroll-wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .mack {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000000;
    opacity: 0.8;
    z-index: 98;
    display: none;
  }

  .works_wrap {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    right: 0;
    height: 100%;
    visibility: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    overflow: hidden;
    .play {
      position: absolute;
      z-index: 11;
      left: calc(55% - 2rem);
      top: calc(50% - 2rem);
      width: 2rem;
      height: 2rem;
    }
  }

  .swiper-slide .works_wrap .poster {
    /*background: #000000;*/
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    visibility: visible;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide .works_wrap .poster .pic {
    width: 100%;
    height: auto;
    vertical-align: middle;
  }

  .swiper-slide .works_wrap .playWorks {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    background-size: auto 50px;
    background: #999;
  }

  .good-box {
    position: absolute;
    display: flex;
    z-index: 10;
    left: 0;
    bottom: 5rem;
    width: 85%;
    height: 5rem;
    background: #fff;
    border-radius: 0 12px 12px 0;
    padding: .5rem .8rem;
    .good-img {
      margin-right: .5rem;
      width: 4rem;
      height: 4rem;
      flex: 0 0 4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      line-height: 2rem;
      width: 70%;
      font-weight: bold;
    }
    .desc {
      font-size: 16px;
      color: #333333;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .price {
      font-size: 16px;
      color: #f15353;
      margin-right: .5rem;
    }
    .old-price {
      text-decoration: line-through;
      color: #8c8c8c;
      font-size: 12px;
    }
    .cart {
      flex: 0 0 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      line-height: 5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .side-bar {
    position: absolute;
    z-index: 10;
    right: 15px;
    bottom: 7rem;
    display: flex;
    flex-direction: column;
    height: 160px;
    justify-content: space-between;
    .avatar {
      position: relative;
      border-radius: 50%;
      background: none;
      border: 1px solid rgb(232, 232, 233);
      img {
        border-radius: 50%;
      }
      .follow {
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(50%);
        width: 16px;
        height: 16px;
        font-size: 16px;
        border-radius: 50%;
        background: rgb(252, 52, 93);
      }
    }
  }

  .like {
    position: relative;
    img {
      width: 40px;
      height: 40px;
    }
    .likenum {
      font-size: 10px;
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      color: rgb(232, 232, 233);
    }
  }

  .share {
    position: relative;
    img {
      width: 40px;
      height: 40px;
    }
    .sharenum {
      font-size: 10px;
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      color: rgb(232, 232, 233);
    }
  }

  .side-bar > div {
    width: 40px;
    height: 40px;
    font-size: 40px;
    color: rgb(232, 232, 233);
    transition: all .3s;
  }

  .play-video {
    position: absolute;
    z-index: 9;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
  }


</style>
