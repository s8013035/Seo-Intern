const Call = {template: `<staff-call></staff-call>`}

const Kanri = { template: `<staff-kanri></staff-kanri>` }

const uketukebangou = { template: `<staff-uketukebangou></staff-uketukebangou>` }

const Reservation = { template: `<staff-reservation></staff-reservation>` }

const Reserved = { template: `<staff-reserved></staff-reserved>` }

const Recep = { template: `<staff-reclist></staff-reclist>` }

const Home = {template: `<staff-home></staff-home>`}

const routes = [
  {path: '/', component: Home},
  { path: '/Call', component: Call },
  { path: '/Kanri', component: Kanri },
  { path: '/uketukebangou', component: uketukebangou },
  { path: '/Reservation', component: Reservation},
  { path: '/Reserved', component: Reserved},
  { path: '/Recep-list', component: Recep}
]

/*const routes = [
  { path: '/Call', component: Call },
  { path: '/Kanri', component: Kanri },

]*/
const router = new VueRouter({
  routes 
})
const app = new Vue({
  el: '#app',
  router
})
