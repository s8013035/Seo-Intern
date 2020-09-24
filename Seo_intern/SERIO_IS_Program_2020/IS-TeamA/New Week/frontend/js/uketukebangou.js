Vue.component('staff-uketukebangou', {
    data: function () {
        return{
        message: '',
        isError: false,
        entryName: '',
        entryDistance: '',
        hiddenId: '',
        datenow: '',
        name: '',
        company: '',
        staff: '',
        number: '',
        error: '',
        error2: '',
        error_name: false,
        error_company: false,
        error_staff: false,
        error_number: false,
        error_resid: false,
        result: []
        }
    },
    methods: {
        errorClear: function() {
            this.error_name = false
            this.error_company= false
            this.error_staff= false
            this.error_number= false
            this.error_resid= false
        },
        inputClear: function() {
            this.error = ''
            this.error2 = ''
            this.number = ''
            this.errorClear()
        },
        inputCheck: function() {
            this.error_number = this.number == '' ? true : false
            return (this.error_name) ? false : true
        },

        getyoyaku: async function () {
            if(!this.inputCheck()) return
            await axios
                .get(`${Getban}`, {params:{number: this.number}})
                .then(res => {this.result = res.data.result
                     this.error = res.data.result.error
                     this.datenow = res.data.result.datenow
                     this.name = res.data.result.name
                     this.company = res.data.result.company
                     this.staff = res.data.result.staff
                     this.error2 = res.data.result
                })
                //.then(res => (this.name = res.data.result[0].name))
                //.then(res => (this.company = res.data.result[0].company))
                //.then(res => (this.staff = res.data.result[0].staff))
            
                .catch((err) => {
                    this.message = 'データの取得に失敗しました'
                    this.isError = true
                })
            if (this.error != 'null'){
                alert(this.error2);}

            this.inputClear()
            
        },
        

    },

template: `<main>
    <!-- <style>
        span.eria {
        max-width: 300px;
        margin: 0 auto;
        left: 30px;

        }
    </style> -->
    <h3>番号入力</h3>
    <br>
        <p>受付番号:
            <input type="text" v-model="number" maxlength="6" placeholder="例：000001" required>
            <span v-if="error_number" style="color:red">番号が入力されていません</span>
        <button v-on:click="getyoyaku(number)">
            <font size="2">確認</font>
        </button>
        </p>
    <br>
    <!-- <span> -->
        <p style="position:absolute; top:300px; left:630px;">{{datenow}}</p>
        <p style="position:absolute; top:350px; left:630px;">{{name}}</p>
        <p style="position:absolute; top:400px; left:630px;">{{company}}</p>
        <p style="position:absolute; top:450px; left:630px;">{{staff}}</p>
        
    <!-- </span> -->

</main>`
});

