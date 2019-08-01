let userAgent = navigator.userAgent;
new Vue({
  el: "#vueId", data: { // 当前正在ID
    playingWorksId: 0, // 当前正在索引
    // 播放状态
    playStart: "",
    // 封面
    poster: "",
    // URl地址
    worksUrl: "", // 轮播图初始位置
    swiperIndex: 0, // 弹出延迟时间(毫秒)
    showAdTime: 5000, // 提前N个开始加载下一页数据
    autoLoadLimt: 2, // 列表
    dataList: [], // 分页
    page: 1, // 是否没有数据加载
    isNoneData: false, // 初始化ID
    worksId: "4", // 类型
    type: "index", // 进度条
    videoProgress: 0, // 是否进行
    isAutoPlaying: false, // 用户ID
    userId: "173", // 作品用户
    worksUserId: 0,
    nowTime: "1564370842", // 头像数组
    txArray: ["https://gss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/5cf3c0e4d0fbcbb5f630.jpg", "https://gss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/5577c8cbd4dabdadbafe786a736f05.jpg", "https://gss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/611777616373783132337a08.jpg"],
    showTx: [],
    // 显示
    showShare: false,
    // 是否显示
    isShare: "no",
    // android终端
    isAndroid: userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1
  },

  created: function() {
    var that = this;
    that.getDataInfo(function() {
      that.getDataList();
    });
  }
  ,
  methods: {
    getDataInfo: function(callback) {
      var that = this;
      var worksId = that.worksId;
      $.post("./dpsl1.php?dpslu=1&dpsla=works", { action: "info", works_id: worksId }, function(res) {
        res = JSON.parse(res);
        if (res.body_data.length > 0) {
          that.dataList = that.dataList.concat(res.body_data);
          typeof callback == "function" && callback(true);
        } else {
          // 获取失败
        }
      });
    }
    ,
    getDataList: function() {
      var that = this;
      var page = that.page;
      var worksId = that.worksId;
      var isNoneData = that.isNoneData;
      var type = that.type;
      if (isNoneData) {
        return false;
      }
      $.post("./dpsl1.php?dpslu=1&dpsla=works", {
        action: "list",
        page: page,
        type: type,
        works_id: worksId
      }, function(res) {
        res = JSON.parse(res);
        if (res.body_data.length > 0) {
          that.dataList = that.dataList.concat(res.body_data);
          if (res.body_data.length < 10) {
            that.isNoneData = true;
          }
        } else {
          that.isNoneData = true;
        }
        that.page++;
        that.$nextTick(function() {
          that.readySwiper();
        });
      });
    }
    ,
    readySwiper: function() {
      var that = this;
      var dataList = that.dataList;
      that.mySwiper && that.mySwiper.destroy();
      that.mySwiper = new Swiper("#albums_wrap", {
        initialSlide: that.swiperIndex,
        direction: "vertical",
        watchOverflow: true,
        autoHeight: false,
        autoplay: false,
        pagination: false,
        on: {
          init: function() {
            if (that.isAndroid) {
              $("video").height("100%");
            }
            that.page === 2 && this.emit("slideChangeTransitionEnd");
          },
          slideChangeTransitionEnd: function() {
            // 轮播图
            that.swiperIndex = this.activeIndex;
            // 详情
            var worksInfo = dataList[that.swiperIndex]; // 封面
            that.poster = worksInfo.origin_cover; // 链接
            that.worksUrl = worksInfo.video_url; // ADID
            that.adId = worksInfo.ad_id; // 作者
            that.worksUserId = worksInfo.user_id; // ID
            that.playingWorksId = worksInfo.id;
            that.showShare = false; //停止播放上一个并清除对应的ADID定时器
            that.timer && clearTimeout(that.timer);
            if (that.playing) {
              that.playing.pause();
              that.playing.currentTime = 0;
            }
            document.title = worksInfo.title;
            that.setShareOptions(worksInfo); // 请求下一页
            if (that.dataList.length - that.swiperIndex < that.autoLoadLimt && that.isNoneData === false) {
              that.getDataList();
            }
            setTimeout(function() {
              that.$nextTick(function() {
                if (that.isAndroid && that.swiperIndex === 0 && that.isAutoPlaying === false) {
                } else {
                  that.isAutoPlaying = true;
                  that.worksAutoPlay();
                }
              });
            }, 300);
            // 曝光量
            var worksExposure = "./dpsl1.php?dpslu=1&dpsla=works&action=worksExposure";
            $.post(worksExposure, { works_id: worksInfo.id });
          }
        }
      });
    },

    worksAutoPlay: function() {
      var that = this;
      // 对象
      var myWorks = document.querySelector("#myWorks");
      myWorks.play();

      //信息
      myWorks.onplay = function(e) {
        var index = e.currentTarget.dataset.index;

        //数据
        var dataList = that.dataList;
        //设置滑动
        dataList.map(function(value, index) {
          dataList[index].playStart = false;
          dataList[index].showAd = false;
          dataList[index].showMack = false;
        });
        // 设置滑动
        dataList[index].playStart = true;
        that.playStart = true;
        that.isAutoPlaying = true;
        that.showShare = false;
        that.$set(that.dataList, index, dataList[index]);
        //对象
        that.playing = myWorks;
        //显示ADID var
        worksInfo = dataList[index];
        var showAdTime = worksInfo.ad_id > 0 ? that.showAdTime : 0;
        var type = worksInfo.extension_type;
        if (showAdTime > 0 && (type === "goods" || type === "jd" || type === "youzan" || type === "taobao" || type === "url")) {
          that.timer = setTimeout(function() {
            that.adShow(index);
          }, showAdTime);
        }
      };
      //监听暂停
      myWorks.onpause = function(e) {
        var index = e.currentTarget.dataset.index;
        // 数据
        var dataList = that.dataList;
        dataList[index].playStart = false;
        that.playStart = false;
        that.isAutoPlaying = false;
        that.$set(that.dataList, index, dataList[index]);
      };
      myWorks.onended = function(e) {
        that.videoProgress = 0;
      };
      //监听过程
      myWorks.ontimeupdate = function(e) {
        that.currentTime = parseInt(myWorks.currentTime);
        that.videoProgress = parseInt(myWorks.currentTime * myWorks.duration * 100);

      };
    },

    setShareOptions: function(worksInfo) {
      var siteUrl = "http://luo.zunyue.me/";
      var shareUrl = "http://share.zunyue.me/app/fxf1.php?fxfu=1&fxfa=works&share_uid=oNXqP1queaVnrLqyUBIZfYnZxmO0";
      window.shareData.title = worksInfo.title;
      window.shareData.desc = worksInfo.desc;
      var origin_cover = worksInfo.origin_cover;
      if (origin_cover.substr(0, 7).toLowerCase() === "http://" || origin_cover.substr(0, 8).toLowerCase() === "https://") {
        window.shareData.imgUrl = origin_cover;
      } else {
        window.shareData.imgUrl = siteUrl + origin_cover;
      }
      window.shareData.link = shareUrl + "&works_id=" + worksInfo.id;
      window.works_id = worksInfo.id;
    }
    ,

    worksStopPlay: function() {
      this.playing.pause();
    }
    ,
    myWorks: function() {
      window.location.href = "./dpsl1.php?dpslu=1&dpsla=my_works";
    }
    ,
    changeWorks: function() {
      window.location.href = "./dpsl1.php?dpslu=1&dpsla=push&action=change&work_id=" + this.playingWorksId;
    }
    ,
    changeFollow: function(item, index) {
      var dataList = this.dataList;
      if (this.dataList[index].follow === true) {
        dataList[index].follow = false;
        dataList[index].xuni_view = parseInt(dataList[index].xuni_view) - parseInt(1);
      } else {
        dataList[index].follow = true;
        dataList[index].xuni_view = parseInt(dataList[index].xuni_view) + parseInt(1);
      }
      this.$set(this.dataList, index, dataList[index]);
    }
    ,
    adShow: function(index) {
      var that = this;
      var dataList = this.dataList;
      if (dataList[index].showAd) {
        return false;
      }
      dataList[index].showAd = true;
      that.$set(that.dataList, index, dataList[index]);
      that.timer && clearTimeout(this.timer);
      var items = this.txArray;
      that.showTx = that.getRandomArrayElements(items, 2);
      // 曝光
      var adExposureUrl = "./dpsl1.php?dpslu=1&dpsla=works&action=adExposure";
      $.post(adExposureUrl, { ad_id: that.adId });
    }
    ,
    adShowQrcode: function(index) {
      var that = this;
      var dataList = that.dataList;
      dataList[index].showAd = true;
      dataList[index].showMack = true;
      that.$set(this.dataList, index, dataList[index]);
      that.playing && that.worksStopPlay();
      // ADID点击通知
      var adClickUrl = "./dpsl1.php?dpslu=1&dpsla=works&action=adClick";
      $.post(adClickUrl, { ad_id: that.adId, share_user_id: that.worksUserId });
      // ADID曝光
      var adExposureUrl = "./dpsl1.php?dpslu=1&dpsla=works&action=adExposure";
      $.post(adExposureUrl, { ad_id: that.adId });
    }
    ,
    closeAd: function(index) {
      var dataList = this.dataList;
      dataList[index].showAd = false;
      this.$set(this.dataList, index, dataList[index]);
    }
    ,
    closeQrcodeAd: function(index) {
      this.showShare = false;
      var dataList = this.dataList;
      dataList[index].showAd = false;
      dataList[index].showMack = false;
      this.$set(this.dataList, index, dataList[index]);
      this.worksAutoPlay();
    }
    ,
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
      while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },
    goGoods: function(e) {
      var that = this;
      // ADID点击通知
      var adClickUrl = "./dpsl1.php?dpslu=1&dpsla=works&action=adClick";
      var location_url = e.currentTarget.dataset.url;
      $.post(adClickUrl, { ad_id: that.adId, share_user_id: that.worksUserId }, function(res) {
        // ADID跳转
        window.location.href = location_url;
      });
    }
    ,
    goHome: function(user_id) {
      window.location.href = "./dpsl1.php?dpslu=1&dpsla=home&user_id=" + user_id;
    }
    ,
    showShareIcon: function(index) {
      var that = this;
      that.playing && that.worksStopPlay();
      var dataList = that.dataList;
      dataList[index].showMack = true;
      that.$set(that.dataList, index, dataList[index]);
      that.showShare = true;
    }
  }
});
