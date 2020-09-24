Vue.component('call', {
    data: () =>({
        message: '',
        isError: false,
        content_length:false,
        content_empty:false,
        name: '',
        visitor:'',
        company:'',
        error_kind:'',
        error:'',
        result:[],
        result_cova:[],
        percentage:'',
        fname:'',
        sname:'',
        errvisiter:'',
        errcompany:'',
        lovemsg:'',
        lovepic:'',
        result:[],
        result_name:[],
        lname:'',
        lm_list:[
            [
                '。終わってますねぇ',
                '！そこそこ！',
                '！！賄賂の予感！！',
                '！！！マブダチ級！！！',
                '！！！！伝説級！！！！'
            ],
            [
                '。まぁそんなもんですよね',
                '！ぼちぼち！',
                '！！やったね！！',
                '！！！ああああああああああああああああ！！！',
                '！！！！すこすこスコティッシュフォールド！！！！'
            ]
        ],
    }),
    //  mounted:function(){
    //     axios
    //     .get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
    //     .then(res => (this.result_cova = res.data[32]))
    //     .catch((err)=>{
    //          this.message = "データの取得に失敗しました"
    //          this.isError = true
    //     })
    // },
        
    methods: {
        //バリデーションに引っかかるとtrueを返すようにする
        checkInput: function(content,kind) {
            //初期化が必要
            // this.content_empty=false;
            // this.content_length=false;
            // var len=content.length;
            // var maximum_len;

            this.errvisiter = '';
            this.errcompany = '';
            var flug = false;

            if(this.visitor.length == 0){
                this.errvisiter += '*名前を入力してください';
                flug = true;
            }
            else if( this.visitor.length > 14) {
                this.errvisiter = '*名前を14文字以内で入力してください';
                this.clearInput("visitor");
                flug = true;
            }

            if(this.company.length == 0) {
                this.errcompany += '*会社名を入力してください';
                flug = true
            }
            else if( this.company.length > 30) {
                this.errcompany += '*会社名を30文字以内で入力してください';
                this.clearInput("company");
                flug = true
            }
            document.getElementById('errvis').innerText = this.errvisiter;
            document.getElementById('errcomp').innerText = this.errcompany;
            document.getElementById('errvis').hidden = false;
            document.getElementById('errcomp').hidden = false;

            return flug;
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
        },

        callMember: function(id, arg_name){
            if(this.checkInput(this.visitor,this.company)) {
                return
            }
            document.getElementById('errvis').innerText = '';
            document.getElementById('errcomp').innerText = '';
            document.getElementById('errvis').hidden = true;
            document.getElementById('errcomp').hidden = true;

            
            axios
                .put(`${SlackROOT}`,{member_id:id,company:this.company,visitor_name:this.visitor})


            this.love(arg_name)

            this.clearInput("company");
            this.lname = this.visitor;
            this.clearInput("visitor");

        },

        getMember:function(){
            if(this.checkInput(this.visitor,this.company)) {
                return
            }
            document.getElementById('errvis').innerText = '';
            document.getElementById('errcomp').innerText = '';
            document.getElementById('errvis').hidden = true;
            document.getElementById('errcomp').hidden = true;
            axios
                .get(`${APIROOT.concat("/get_charging_employee")}`, {params: {company_query: this.company}})
                .then(res => (this.result = res.data.result))
                .catch((err)=>{
                    this.message = "データの取得に失敗しました"
                    this.isError = true
                })
        },

         love: async function(arg_sname){ //相性診断             
            await axios //pythonでローマ字に
                .get(`${APIROOT.concat("/converter")}`,{
                    params:{
                        fname: this.visitor,//this.fname,
                        sname: arg_sname//this.sname
                    }
                }) 
                .then(res => (this.result_name = res.data.result))
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                })
            await axios //love-calculator
                .get(`https://love-calculator.p.rapidapi.com/getPercentage`,{
                    headers:{
                        "x-rapidapi-key": "de0f4f8d89msh3cc2595e27ca654p169d34jsnb483f803663e"
                    },
                    params:{
                        fname:this.result_name.fname,
                        sname:this.result_name.sname
                    }
                }) 
                .then(res => {
                    this.percentage = res.data.percentage 
                    // if(this.percentagae){ //相性の良し悪しで表示内容を変えれるようにする
                    this.loveinput(arg_sname);
                   //相性の％をポップアップで表示
                }
            // }
                )
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                   })                  


                   var popup = document.getElementById('js-popup');
                   document.getElementById('ltext').innerHTML = this.lovemsg;
                   document.getElementById('limg').src = this.lovepic;
                   if(!popup) return;
                   popup.classList.add('is-show');
                     
                   var blackBg = document.getElementById('js-black-bg');
                   var closeBtn = document.getElementById('js-close-btn');
                     
                   closePopUp(blackBg);
                   closePopUp(closeBtn);
                     
                   function closePopUp(elem) {
                   if(!elem) return;
                   elem.addEventListener('click', function() {
                   popup.classList.remove('is-show');
                   })
                 }
         },

         loveinput:function(name) {
             var pattern = Math.floor((Math.random() * 2) + 1);
             if(this.percentage < 20){
                 this.lovepic = './img/worst_' + String(pattern) + '.png';
                 this.lovemsg = this.lname + 'と' + name + 'の相性は'+ this.percentage +'すこ💔です' + this.lm_list[pattern -1][0];
             }
             else if(this.percentage < 40){
                 this.lovepic = './img/fouth_' + String(pattern) + '.png';
                 this.lovemsg = this.lname +'と' + name +'の相性は'+ this.percentage +'すこ💙です' + this.lm_list[pattern -1][1];
             }
             else if(this.percentage < 60){
                 this.lovepic = './img/third_' + String(pattern) + '.png';
                 this.lovemsg = this.lname +'と' + name +'の相性は'+ this.percentage +'すこ💛です' + this.lm_list[pattern -1][2];
             }
             else if(this.percentage < 80){
                 this.lovepic = './img/second_' + String(pattern) + '.png';
                 this.lovemsg = this.lname + 'と' + name +'の相性は'+ this.percentage +'すこ💓です' + this.lm_list[pattern -1][3];
             }
             else{
                 this.lovepic = './img/best_' + String(pattern) + '.png';
                 this.lovemsg = this.lname + 'と' + name +'の相性は'+ this.percentage +'すこ💖です' + this.lm_list[pattern -1][4];
             }
         },
         
        focas(){
            document.getElementsByTagName('input').item(1).focus();
        }

        
    
    }, 



        //getLunch: function (){
        //参考qiita https://qiita.com/bo-san/items/85d734fd07ca3703b16b

        template: ` <div><br><br>

        <label><b>来訪者氏名</b></label><font size="1"color="red">*必須</font>
        <dd><input type="text" v-model="visitor" id="vt" v-on:keydown.enter = "focas()"><font size="2" color = "red" id="errvis" hiddn></font></dd> 
        <label><b>来訪者会社名</b></label><font size="1"color="red">*必須</font>
        <dd><input type="text" v-model="company" v-on:blur="getMember()" v-on:keydown.enter="getMember()"><font size="2" color="red" hiddn id="errcomp"></font></dd>
        <br>
        <br>
        <button v-on:click="callMember('someone')" class="btn-flat-border">
                        <font size="2">誰でもいいので呼び出す</font>
        </button>

        <br>
        <br>
        
        <table border="1">      
        <tr style="background-color:#CCFFFF">
            <th style="width: 230px;" align="center"><label><b>担当者名</b></label></th>
            <th align="center"><b>操作</b></th>
        </tr>     
            <tr v-for="rec in result" v-bind:key="rec._id">
                <td style="width: 230px;" align="center">{{rec.name}}</td>
                <td>
                    <button v-on:click="callMember(rec._id, rec.name)" class = "btn-flat-logo">
                        <font size="2">呼出</font>
                    </button>
                </td>
                <!-- <td>
                    <button v-on:click="love(rec.name)">
                        <font id="js-show-popup"size="2">相性診断</font>
                    </button>
                </td> -->
            </tr>             
        </table> 
        
        <div class="popup" id="js-popup">
            <div class="popup-inner">
                <div class="close-btn" id="js-close-btn">
                    <i class="fas fa-times"></i>
                </div>
                <p id="ltext"></p>
                <a href="#"><img src="" alt="ポップアップ画像"　id="limg"></a>
            </div>
            <div class="black-background" id="js-black-bg"></div>
        </div>
        <!-- <marquee height="20" width="1000" behavior="alternate" direction="up" scrollamount="15" truespeed>ちなみに、現在の岡山県内の新型コロナウイルス累計感染者数は{{result_cova.cases}}人らしいです…(ﾟДﾟ;)</marquee> -->
      
        </div>`
})