Vue.component('staff-kanri', {
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
            this.error_name = this.name == '' ? true : false
            return (this.error_name) ? false : true
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
        
        addStaff: function () {
            if(!this.inputCheck()) return
            axios
                .post(`${url1}`,{name: this.name})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの登録に失敗しました'
                    this.isError = true
                })
            this.inputClear()
        },

        updateStaff: function (id) {
            if(!this.inputCheck()) return
            axios
                .put(`${url1}`,{id: id, name: this.name})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの更新に失敗しました'
                    this.isError = true
                })
            this.inputClear()
        },

        deleteStaff: function (id) {
            axios
                .delete(`${url1}`,{data: {id: id}})
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの削除に失敗しました'
                    this.isError = true
                })  
        },
    },

template: `
<div class="white">

    <h3 align="center">担当者管理モード</h3>
    <form action="#" method="post" align="center">
    <p></p>
        <p>登録者名:
            <input type="text" v-model="name" maxlength="10" required>
            <span v-if="error_name" style="color:red">名前が入力されていません</span>
                    <button v-on:click="addStaff">
            <font size="2">追加</font>
        </button>
        </p>
    </form>
    <div class="button" align="center">
        <button v-on:click="getStaff">
            <font size="2">担当者リスト</font>
        </button>


    </div>
        <p></p>
        <staff-table v-bind:records="result"></staff-table>
            
        <table border="1" align="center">
            <tr style="background-color:lightblue">
                <th style="min-width:200px">名前</th>
                <th font size="2">変更</th>
                <th font size="2">削除</th>
            </tr>
            <tr v-for="rec in result" v-bind:keys="rec._id">
                <td>{{rec.name}}</td>
                <td><button v-on:click="updateStaff(rec._id)">
                    <font size="2" color="#191970">変更</font></button>
            </td>
            <td><button v-on:click="deleteStaff(rec._id)">
                <font size="2" color="#ff0000">削除</font></button>
            </td>
            </tr>
        </table>       
</div>
`
});

