const Call = {template: `<staff-call></staff-call>`}

const Kanri = { template: `<staff-kanri></staff-kanri>` }
const routes = [
  { path: '/Call', component: Call },
  { path: '/Kanri', component: Kanri }
]
const router = new VueRouter({
  routes 
})
const app = new Vue({
  el: '#app',
  router
})
