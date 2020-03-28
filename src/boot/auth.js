import Firebase from 'firebase/app'
import 'firebase/auth'
import { Loading } from 'quasar'

export default ({ app, router, Vue, store }) => {
  router.beforeEach(async (to, from, next) => {
    Loading.show()
    let authRequired = to.matched.some(route => route.meta.authRequired)

    if (authRequired && !await Firebase.getCurrentUser()){
      next('login');
    }else{
      next();
    }
  })

  router.afterEach((to, from) => {
    Loading.hide()
  })
}