<template>
  <div class="com-container" @dblclick="revertMap">
      <div class="com-chart" ref="map_ref"> 
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
    data(){
        return{
            chartInstance : null,
            allData : null,
            //省份地图矢量缓存
            mapData : {}
        }
    },
    mounted (){
        this.initChart()
        this.getData()
        window.addEventListener('resize',this.screenAdapter)
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
    },
    methods :{
        async initChart(){
            this.chartInstance =  this.$echarts.init(this.$refs.map_ref,'chalk')
            const ret = await axios.get('http://localhost:8080/static/map/china.json')
            console.log(ret);
            this.$echarts.registerMap('china',ret.data)
            const initOption = {
                title : {
                    text : '商家分布',
                    left : '15%',
                    top : 20
                },
                geo : {
                    type : 'map',
                    map : 'china',
                    top : '5%',
                    bottom : '5%',
                    itemStyle : {
                        areaColor : '#2E72BF',
                        borderColor : '#333'
                    }
                }
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('click',async arg =>{
                const proviceInfo = getProvinceMapInfo(arg.name)
                console.log(proviceInfo);
                if(!this.mapData[proviceInfo.key]){
                    const ret = await axios.get('http://localhost:8080' + proviceInfo.path)
                    this.mapData[proviceInfo.key] = ret.data
                    this.$echarts.registerMap(proviceInfo.key, ret.data)
                }
                const changeOption = {
                    geo : {
                        map : proviceInfo.key
                    }
                }
                this.chartInstance.setOption(changeOption)
            })
        },
        async getData(){
            const {data : ret} = await this.$http.get('map')
            this.allData = ret
            console.log('66',this.allData);
            this.updateChart()
        },
        updateChart(){
            const legendArr = this.allData.map(item=>{
                return item.name
            })
            console.log(legendArr);
            const seriesArr = this.allData.map(item=>{
                return {
                    name : item.name,
                    data : item.children,
                    type : 'effectScatter',
                    rippleEffect : {
                        scale : 5,
                        brushType : 'stroke'
                    },
                    coordinateSystem : 'geo',
                }
            })
            const dataOption = {
                legend : {
                    data : legendArr,
                    orient : 'vertical',
                    left : '15%',
                    bottom : '5%'
                },
                series : seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.map_ref.offsetWidth / 100  * 3.6
            const adapterOption = {
                title : {
                    textStyle : {
                        fontSize : titleFontSize
                    }
                },
                legend : {
                    itemWidth : titleFontSize / 2,
                    itemHeight : titleFontSize / 2,
                    //各个图例之间的间隔
                    // itemGap : titleFontSize / 2
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        //双击回到中国地图
        revertMap(){
            const revertOption = {
                geo : {
                    map : 'china'
                } 
            }
        this.chartInstance.setOption(revertOption)
        }
    }
}
</script>

<style>

</style>