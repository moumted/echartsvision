<template>
  <div class="com-container">
      <div class="com-chart" ref="rank_ref">         
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            chartInstance : null,
            allData : null,
            startValue : 0,
            endValue : 9,
            timerId : null
        }
    },
    mounted(){
        this.initChart()
        this.getData()
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        clearInterval(this.timerId)
        window.removeEventListener('resize',this.screenAdapter)
    },
    methods : {
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.rank_ref,'chalk')
            const initOption = {
                title : {
                    text :'地区销售排行',
                    left : 20,
                    top : 20
                },
                grid : {
                    bottom : '15%',
                    left : '15%',
                    containLabel : true
                },
                tooltip : {
                    show : true
                },
                xAxis : {
                    type : 'category'
                },
                yAxis : {
                    type : 'value'
                },
                series : [
                    {
                        type : 'bar'
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('mouseover',()=>{
                clearInterval(this.timerId)
            })
            this.chartInstance.on('mouseout',()=>{
                this.startInterval()
            })
        },
        async getData(){
            const { data : ret } = await this.$http.get('rank')
            this.allData = ret
            console.log(this.allData);
            this.allData.sort((a,b)=>{
                return b.value-a.value
            })
            this.updataChart()
            this.startInterval()
        },
        updataChart(){
            const colorArr = [
                ['#0BA82C','#4FF778'],
                ['#2E72BF','#23E5E5'],
                ['#5052EE','#AB6EE5']
            ]
            const provinceArr = this.allData.map(item =>{
                return item.name
            })
            console.log(provinceArr);
            const valueArr = this.allData.map(item =>{
                return item.value
            })
            const dataOption = {
                xAxis : {
                    data : provinceArr
                },
                dataZoom : {
                    show : false,
                    startValue : this.startValue,
                    endValue : this.endValue
                },
                series : [
                    {
                        data : valueArr,
                        itemStyle : {
                            color : (ret)=>{
                                let targetColor = colorArr
                                if(ret.value > 300){
                                    targetColor = colorArr[0]
                                } else if(ret.value > 200){
                                    targetColor = colorArr[1]
                                } else{
                                    targetColor = colorArr[2] 
                                }
                                return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                    {
                                        offset : 0,
                                        color : targetColor[0]
                                    },
                                    {
                                        offset : 1,
                                        color : targetColor[1]
                                    }
                                ])
                                
                            }
                        }
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                title : {
                    textStyle : {
                        fontSize : titleFontSize
                    }
                },
                series : [
                    {
                        barWidth : titleFontSize,
                        itemStyle : {
                            barBorderRadius : [titleFontSize / 2 , titleFontSize / 2 , 0 ,0]
                        }
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        startInterval(){
            this.timerId = setInterval(()=>{
                this.startValue ++ ;
                this.endValue ++ 
                if(this.endValue > this.allData.length - 1){
                    this.startValue = 0
                    this.endValue = 9
                }
                this.updataChart()
            } , 2000)
        }
    }
}
</script>

<style>

</style>