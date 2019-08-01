import cTitle from "components/title";
import { Toast, MessageBox } from "mint-ui";
import {scrollMixin} from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      videoList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
  },
  mounted() {
    this.getBanner();
    this.getData();
  },
  methods: {
    getBanner() {
      $http
        .get("plugin.video-share.frontend.set.getSlide", {}, " ")
        .then(response => {
          if (response.result === 1) {
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getData() {
      $http
        .get("plugin.video-share.frontend.video.getList", {page:1}, "load")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.videoList = response.data.list.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('plugin.team-dividend.api.team.getList', {
          page: that.page
        }, '加载中').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            let myData = response.data.list.data;
            that.videoList = that.videoList.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
        });

      }
    },
    toVideo(item){
      this.$router.push( this.fun.getUrl("VideoDetail",{}, { VideoID: item.id }));
    }
  },
  components: { cTitle }
};
