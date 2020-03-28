import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { Notify } from 'quasar'

export default {
  namespaced: true,

  state: {
    userCases: [],
    currentCase: {},
  },

  getters: {
    currentCase (state) {
      return state.currentCase
    }, 
    getAllCasesCount (state) {
      return state.userCases.length
    },
  },

  mutations: {

    SET_USER_CASE (state, usercase) {
      state.userCases.push(usercase)
    },

    SET_CURRENT_CASE (state, payload) {
      state.currentCase = payload
    },

    UPDATE_CURRENT_CASE (state, payload) {
      state.currentCase = { ...state.currentCase, ...payload }
    },

    DELETE_CURRENT_CASE (state) {
      state.currentCase = {}
    },

    RESET_USER_CASES (state) {
      state.userCases = []
    }
  },

  actions: {

    async setUserCase ({ commit, dispatch }, payload ) {
      let thisCase = payload
      let zip = thisCase.zip
      let address = thisCase.streetAddress

      Object.assign({ acceptedBy: "", acceptedBy: ""}, thisCase)

      return Firebase.firestore()
      .collection(zip).doc(address)
      .collection('cases').doc()
      .set(thisCase).then(res => {
        commit('DELETE_CURRENT_CASE')
        dispatch('fetchUserCases')
      }).catch(err => {
          console.log(err)
      })
    },

    async fetchUserCases ({ commit, rootState }) {
      Firebase.firestore()
      .collectionGroup("cases")
      .where("submittedBy", "==", rootState.auth.user.id)
      .orderBy("created", "desc")
      .onSnapshot(function(querySnapshot) {
        commit('RESET_USER_CASES')
          querySnapshot.forEach(function(doc) {
            if (doc.data().status != "withdrawn") {
              let parent = doc.ref.parent.parent.id
              commit('SET_USER_CASE', Object.assign({ caseid: doc.id, parent: parent}, doc.data()))
            }
          });
      });
    },

    async withdrawCase ({ rootState }, payload) {
      let datenow = new Date()
      await Firebase.firestore()
      .collection(payload.zip).doc(payload.parent)
      .collection('cases').doc(payload.caseid)
      .update({
        status: "withdrawn",
        withdrawnBy: rootState.auth.user.id,
        withdrawnOn: datenow,
        updated: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(res => {
        Notify.create(`${payload.firstName}'s case has been withdrawn.`)
      }).catch(err => {
          console.log(err)
      })
    },

    async setCurrentCase ({ commit, state }) {
      Firebase.firestore().collection('cases').doc().get().then(res => {
          commit('SET_CURRENT_CASE', res.data())
      }).catch(err => {
          console.log(err)
      })
    },
  }
}