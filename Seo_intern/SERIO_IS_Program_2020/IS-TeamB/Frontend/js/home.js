Vue.component('home',{ 
    data: () =>({
        message: '',
        message_day1:'',
        message_day2:'',
        isError:false,
        cova:'',
        day:''
    }),
    mounted:function(){
        axios
            .get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
            .then(res => {
                var cov_num = res.data[32]
                this.cova = String(cov_num.cases)
            })
            .catch((err)=>{
                 this.message = "データの取得に失敗しました"
                 this.isError = true
            }),
            axios    
            .get(`${APIROOT_holiday.concat('/get_is_bisiness_day')}`)
            .then(res => {
                this.day = res.data.result
                if(this.day == true) {//平日
                    this.message_day1='ようこそお越しくださいました。 '
                    this.message_day2='上部のメニューから操作をお選びください。'
                }
                else{
                    this.message_day1='今日は休業日です。'
                    this.message_day2='本日担当者のお呼び出しは出来ません。'

                }
            })
            .catch((err)=>{
                this.message = "データの取得に失敗しました"
                this.isError = true
            })
    },

    template: ` <div><br>  

            <div ><p class="animated" >現在の岡山県内の新型コロナウイルス累計感染者数は{{cova}}人です。</p></div>
            <br>  
            <div  class="uketuke" style="text-align:center"><img src="./img/uketuke.png" >
            <h1 style="text-align:center">{{message_day1}}</h1>
            <h1 style="text-align:center">{{message_day2}}</h1></div>
            <br>

            <!-- <div ><p class="animated" >現在の岡山県内の新型コロナウイルス累計感染者数は{{cova}}人です。</p></div> -->


                </div>`
})