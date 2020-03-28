import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import user from './user'
import medical from './medical'
import admin from './admin'
import VuexPersist from 'vuex-persist';
import Cookies from 'js-cookie'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.sessionStorage,
  reducer: state => ({
    auth: state.auth,
    user: state.user,
    medical: state.medical,
    admin: state.admin
  })
})

const store = new Vuex.Store({
  modules: {
    auth,
    user,
    medical,
    admin
  },
  plugins: [vuexLocalStorage.plugin]
})

export default store
