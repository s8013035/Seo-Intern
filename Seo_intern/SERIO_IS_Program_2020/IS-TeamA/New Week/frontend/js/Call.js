const Reservation_Match = 'https://love-calculator.p.rapidapi.com/getPercentage'
const Fortune = 'http://api.jugemkey.jp/api/horoscope/free/2020/09/04'
const APIGET = 'http://isapi01.japaneast.cloudapp.azure.com:5000'
const APIROOT = 'http://isapi01.japaneast.cloudapp.azure.com:5001'
const APIRES = 'http://isapi01.japaneast.cloudapp.azure.com:5002'
const Calllink1 = '/def_call'
const Calllink2 = '/spe_call'
const Reservelink = '/reserve'
const Getlink1 = '/kanri'
const Getlink2 = '/reception'
const Getlink3 = '/res_call'
const Getcomer1 = '/comer'
const recept = '/reskanri'
const Calldef = APIROOT.concat(Calllink1)
const Callspe = APIROOT.concat(Calllink2)
const Reserve = APIRES.concat(Reservelink)
const GetAll = APIGET.concat(Getlink1)
const GetSpe = APIGET.concat(Getlink2)
const Getban = APIROOT.concat(Getlink3)
const Comerspe = APIGET.concat(Getcomer1)
const Reclist = APIRES.concat(recept)



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
        percentage: '',
        error_name: false,
        error_work: false,
        error_heisya: false,
        result: [],
        theworld: false,
        loveword: '',
        loveimg: '',
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
            if(!this.inputCheck()) return
            axios
                .get(`${GetSpe}`,{params:{work: this.work}})
                .then(res => (this.result = res.data))
                .catch((err) => {
                    this.message = 'データの取得に失敗しました'
                    this.isError = true
                })
        },


        callStaff1: async function (name) {
            if(!this.inputCheck()) return
            await axios
                .post(`${Calldef}`,{name: name, heisya: this.heisya, work: this.work})
                .then(res =>(this.result = res.data.result))
            this.matchStaff()    
        },
        matchStaff: async function (){
            if(!this.inputCheck()) return
         await   axios
                    .get(`${Reservation_Match}`,
                    {headers: {"x-rapidapi-key":"fce26dd8a3mshba191df096ad51ep114133jsnbd0e4a4cb361"},
                    params: { fname: this.result[0].name, sname: this.result[0].staff } })
                    .then(res =>(this.percentage = res.data.percentage))
                    .catch((err) => {
                        this.message = 'データの取得に失敗しました'
                        this.isError = true
                    }) 
            if (this.percentage >= 98){
                this.loveword = '担当者と来訪者の相性は' + this.percentage + '%です💖。MajiでKoiする5秒前！'
                this.loveimg = './img/pokemon3.png'
            } 
            else if (this.percentage >= 90){
                this.loveword = '担当者と来訪者の相性は' + this.percentage + '%です✨。施されたら施し返す。恩返ししあえる関係になれます。！'
                this.loveimg = './img/pokemon2.png'
            }
            else if (this.percentage >= 70){
                this.loveword = '担当者と来訪者の相性は' + this.percentage + '%です(^_^)。二人はただの仕事仲間っすね～'
                this.loveimg = './img/pokemon5.png'
            }
            else if (this.percentage >= 50){
                this.loveword = '担当者と来訪者の相性は' + this.percentage + '%です😢。お互いにお互いの陰口を言い合うであろう関係になりうる！'
                this.loveimg = './img/pokemon4.png'
            }
            else{
                this.loveword = '担当者と来訪者の相性は' + this.percentage + '%です😭。あんたらはひとこと言われたら十倍にして言い返せ！十倍返しや！'
                this.loveimg = './img/pokemon6.jpg'
            }
            this.openlove()


        },

        callStaff2: function () {
            if(!this.inputCheck()) return
            axios
                .post(`${Callspe}`,{heisya: this.heisya, work: this.work})

        },

        callComer1: function (name) {
            if(!this.inputCheck()) return
            axios
                .post(`${Comerspe}`,{name: name, heisya: this.heisya, work: this.work})

        },

        openlove: function(){
            this.theworld = true
        },

        closelove: function(){
            this.theworld = false
        },
    },

template: `<main>
        <h3>呼び出しモード</h3>
        <form action="#" method="post">
        <p>来訪者会社名:
            <input type="text" v-model="work" required>
            <span v-if="error_work" style="color:red">会社名が入力されていません</span>
            </p>
            <p>来訪者名:
            <input type="text" v-model="heisya" maxlength="10" required>
            <span v-if="error_heisya" style="color:red">来訪者名が入力されていません</span></p>
        </form>

        <button v-on:click="getStaff()">
            <font size="2">GET</font>
        </button>
        
        <button v-on:click="callStaff2">
            <font size="2">呼出</font>
        </button>
    <p></p>
        
    　　<table border="1" align="center">
        <tr style="background-color:lightblue">
            <th style="min-width:200px">名前</th>
            <th font size="2">呼出</th>
        </tr>
        <tr v-for="name in result.name">
            <td>{{name}}</td>
            <td>
              <button v-on:click="callStaff1(name); callComer1(name)">
              	<font size="2" color="#006400">呼出</font>
              </button>
            </td>
        
        </tr>
        <div v-if="theworld" id="overlay">
          <div id="content">
            <p>{{this.loveword}}</p>
            <a href="#"><img class="loveloveimg" v-bind:src="this.loveimg" width="230" height="250"></a>
            <button v-on:click="closelove">バイなら！</button>
          </div>
        </div>
        
    </table>
    </main>`
    });

