const aaa = `2020/09/04`

Vue.component('staff-home', {
    data: () => ({
        message: '',
        isError: false,
        entryName: '',
        entryDistance: '',
        hiddenId: '',
        result: ''
    }),

    methods: {    
    },

    mounted: function () {
        axios
            .get(`${Fortune}`)
            .then(res => (this.result = res.data.horoscope.aaa[0]))
            .catch((err) => {
                this.message = 'データの取得に失敗しました'
                this.isError = true
            })
    },

template: `<main>
    <p>{{result.content}}</p>
    <h3></h3>

</main>`
});

