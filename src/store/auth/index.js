import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { LocalStorage, SessionStorage } from 'quasar'
import router from '../../router'

export default {
  namespaced: true,

  state: {
    user: {},
    userProfile: null,
    admin: false,
    medical: false,
    medicalLocation: null,
    adminLocation: null,
    baseZip: null,
    allUsers: [],
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated (state) {
      return !!state.user
    },

    admin (state) {
      return state.admin
    },

    medical (state) {
      return state.medical
    },

    isAdmin (state) {
      return state.admin
    },

    isMedical (state) {
        return state.medical
    },

    baseZip (state) {
      return state.user.baseZip
    },

    getUserProfile (state) {
      return state.userProfile
    },

    getAllUsers (state) {
      return state.allUsers
    }
  },

  mutations: {
    RESET_ALL (state) {
      state.user = null
      state.userProfile = null
      state.medical = false
      state.admin = false
      state.medicalLocation = null
    },

    SET_USER (state, payload) {
        state.user = payload
    },

    RESET_USER (state) {
      state.user = null
    },

    RESET_USER_PROFILE (state) {
      state.userProfile = null
    },

    SET_USER_PROFILE (state, payload) {
      state.userProfile = payload
    },

    SET_MEDICAL (state, payload) {
      state.medical = payload
    },

    SET_ADMIN (state, payload) {
      state.admin = payload
    },

    SET_MEDICAL_LOCATION (state, payload) {
      state.medicalLocation = payload
    },

    SET_ADMIN_LOCATION (state, payload) {
      state.adminLocation = payload
    },

    SET_BASE_ZIP (state, payload) {
      state.baseZip = payload
    },

    SET_ALL_USERS (state, payload) {
      state.allUsers.push(payload)
    },

    RESET_ALL_USERS (state) {
      state.allUsers = []
    },

  },

  actions: {

    async signIn ({ commit }, payload) {
      let email = payload.email;
      let location = payload.location;
      var actionCodeSettings = {
        url: location,
        handleCodeInApp: true 
      };
      await Firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(user => {
          LocalStorage.set('emailForSignIn', email);
        })
        .catch(error => {
          throw error
        })
    },

    async logUserIn ({ dispatch, commit, state }, payload) {
      let email = payload.email;
      let location = payload.location;
      await Firebase.auth().signInWithEmailLink(email, location)
        .then(async user => {
          commit('SET_USER', {id: user.user.uid})
          await dispatch('fetchUserProfile')
          let isMedical = state.medical
          console.log(isMedical)
          if (isMedical) {
            router.replace({ name: 'medicaldashboard' }).catch(() => {})
          } else {
            router.replace({ name: 'userdashboard' }).catch(() => {})
          }
          if (user.additionalUserInfo.isNewUser == true) {
            Firebase.firestore().collection('users').doc(user.user.uid).set({
              role: "user",
              email: email,
              phone: "555-555-5555"
            }).then(() => {
            }).catch(err => {
                console.log(err)
            })
          }
        })  
    },

    async signOut ({commit}) {
      await Firebase.auth().signOut()
        .then(async () => {
          SessionStorage.remove('vuex');
          await commit('RESET_ALL')
          router.push({ name: 'login' }).catch(() => {})
        })
    },

    async deleteAccount ({ commit }) {
      await Firebase.auth().signOut()
        .then(() => {
          commit('SET_USER', {})
        })
    },

    async fetchAllUsers ({ commit, state }) {
      let baseZip = state.userProfile.baseZip;
      if (state.medical = true) {
        Firebase.firestore()
        .collection('users')
        .where("baseZip", "==", baseZip)
        .get()
        .then(function(querySnapshot){
          commit('RESET_ALL_USERS')
          querySnapshot.forEach(function(doc) {
            commit('SET_ALL_USERS', Object.assign({userid: doc.id}, doc.data()))
          });
        });
      }
    },

    async fetchUserProfile ({ commit, state }) {
      return Firebase.firestore()
      .collection('users').doc(state.user.id)
      .get()
      .then( res => {
          commit('SET_USER_PROFILE', res.data())
          if (res.data().role == "admin"){
            commit('SET_ADMIN', true)
            commit('SET_BASE_ZIP', res.data().baseZip)
          } else if (res.data().role == "medical") {
            commit('SET_MEDICAL', true)
            commit('SET_BASE_ZIP', res.data().baseZip)
          } else {
          }
      }).catch(err => {
          console.log(err)
      })
    },

    async updateUserProfile ({ commit, state, dispatch }, payload) {
      var toUpdate = state.user.id
      await Firebase.firestore().collection('users').doc(toUpdate).update({
        email: payload.email,
        phone: payload.phone,
        name: payload.name,
        requestedMed: payload.requestedMed,
        requestedMedOn: Firebase.firestore.FieldValue.serverTimestamp(),
        updated: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(res => {
        dispatch('fetchUserProfile')
      }).catch(err => {
          console.log(err)
      })
    },

    async updateMedicalProfile ({ commit, state, dispatch }, payload) {
      var toUpdate = state.user.id
      await Firebase.firestore().collection('users').doc(toUpdate).update({
        baseZip: payload.baseZip,
        email: payload.email,
        phone: payload.phone,
        name: payload.name,
        updated: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(res => {
        dispatch('fetchUserProfile')
      }).catch(err => {
          console.log(err)
      })
    },

  }
}