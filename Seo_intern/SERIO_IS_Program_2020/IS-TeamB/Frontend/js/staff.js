const APIROOT = 'http://localhost:5000'
const SlackROOT = 'http://localhost:5001'
const APIROOT_apo = 'http://localhost:5002'
const APIROOT_holiday = 'http://localhost:5003'

const max_name_length = 14
const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/

Vue.component('staff',{ 
    data: () =>({
        message: '',
        isError: false,
        error_name: false,
        error_visitor: false,
        error_company: false,
        name_length: false,
        visitor_length:false,
        company_length:false,
        content_length:false,
        content_empty:false,
        is_invalid_email:false,
        error_kind:'',
        name: '',
        slack_email:'',
        responsible_company:'',
        // charging_company:'',
        result:[]

    }),
    mounted:function(){
        axios
            .get(`${APIROOT}`)
            .then(res => (this.result = res.data.result))
            .catch((err)=>{
                this.message = "データの取得に失敗しました"
                this.isError = true
            })
    },
    methods: {
        //バリデーションに引っかかるとtrueを返すようにする
        checkInput: function(content,kind) {
            //初期化が必要
            this.content_empty=false;
            this.content_length=false;
            this.is_invalid_email = false;
            var len=content.length;
            var maximum_len;
            var errmessage="";
            var reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/

            //以下のif文でチェックするフィールドの種類をもとに許容文字数と空を許すかを指定
            if(kind=="name"){
                maximum_len=14;
                //空を許す場合以下の文は必要なし
                this.content_empty = content=='' ? true : false 
                this.error_kind='名前';
            }
            else if(kind=="slack_email"){
              
                maximum_len=255;
                this.content_empty = content=='' ? true : false 
                this.error_kind='メールアドレス'
            }
            if(len>maximum_len){
                this.content_length=true;
            }
            //this.content_empty = content=='' ? true : false 
            if(this.content_length){
                errmessage +=this.error_kind+'は'+maximum_len+'文字以下で入力してください  ';
                this.clearInput(kind);
            }
            if(this.content_empty){
                errmessage += '文字を入力してください';
            }
            var em = document.getElementById('errname');
            if(errmessage!=''){
                em.innerText='*' + errmessage;
            }
            em.hidden=false;
            
            //this.clearInput(kind);
            return (this.content_length || this.content_empty || this.is_invalid_email) ? true : false
        },

        clearInput: function(kind) {
            if(kind=="name"){
                this.name='';
            }
            else if(kind=="visitor"){
                this.visitor='';
            }
            else if(kind=="company"){
                this.company='';
            }
            else if(kind=="slack_email"){
                this.slack_email='';
            }
        },
        //getLunch: function (){
        //参考qiita https://qiita.com/bo-san/items/85d734fd07ca3703b16b
     

        addMember: function () {

            //バリデーションに引っかかるとreturnで処理を終了する
            if(this.checkInput(this.name,"name")) {
                this.clearInput();
                return;
            }
            if (!reg.test(this.slack_email)) {
                alert('不正なメールアドレスのため、名前のみを登録します。');
                this.slack_email = ""
            }
                var em = document.getElementById('errname');
                em.innerText='';
                em.hidden=true;
            axios
                .post(`${APIROOT}`,{name:this.name, slack_email:this.slack_email})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                })
                this.clearInput("name");
                this.clearInput("slack_email")
        },

        updateMember: function (id) {
            if(this.checkInput(this.name,"name")) {
                this.clearInput();
                return;
            }

            var is_invalid_email = false;
            maximum_len=255;
            is_invalid_email = this.slack_email =='' ? true : false 
            if (!reg.test(this.slack_email)) {
                is_invalid_email = true;
            }

            if(is_invalid_email) {
                
                this.slack_email = "void";
            }
            

            axios
                .put(`${APIROOT}`,{update_id:id,update_name: this.name, update_slack_email: this.slack_email})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                })
            this.clearInput("name")
            this.clearInput("slack_email");
        },

        deleteMember: function (id) {
            axios
               // .delete(`${APIROOT}`,{delete_id:id})
                .delete(`${APIROOT}`,{data: {delete_id: id}})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                })
            this.clearInput()
        },
        // addcompany:function(id){
        //     var text ="";
        //     axios
        //     .put(`${APIROOT.concat('/set_company')}`, {update_id:id,company:this.charging_company})
        //     .then(res => {
        //         this.result = res.data.result
        //     })
        //     .catch((err) => {
        //         this.message = 'データの登録に失敗しました'
        //         this.isError = true
        //     })
        // },
        focas(){
            document.getElementsByTagName('input').item(1).focus();
        }
        // slackRes: function (id) {
        //     if(this.checkInput(this.slack_email,"slack_email")) {
        //         this.clearInput("slack_email");
        //         return;
        //     }

        //     axios
        //         .put(`${APIROOT.concat('/slack_res')}`,{res_id:id,slack_email: this.slack_email})
        //         .then(res => (this.result = res.data.result))
        //         .catch((err) => {
        //             this.message = 'データの登録に失敗しました'
        //             this.isError = true
        //         })
        //     this.clearInput("slack_email")
        // },


    },
template: ` <div><br><br>
    <label><b>追加・変更する担当者名</b></label> <font size="1" color="red">*必須</font> 
    <dd><input type="text" v-model="name" v-on:keydown.enter="focas"><font size='1'color='red'><label id="errname" hidden></label></font></dd>
    <label><b>slackメールアドレス</b></label><font size="1" color="red">*任意</font>                    
    <dd><input type="text" v-model="slack_email" v-on:keydown.enter="addMember" placeholder="example@aaa.com"></dd>
    <!-- <label><b>担当会社</b></label>
    <dd><input type="text" v-model="charging_company" ></dd> -->
        <br>
        <button v-on:click="addMember" class="btn-flat-border">
            <font size="2" >追加</font>
        </button>
        <br>
        <br>

        <table border="1">
        <tr style="background-color:#CCFFFF">
            <th style="width: 230px;" align="center">担当者名</th>
            <th style="width: 230px;" align="center">slackメールアドレス</th>
            <!-- <th style="width: 230px;" align="center"> 担当会社</th> -->
            <th colspan='3' align="center">操作</th>
        </tr>
            <tr v-for="rec in result" v-bind:key="rec._id">
                <td style="width: 230px;" align="center">{{rec.name}}</td>
                <td style="width: 230px;" align="center">{{rec.slack_email}}</td>
                <!-- <td style="width: 230px;" align="center">{{rec.charging_company}}</td> -->
                <td>
                    <button v-on:click="updateMember(rec._id)" class = "btn-flat-logo">
                        <font size="2">更新</font>
                    </button>
                </td>
                <td>
                    <button v-on:click="deleteMember(rec._id)" class = "btn-flat-logo">
                        <font size="2">削除</font>
                    </button>
                </td>
                <!-- <td>
                <button v-on:click="addcompany(rec._id)">
                <font size="2">会社名登録</font>
                </button>
                </td> -->
            </tr>
            
        </table></div>`
})