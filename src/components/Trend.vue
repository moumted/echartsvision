<template>
  <div class="com-container">
      <div class="title" :style="comStyle">
          <span>{{showTitle}}</span>
          <span class="iconfont title-icon"  :style="comStyle"@click="showChoose = !showChoose">&#xe6eb;</span>
          <div class="select-icon" v-show="showChoose" >
              <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
                  {{item.text}}
              </div>
          </div>
      </div>
      <div class="com-chart" ref="trend_ref">
      </div>
  </div>

</template>

<script>
export default {
    data(){
        return{
            chartInstance : null,
            allData : null,
            showChoose : false,
            chooseTip : 'map',
            titleFontSize : 0
        }
    },
    mounted(){
        this.initChart()
        this.getData()
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
    },
    computed : {
        selectTypes(){
            if(!this.allData){
                return []
            }else{
                return this.allData.type.filter(item=>{
                    return item.key !== this.chooseTip
                })
            }
        },
        showTitle (){
            if(!this.allData){
                return []
            }else{
                return this.allData[this.chooseTip].title
            }
        },
        //设置标题样式
        comStyle(){
            return {
                fontSize :this.titleFontSize + 'px'
            }
        }
    },
    methods :{
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.trend_ref,'chalk')
            const initOption  = {
                grid : {
                    top : '15%'
                },
                xAxis : {
                    type : 'category',
                    boundaryGap : false
                },
                yAxis : {
                    type : 'value'
                },
                tooltip : {
                    trigger : 'axis'
                }
            }
            this.chartInstance.setOption(initOption)
        },
        async getData () {
            const {data : ret} = await this.$http.get('trend')
            console.log(ret);
            this.allData = ret
            this.updataChart()
        },
        updataChart(){
            const colorArr1 = [
                'rgba(11,168,44,0.5)',
                'rgba(44,110,255,0.5)',
                'rgba(22,242,217,0.5)',
                'rgba(254,33,30,0.5)',
                'rgba(250,105,0,0.5)',
            ]
            const colorArr2 = [
                'rgba(11,168,44,0)',
                'rgba(44,110,255,0)',
                'rgba(22,242,217,0)',
                'rgba(254,33,30,0)',
                'rgba(250,105,0,0)'
            ]
            const timerArr = this.allData.common.month
            const valueArr = this.allData[this.chooseTip].data
            const seriesArr = valueArr.map((item,index)=>{
                return {
                    name : item.name,
                    type : 'line',
                    data : item.data,
                    stack : this.chooseTip,
                    smooth : true,
                    areaStyle : {
                        color : new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                            {
                                offset : 0,
                                color : colorArr1[index]
                            },
                            {
                                offset : 1,
                                color : colorArr2[index]
                            }
                        ])
                    }
                }
            })
            const legendArr = valueArr.map(item=>{
                return item.name
            })
            console.log(timerArr);
            const dataOption = {
                xAxis : {
                    data : timerArr,
                },
                legend : {
                    data : legendArr,
                    left : '15%',
                    top : '13%'
                },
                series : seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            this.titleFontSize = this.$refs.trend_ref.offsetWidth /100 * 3.6
            const adapterOption = {
                legend : {
                    itemWidth : this.titleFontSize,
                    itemHeight : this.titleFontSize,
                    itemGap : this.titleFontSize,
                    textStyle : {
                        fontSize : this.titleFontSize / 2.5
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        handleSelect(currentType){
            this.chooseTip = currentType
            this.updataChart()
            this.showChoose = false
        }
    }
}
</script>

<style lang='less' scoped>
.title{
    position : absolute;
    left: 20px;
    top : 20px;
    z-index: 10;
    color : white;
    .title-icon{
        margin-left: 10px;
        cursor: pointer;
    }
    .select-icon{
        .select-item{
            width:fit-content;
            cursor: pointer;
            background: #222733;
        }
    }
}
</style>