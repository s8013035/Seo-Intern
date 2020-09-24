const APIGET = 'http://isapi01.japaneast.cloudapp.azure.com:5000'
const APIROOT = 'http://isapi01.japaneast.cloudapp.azure.com:5001'
var url1 = APIGET + '?nocache=' + new Date().getTime()
var url2 = APIROOT + '?nocache=' + new Date().getTime()
const Calllink1 = '/def_call'
const Calllink2 = '/spe_call'
const Calldef = APIROOT.concat(Calllink1)
const Callspe = APIROOT.concat(Calllink2)


Vue.component('staff-call', {
    data: () => ({
        message: '',
        isError: false,
        entryName: '',
        entryDistance: '',
        hiddenId: '',
        name: '',
        work: '',
        heisya: '',
        error_name: false,
        error_work: false,
        error_heisya: false,
        result: []
    }),
    methods: {
        errorClear: function() {
            this.error_name = false
            this.error_work= false
            this.error_heisya= false
        },
        inputClear: function() {
            this.name = ''
            this.work = ''
            this.heisya = ''
            this.errorClear()
        },
    
        inputCheck: function() {
            this.error_work = this.work == '' ? true : false
            this.error_heisya = this.heisya == '' ? true : false
            return (this.error_work || this.error_heisya) ? false : true
        },

        getStaff: function () {
            axios
                .get(`${url1}`)
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの取得に失敗しました'
                    this.isError = true
                })
        },
        
        callStaff1: function (name) {
            if(!this.inputCheck()) return
            axios
                .post(`${Calldef}`,{name: name, heisya: this.heisya, work: this.work})
                .catch((err) => {
                    this.message = 'データの更新に失敗しました'
                    this.isError = true
                })
                this.inputClear()
        },

        callStaff2: function () {
            if(!this.inputCheck()) return
            axios
           .post(`${Callspe}`,{heisya: this.heisya, work: this.work})
           this.inputClear()
        },
    
    },

template: `
      <div class="white">
            <h3 align="center">呼び出しモード</h3>
            <form action="#" method="post" align="center">
            <p>来訪者会社名:
                <input type="text" v-model="work" required>
                <span v-if="error_work" style="color:red">会社名が入力されていません</span>
                </p>
                <p>来訪者氏名:
                <input type="text" v-model="heisya" maxlength="10" required>
                <span v-if="error_heisya" style="color:red">来訪者名が入力されていません</span>
                <button v-on:click="callStaff2">
                    <font size="2">呼出</font>
                </button>
            </p>
            </form>
            
            <div class="button" align="center">
                <button v-on:click="getStaff">
                    <font size="2">対応可能担当者一覧</font>
                </button>
                
                
                
            </div>
            
            <staff-table v-bind:records="result"></staff-table>
            <p></p>
            <table border="1" align="center">
                <tr style="background-color:lightblue">
                    <th style="min-width:200px">名前</th>
                    <th font size="2">呼出</th>
                </tr>
                <tr v-for="rec in result" v-bind:keys="rec._id">
                    <td>{{rec.name}}</td>
                    <td>
                        <button v-on:click="callStaff1(rec.name)">
                            <font size="2" color="#006400">呼出</font>
                        </button>
            </td>
        </tr>
    </table>
</div>
`
    });