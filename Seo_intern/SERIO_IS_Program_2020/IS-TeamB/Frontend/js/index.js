
const NotFound = { template: '<p>Page not found</p>' }
const staff = {template: '<staff></staff>'}
const call = {template: '<call></call>'}
const resvisit = {template: '<resvisit></resvisit>'}
const appointment = {template: '<appointment></appointment>'}
const inquiry = {template: '<inquiry></inquiry>'}
const home = {template: '<home></home>'}


const routes = [
    { path: '/', component: home },
    { path: '/staff', component: staff },
    { path: '/call', component: call },
    { path: '/resvisit',component:resvisit},
    { path: '/appointment',component: appointment},
    { path: '/inquiry',component: inquiry}
]

const router = new VueRouter({
    routes
})

var app = new Vue({
    el: '#app',
    router,
    // data: () => ({
    //     cova:''
    // }),
    // mounted:function(){
    //     axios
    //         .get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
    //         .then(res => {
    //             var cov_num = res.data[32]
    //             this.cova = String(cov_num.cases)
    //         })
    //         .catch((err)=>{
    //              this.message = "データの取得に失敗しました"
    //              this.isError = true
    //         })
    // },
});