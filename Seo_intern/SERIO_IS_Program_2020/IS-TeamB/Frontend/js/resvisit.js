Vue.component('resvisit', {    //予約者訪問画面
    data: () =>({
        message: '',
        isError: false,
        vnumber:'',
        callnum:'',
        result:[]

    }),
    methods: {
        //バリデーションに引っかかるとtrueを返すようにする
        checkInput: function(number) {
            var numreg = new RegExp('^[0-9]{6}$');
            var flag = false;
            if(!(numreg.test(number))) {
                document.getElementById('em').innerText = '*6桁の数字を入力してください';
                flag = true;
            }
            return flag;
        },
        clearInput:function(){
            this.callnum = this.vnumber;
            this.vnumber = '';
        },
        confirmNumber: async function(){
            if(this.checkInput(this.vnumber)) {
                return;
            }
            document.getElementById('em').innerText = '';
            await axios
                .get(`${APIROOT_apo.concat("/get_appointment")}`, {params: {id_query:this.vnumber}})
                .then(res => (this.result = res.data.result))
                .catch((err)=>{
                    this.message = "データの取得に失敗しました"
                    this.isError = true
                })
            this.clearInput();
            if(this.result == "undefined"){
                alert("その番号は登録されていません");
                this.result = [];
                return;
            }
            else if(this.result == "reserved"){
                alert("その番号は受付済みです");
                this.result = [];
                return;
            }
        },

        //getLunch: function (){
        //参考qiita https://qiita.com/bo-san/items/85d734fd07ca3703b16b
    
    callMember : function(day,comp,vis,name){
        axios
                .put(`${SlackROOT.concat('/from_reservation')}`,{id_query:this.callnum})
                //               
                
        alert('呼出が完了しました');
        this.result = [];
    }
    // colectres:function(){
    //     // axios
    //     //         .put(`${APIROOT}`,{colect_number:this.colnumber})

    //     this.colnumber = '';
    //     this.result = [];
    // },
},
    template: ` <div>
    <br><br>   <!-- 予約者訪問画面 -->
    <label><b>受付番号を入力してください</b></label>
    <dd><input type="text" v-model ="vnumber" v-on:keydown.enter="confirmNumber()" placeholder="(例) 000000">
    <font size="2" color="red" id="em"></font></dd>
    <br>
    <button v-on:click="confirmNumber()" class="btn-flat-border" >確認</button>
    <br><br>

    <div v-if='this.result.length != 0' id="restab">
        <label><b>ご予約内容</b></label>
        <table border="1">
            <tr style="background-color:#CCFFFF">
                <th align="center" style="width: 230px;">来訪日</th>
                <th align="center" style="width: 230px;">会社名</th>
                <th align="center" style="width: 230px;">氏名</th>
                <th align="center" style="width: 230px;">担当者</th>
            </tr>
            <tr v-for="rec in result">
                <td>{{rec.date}}</td>
                <td>{{rec.company}}</td>
                <td>{{rec.visitor}}</td>
                <td>{{rec.name}}</td>
            </tr>
        </table>
        <button v-on:click ="callMember">呼出</button>
        
    </div>
    
    </div>`   
})