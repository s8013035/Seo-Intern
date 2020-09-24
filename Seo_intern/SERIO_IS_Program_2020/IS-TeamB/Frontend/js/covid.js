// document.addEventListener('DOMContentLoaded', async function(){

//     var cov_num;

//     await axios
//     .get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
//     .then(res => (cov_num = res.data[32]))
//     .catch((err)=>{
//          this.message = "データの取得に失敗しました"
//          this.isError = true
//         })

//     var ct = document.getElementById('covid');
//     ct.innerHTML = 'ちなみに、現在の岡山県内の新型コロナウイルス累計感染者数は' + String(cov_num.cases) + '人らしいです…(ﾟДﾟ;)'
// })

Vue.component('cov',{ 
    data: () =>({
        message: '',
        isError:false,
        cova:''
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
            })
    },
    template: ` <div><br><br>    

            <p class="animated">ちなみに、現在の岡山県内の新型コロナウイルス累計感染者数は{{cova}}人らしいです…(ﾟДﾟ;)</p>
            </div>`
})