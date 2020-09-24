Vue.component('staff-reclist', {
    data: () => ({
        message: '',
        isError: false,
        entryName: '',
        entryDistance: '',
        hiddenId: '',
        result: []
    }),
    methods: {
        getReclist: function () {
            axios
                .get(`${Reclist}`)
                .then(res => (this.result = res.data.result))
                .catch((err) => {
                    this.message = 'データの取得に失敗しました'
                    this.isError = true
                })
        },
        
    },

template: `<main>
    <h3>予約一覧モード</h3>
    <form action="#" method="post">
    <br>
    </form>
        <button v-on:click="getReclist">
            <font size="2">一覧表示</font>
        </button>
        <p></p>
        <table border="1" align="center">
            <tr style="background-color:lightblue">
                <th style="min-width:80px">来訪者</th>
                <th style="min-width:150px">会社名</th>
                <th style="min-width:80px">担当者</th>
                <th style="min-width:100px">予約日時</th>
                <th style="min-width:100px">予約完了日時</th>
                <th style="min-width:50px">来訪状態</th>
            </tr>
            <tr v-for="rec in result" >
                <td>{{rec.name}}</td>
                <td>{{rec.company}}</td>
                <td>{{rec.staff}}</td>
                <td>{{rec.days}}</td>
                <td>{{rec.edit_date}}</td>
                <td>{{rec.Checked}}</td>
            </tr>
        </table>       
    <br>
</main>`
});

