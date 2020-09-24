Vue.component('appointment', {    //予約用画面
    data: () =>({
        message: '',
        isError: false,
        name: '',
        date:'',
        visitor:'',
        company:'',
        error_kind:'',
        error:'',
        result:[],
        result_apo: [],
        result_cova: '',
        dateforpy: [],
        timeforpy:[]

    }),
    mounted:function(){
        axios
            .get(`${APIROOT}`)
            .then(res => (this.result = res.data.result))
            .catch((err)=>{
                this.message = "データの取得に失敗しました"
                this.isError = true
            }),
        axios
            .get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
            .then(res => {
                var cov_num = res.data[32]
                this.result_cova = String(cov_num.cases)
            })
            .catch((err)=>{
                 this.message = "データの取得に失敗しました"
                 this.isError = true
            })
    },
    methods: {
        //バリデーションに引っかかるとtrueを返すようにする
        checkInput: function() {

            this.error = ''

            // var inputday=Date.parse(this.date);
            //1970年1月1日00:00:00からの経過ミリ秒を返す関数

            var today = new Date(); //明日の日付
            today.setDate(today.getDate()+1);
            var year = today.getFullYear();
            var month = ("0"+(today.getMonth()+1)).slice(-2);
            var day = ("0"+(today.getDate()+1)).slice(-2);
            var tomorrow = `${year}${month}${day}` ;

            var inputday = new Date(this.date); //予約の日付
            var input_year = inputday.getFullYear();
            var input_month = ("0"+(inputday.getMonth()+1)).slice(-2);
            var input_day = ("0"+(inputday.getDate()+1)).slice(-2);
            var input_h = inputday.getHours();
            var input_m = inputday.getMinutes();

            var appointmentday= `${input_year}${input_month}${input_day}` ;
            this.dateforpy = `${input_year}年${input_month}月${input_day}日` ;
            this.timeforpy = `${input_h}時${input_m}分`;




            if(this.date.length == 0) {
                this.error = '訪問予約日時を入力してください';
            }
  
            else if( Number(tomorrow)>Number(appointmentday)) { 

                this.error = '明日以降の日時入力してください';
                this.clearInput("date");
            }

            if(this.visitor.length == 0){
                if (this.error.length >  0) {
                    this.error += '\n';
                }
                this.error += '名前を入力してください';
            }
            else if( this.visitor.length > 14) {
                if (this.error.length >  0) {
                    this.error += '\n';
                }
                this.error += '名前は14文字以内で入力してください';
                this.clearInput("visitor");
            }

            if(this.company.length == 0) {
                if (this.error.length >  0) {
                    this.error += '\n';
                }
                this.error += '会社名を入力してください';
            }
            else if( this.company.length > 30) {
                if (this.error.length >  0) {
                    this.error += '\n';
                }
                this.error += '会社名は30文字以内で入力してください';
                this.clearInput("company");
            }
            

            
            if (this.error.length > 0) { //エラー文の中身があれば表示
                alert(this.error);
                return true;
            }
        
        },

        clearInput: function(kind) {
            if(kind=="visitor"){
                this.visitor='';
            }
            else if(kind=="company"){
                this.company='';
            }
            else if(kind=="date"){
                this.date='';
            }
        },

        appointment: async function(id){ //予約

            if(this.checkInput()) {
                return
            }                
            await axios
                .post(`${APIROOT_apo}`,{member_id:id,company:this.company,visitor_name:this.visitor,date:this.dateforpy,time:this.timeforpy}) //pyに情報を渡す
                // .post(`${APIROOT_apo}`,{appointment_id:this.appointNumber}) //pyから情報貰う
                .then(res => (this.result_apo = res.data.result))
                .catch((err) => {
                     this.message = 'データの登録に失敗しました'
                     this.isError = true
                 })

            alert('あなたの来訪予約受付番号は'+ this.result_apo[0].appointment_id+'です。'); //受付番号をポップアップで表示
            
            this.clearInput("date")    
            this.clearInput("company")
            this.clearInput("visitor");
        },

        // covid:function(){
        //     axios
        //         .get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
        //         .then(res => (this.result_cova = res.data[32]))
        //         .catch((err)=>{
        //              this.message = "データの取得に失敗しました"
        //              this.isError = true
        //         })
        // },

        
        


        //参考qiita https://qiita.com/bo-san/items/85d734fd07ca3703b16b
    },

    template: ` <div>
    <br><br> <!-- 予約用画面 -->


    <label><b>来訪日時</b></label><font size="1"color="red">*必須</font>
    <dd><input type="datetime-local" v-model="date"></dd> 　<!--変数data  -->
    <label><b>来訪者氏名</b></label><font size="1"color="red">*必須</font>
    <dd><input type="text" v-model="visitor"></dd> 
    <label><b>来訪者会社名</b></label><font size="1"color="red">*必須</font>
    <dd><input type="text" v-model="company"></dd>
    <br>
    <button v-on:click="appointment('someone')" class="btn-flat-border">　<!-- 関数名appointment  -->
                    <font size="2">担当者指名なしで来訪予約</font>
    </button>
    <br>
    <br>
    
    <table border="1">      
    <tr style="background-color:#CCFFFF">
        <th style="width: 230px;" align="center"><label>担当者名</label></th>
        <th align="center">操作</th>
    </tr>     
        <tr v-for="rec in result" v-bind:key="rec._id">
            <td style="width: 230px;" align="center">{{rec.name}}</td>
            <td>
                 <button v-on:click="appointment(rec._id)" class = "btn-flat-logo"> <!--関数名appointment-->
                    <font size="2">来訪予約</font> 
                </button>
            </td>
        </tr>             
    </table>   
    <!-- <button v-on:click="covid()"> 
                    <font size="2">covid-19</font> 
                </button> -->
    <br>
    <!-- <marquee height="20" width="1000" behavior="alternate" direction="up" scrollamount="15" truespeed>ちなみに、現在の岡山県内の新型コロナウイルス累計感染者数は{{result_cova.cases}}人らしいです…(ﾟДﾟ;)</marquee> -->
    </div>`   
})
