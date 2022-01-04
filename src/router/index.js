import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/sellerPage.vue'
import TrendPage from '@/views/trendPage.vue'
import MapPage from '@/views/mapPage.vue'
import RankPage from '@/views/rankPage.vue'
import PiePage from '@/views/piePage.vue'
import StockPage from '@/views/stockPage.vue'
import ScreenPage from '@/views/ScreenPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path : '/',
    redirect : '/screenpage'
  },
  {
    path : '/sellerpage',
    component : SellerPage
  },
  {
    path : '/trendpage',
    component : TrendPage
  },
  {
    path : '/mappage',
    component : MapPage
  },
  {
    path : '/rankpage',
    component : RankPage
  },
  {
    path : '/piepage',
    component : PiePage
  },
  {
    path : '/stockpage',
    component : StockPage
  },
  {
    path : '/screenpage',
    component : ScreenPage
  }
]

const router = new VueRouter({
  routes
})

export default router
