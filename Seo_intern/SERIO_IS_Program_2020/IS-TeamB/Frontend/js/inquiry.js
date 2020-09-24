Vue.component('inquiry',{ 
    data: () =>({
        message: '',
        isError: false,
        name: '',
        company:'',
        slack_email:'',
        responsible_company:'',
        result:[],
        a:'',
        date:'',
        uid:'',
        udate:'',
        ucompany:'',
        uvisitor:'',
        dateforpy:'',
        foucs_list:{
            ucomp: 'uvis'
        }   
    }),
    mounted:function(){
        axios
            .get(`${APIROOT_apo}`)
            .then(res => {
                this.result = res.data.result

                this.date = this.result.date

            })
            .catch((err)=>{
                this.message = "データの取得に失敗しました"
                this.isError = true
            })
    },

    methods: {

        checkInput:function(){
            var ecomp = ''; 
            var evis = '';
            var flag = false; 
            var element;
            if(this.ucompany == ''){
                ecomp = '*会社名が入力されていません';
                element = document.getElementById('ecomp');
                element.innerHTML = ecomp;
                flag = true;
            }
            if(this.uvisitor == ''){
                evis = '*訪問者名が入力されていません'
                element = document.getElementById('evis');
                element.innerHTML  = evis;
                flag = true;
            }
            return flag;
        },
   
        getMember:function(){
            if(this.date == null){
                this.dateforpy=''
            }
            else{
            var inputday = new Date(this.date); //予約の日付
            var input_year = inputday.getFullYear();
            var input_month = ("0"+(inputday.getMonth()+1)).slice(-2);
            var input_day = inputday.getDate();

            this.dateforpy = `${input_year}年${input_month}月${input_day}日` ;

            }
            // document.getElementById('errcomp').innerText = '';
            // document.getElementById('errcomp').hidden = true;
            axios    
            .get(`${APIROOT_apo.concat("/search_appointment")}`, {params: {date_query: this.dateforpy}})
            .then(res => (this.result = res.data.result))
            .catch((err)=>{
                this.message = "データの取得に失敗しました"
                this.isError = true
            })
        
        },
        updateform : function(id,date,company,visitor,time){
            var popup = document.getElementById('js-popupq');
            if(!popup) return;
            popup.classList.add('is-showq');
            this.uid = id;
            var datef = date.split(/[年月日]/)
            for(var i = 0; i<3;i++){
                this.udate += datef[i];
                if(i < 2){
                    this.udate += '-';
                }
            }
            this.udate += 'T';
            var timef = time.split(/[時分]/)
            for(var i = 0;i<2;i++){
                this.udate += timef[i]
                if(i<1){
                    this.udate +=':'
                }
            }
            
            this.ucompany = company;
            this.uvisitor = visitor;
        },

        closeform(){
            var popup = document.getElementById('js-popupq');
            this.clearInput();
            popup.classList.remove('is-showq');
        },

        clearInput:function(){
            this.uid = '';
            this.udate = '';
            this.ucompany = '';
            this.uvisitor = '';
        },
        updateapo: async function(){
            if(this.checkInput()){
                return;
            }
            var datetimes =this.udate.split('T');
            var hr = datetimes[0].split('-');
            hour = hr[0] + '年' +  hr[1] + '月'+ hr[2] + '日';
            var tm = datetimes[1].split(':');
            times = tm[0] + '時' + tm[1] + '分' ;
            var popup = document.getElementById('js-popupq');
            popup.classList.remove('is-showq');
            
            await axios
                .put(`${APIROOT_apo}`, {_id:this.uid,date:hour,time:times,company:this.ucompany,visitor:this.uvisitor})
                .then(res => (this.result = res.data.result))

            alert('データの更新が完了しました');
            this.clearInput();
        },
        foucs(el){
             var s = this.foucs_list[el]
            document.getElementById(this.foucs_list[el]).focus();
        }
    
    },

    template: ` <div><br><br>    

            <label><b>来訪日</b></label>
                <input type="date" v-model="date" v-on:blur="getMember()" v-on:keydown.enter="getMember()">
                <br>  
                <br>  
            <label><b>来訪予約一覧</b></label> 

                <table border="1" >
                <tr style="background-color:#CCFFFF">
                    <th align="center" style="width: 230px;">来訪日</th>
                    <th align="center" style="width: 230px;">会社名</th>
                    <th align="center" style="width: 230px;">来訪者氏名</th>
                    <th align="center" style="width: 230px;">担当者</th>
                    <th align="center" style="width: 60px;">来訪</th>
                    <th align="center" style="width: 60px;">操作
                </tr>
                    <tr v-for="rec in result" v-bind:key="rec._id">
                    <td align="center">{{rec.date}}{{rec.time}}</td>
                    <td align="center">{{rec.company}}</td>
                    <td align="center">{{rec.visitor}}</td>
                    <td align="center">{{rec.name}}</td>
                    <td align="center">{{rec.is_reserved}}</td>
                    <td align="center"><button v-on:click="updateform(rec._id,rec.date,rec.company,rec.visitor,rec.time)"　class = "btn-flat-logo">編集</button></td>            
                </tr>
                    
                </table>
                <div class="popupq" id="js-popupq">
                    <div class="popup-innerq">
                        <div class="close-btnq" id="js-close-btnq">                       
                        <button style="background-color:red;color:white"　id="js-close-btnq" v-on:click="closeform()">✖</button>
                        </div>
                        <label>予約日時:</label>
                        <input type="datetime-local" v-model="udate" id ="update" style="border:1px solid black"><br><br>
                        <label>会社名:</label>
                        <input type="text" v-model="ucompany" id ="ucomp" v-on:keydown.enter="foucs('ucomp')"><label style="size:1px;color:red;" ></label><br><br>
                        <label>訪問者:</label>
                        <input type="text" v-model="uvisitor" id="uvis" v-on:keydown.enter="updateapo()"><label style="size:1px;color:red;" id='evis'></label><br><br>
                        <button v-on:click="updateapo()"　class = "btn-flat-logo">変更</button>
                    </div>
                    <div class="black-backgroundq" id="js-black-bgq"></div>
                </div>
                </div>`
})