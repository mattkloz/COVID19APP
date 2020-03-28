import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  namespaced: true,

  state: {
    currentCase: {},
    allCases: [],
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated (state) {
      return !!state.user
    },

    currentCase (state) {
      return state.currentCase
    },

    allCases (state) {
      return state.allCases
    },
  },

  mutations: {

    SET_CURRENT_CASE (state, payload) {
      state.currentCase = payload
    },

    UPDATE_CURRENT_CASE (state, payload) {
      state.currentCase = { ...state.currentCase, ...payload }
    },

    DELETE_CURRENT_CASE (state) {
      state.currentCase = {}
    },

    SET_ALL_CASES (state, payload) {
      state.allCases.push(payload)
    },
  },

  actions: {

    async fetchAllUserCases ({ commit, state }) {
      if (state.admin = true) {
        Firebase.firestore().collection('cases').where("status", "==", "new")
        .get()
        .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            commit('SET_ALL_CASES', Object.assign({ caseid: doc.id }, doc.data()))
        });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      })
      }
    },

  }
}