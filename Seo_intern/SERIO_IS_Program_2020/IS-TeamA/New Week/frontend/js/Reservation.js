

//予約画面について、dataを送るmakeReservationなどは他のファイルとすり合わせる必要あり
Vue.component('staff-reservation', {
    data: () => ({
        message: '',
        isError: false,
        entryName: '',
        entryDistance: '',
        hiddenId: '',
        work: '',
        heisya: '',
        days: '',
        name: '',
        resid: '',
        error_days: false,
        error_name: false,
        error_work: false,
        error_heisya: false,
        result: [],
    }),
    methods: {
        errorClear: function() {
            this.error_days = false
            this.error_work = false
            this.error_heisya = false
        },
        inputClear: function() {
            this.resid = ''
            this.days = ''
            this.work = ''
            this.heisya = ''
            this.errorClear()
        },
    
        inputCheck: function() {
            this.error_days = this.days == '' ? true : false
            this.error_work = this.work == '' ? true : false
            this.error_heisya = this.heisya == '' ? true : false
            return ((this.error_days || this.error_work) || (this.error_work || this.error_heisya)) ? false : true
        },

        callStaff1: function (name) {
            if(!this.inputCheck()) return
            axios
                .post(`${Calldef}`,{name: name, heisya: this.heisya, work: this.work})
        },

        getStaff: function () {
            if(!this.inputCheck()) return
            axios
                .get(`${GetSpe}`,{params:{work: this.work}})
                .then(res => (this.result = res.data))
                .catch((err) => {
                    this.message = 'データの取得に失敗しました'
                    this.isError = true
                })
        },
        makeReservation: async function (name) {
            if(!this.inputCheck()) return
            //alert('予約を完了いたしました。あなたの予約番号は111111です。')
         
            await axios
                    .post(`${Reserve}`,{days: this.days, heisya: this.heisya, work: this.work, name: name})
                    .then(res => (this.resid = res.data.resid))
                    .catch((err) => {
                        this.message = 'データの更新に失敗しました'
                        this.isError = true
                    })
                //openApi後ほど修正しなければならない
          
                
    
            alert('予約を完了いたしました。あなたの予約番号は' + this.resid + 'です。')
            this.inputClear()
             
                        
        },
    
    /*     displayResid: function (resid){
            if(!this.inputCheck()) return
            axios
                .then(res => (this.result = res.resid),
                alert('予約を完了いたしました。あなたの予約番号は' + resid + 'です。'))
                

        }, */ 
        
      
    
    },
    
   



//typeのdaysなどはほかの人と折り合いをつけて合わせなければならない
template: `<main>
    
            <h3 align="center">予約モード</h3>
            <form action="#" method="post" align="center">
                <p>来訪日時:
                <input type="datetime-local" v-model="days" required>
                <span v-if="error_days" style="color:red">来訪日時が入力されていません</span>
                </p>
                <p>来訪者会社名:
                <input type="text" v-model="work" maxlength="20" required>
                <span v-if="error_work" style="color:red">来訪者会社名が入力されていません</span>
                </p>
                <p>来訪者名:
                <input type="text" v-model="heisya" maxlength="10" required>
                <span v-if="error_heisya" style="color:red">来訪者名が入力されていません</span>
                </p>
            </form>

        
                <button v-on:click="getStaff()">
                    <font size="2">担当者リスト</font>
                </button>
                
                
                
            <p></p>
            
            <staff-table v-bind:records="result"></staff-table>
            
            <table border="1" align="center">
                <tr style="background-color:lightblue">
                    <th style="min-width:200px">名前</th>
                    <th font size="2">予約</th>
                </tr>
                <tr v-for="name in result.name">
            <td>{{name}}</td>
            <td>
            <button v-on:click="makeReservation(name)">
            <font size="2" color="#006400" >予約</font>
            </button>
            </td>
        </tr>
    </table>
    <script src="./index.js"></script>
    </main>`
    });