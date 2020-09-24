const APIROOT = 'http://localhost:5000'
Vue.component('lunch-table', {
    props: ['records'],
    methods: {
        updateLunch: function (id) {
            this.$parent.$emit('app').updateLunch(id)
        },
    },
    template: `<table border="1" style="border-collapse: collapse">
                <tr style="background-color:lightblue">
                    <th style="min-width:200px">弁当名</th>
                    <th style="min-width:100px">値段</th>
                    <th style="min-width:50px">修正</th>
                </tr>
                <tr v-for="rec in records" v-bind:key="rec._id">
                    <td>{{rec.name}}</td>
                    <td>{{rec.price}}</td>
                    <td style="text-align:center">
                        <button style="background-color:lightgreen;border-radius:3px;width:100%;" v-on:click="updateLunch(rec._id)">FIX</button>
                    </td>
                </tr>
            </table>`
})

var app = new Vue({ 
    el: '#app',
    data: () => ({
        message: '',
        isError: false,
        entryName: '',
        entryDistance: '',
        hiddenId: '',
        name: '',
        price: '',
        error_name: false,
        error_price: false,
        result: []
    }),
    methods: {
        errorClear: function() {
            this.error_name = false
            this.error_price = false
        },
        inputClear: function() {
            this.name = ''
            this.price = ''
            this.errorClear()
        },
        inputCheck: function() {
            this.error_name = this.name == '' ? true : false
            this.error_price = this.price == '' ? true : false
            return (this.error_name || this.error_price) ? false : true
        },
        allClear: function() {
            Object.assign(this.$data, this.$options.data.call(this))
        },
        getLunch: function () {
            this.errorClear()
            axios
                .get(`${APIROOT}`)
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの取得に失敗しました'
                    this.isError = true
                })
        },
        addLunch: function () {
            if(!this.inputCheck()) return
            axios
                .post(`${APIROOT}`,{name: this.name, price: this.price})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                })
            this.inputClear()
        },
        updateLunch: function (id) {
            if(!this.inputCheck()) return
            axios
                .put(`${APIROOT}`,{id: id, name: this.name, price: this.price })
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの更新に失敗しました'
                    this.isError = true
                })
            this.inputClear()
        },
    }
});
