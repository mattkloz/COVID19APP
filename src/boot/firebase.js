import Firebase from 'firebase/app';
import firebaseConfig from './firebase.env.json'
import store from '../store'

export default ({ Vue }) => {
  Firebase.initializeApp(firebaseConfig)

  Firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = Firebase.auth().onAuthStateChanged(async user => {
            if (user) {
              store.commit('auth/SET_USER', {id: user.uid})
              let hasprofile = store.state.auth.userProfile
              if (hasprofile == null) {
                await store.dispatch('auth/fetchUserProfile')
              }
            }
            unsubscribe();
            resolve(user);
            
        }, reject);
    })
  };
  
  Vue.prototype.$firebase = Firebase
  }