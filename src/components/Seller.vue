<template>
  <div class="com-container">
      <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            chartInstance : null,
            allData : null,
            currentPage : 1,
            totalPage : 0,
            timerId : null
        }
    },
    mounted(){
        this.initChart()
        this.getData()
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed() {
        clearInterval(this.timerId)
        //组件销毁时取消监听器，防止内存泄漏
        window.removeEventListener('resize',this.screenAdapter)
    },
    methods : {
        //初始化
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.seller_ref,'chalk')
            // console.log(this.chartInstance);     
            const initOption = {
                title : {
                    text : '商家销售统计',
                    left : 20 , 
                    top : 10
                },
                grid : {
                    top : '10%',
                    left : '3%',
                    right : '6%',
                    bottom : '3%',
                    containLabel : true
                },
                xAxis : {
                    type : 'value'
                },
                yAxis : {
                    type : 'category',
                },
                tooltip : {
                            trigger : 'axis',
                            axisPointer :{
                                type : 'line',
                                z : 0,
                                lineStyle : {
                                    color : '#2D3443',
                                }
                            }
                },
                series : [
                    {
                        type : 'bar',
                        label : {
                            show : true,
                            position : 'right',
                            textStyle : {
                                color : 'white'
                            }

                        },
                        itemStyle : {
                            color : new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                                {
                                    offset : 0, color : 'blue'
                                },
                                {
                                    offset : 1 , color : 'yellow'
                                }
                            ])
                        },  
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
        async getData (){
            const ret = await this.$http.get('seller')
            console.log(ret.data)
            this.allData = ret.data
            this.allData.sort((a,b)=>{
                return b.value - a.value
            })
            this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.aLLData.length / 5 + 1
            this.updateChart()
            this.startInterval()
        },
        updateChart(){
            const start = (this.currentPage - 1 ) * 5
            const end  = this.currentPage * 5
            const showData = this.allData.slice(start , end)
            // console.log(showData);
            const sellerNames = showData.map((item)=>{
                return item.name
            })
            const sellerValues = showData.map((item)=>{
                return item.value
            })
            const dataOption = {
                yAxis : {
                    data : sellerNames
                },
                series : [
                    {
                        data : sellerValues,
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        startInterval(){
            this.timerId = setInterval(()=>{
                this.currentPage ++ 
                if(this.currentPage > this.totalPage){
                    this.currentPage = 1
                }
                this.updateChart()
            },3000)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                title : {
                    textStyle : {
                        fontSize : titleFontSize
                    },
                },
                tooltip : {
                        axisPointer :{
                            lineStyle : {
                                width : titleFontSize
                            }
                        }
                },
                series : [
                    {
                        barWidth : titleFontSize,
                        itemStyle : {
                            barBorderRadius : [0,titleFontSize / 2,titleFontSize / 2,0]
                        }
                    },
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    }
}
</script>

<style lang="less" scoped>
// .com-container{
//     width : 600px;
//     height : 400px;
// }
</style>

