import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import haversine from '../../utils/haversine';
var _ = require('lodash');

export default {
  namespaced: true,

  state: {
    caseLoad: [],
    currentCase: null,
    allCases: [],
  },

  getters: {

    getCasesCount (state) {
      return state.caseLoad.length
    },

    getAllCasesCount (state) {
      return state.allCases.length
    },

    getCases (state) {
      return state.caseLoad
    },

    getAllCases (state) {
      return state.allCases
    },

    getCurrentCase (state) {
      return state.currentCase
    }

  },

  mutations: {

    SET_CASE_LOAD (state, payload) {
      state.caseLoad.push(payload)
    },

    RESET_CASE_LOAD (state) {
      state.caseLoad = []
    },

    SET_CURRENT_CASE (state) {
        state.currentCase = state.caseLoad[0]
    },

    UPDATE_CURRENT_CASE (state, payload) {
        state.caseload = payload
    },

    SET_ALL_CASES (state, payload) {
      state.allCases.push(payload)
    },

    CLEAR_ALL_CASES (state) {
      state.allCases = []
    },

  },

  actions: {

    async fetchOpenCases ({ commit, rootState, dispatch}, payload) {
      let baseZip = rootState.auth.userProfile.baseZip;
      if (rootState.auth.medical = true) {
        Firebase.firestore()
        .collectionGroup("cases")
        .where("zip", "==", baseZip)
        .where("status", "==", "new")
        .orderBy("priority", "desc")
        .limit(100)
        .onSnapshot(function(querySnapshot) {
          commit('CLEAR_ALL_CASES')
            querySnapshot.forEach(function(doc) {
              let parent = doc.ref.parent.parent.id
              var caseLoc = doc.data().coords
              var distanceAway = haversine(caseLoc, rootState.auth.medicalLocation)
              commit('SET_ALL_CASES', Object.assign({ caseid: doc.id, parent: parent, distance: distanceAway.toFixed(1) }, doc.data()))
            });
        });
      }
    },

    async acceptCase ({ commit, rootState, dispatch}, payload) {
      var casestoaccept = []
      casestoaccept = payload.cases
      let baseZip = rootState.auth.userProfile.baseZip;
      casestoaccept.forEach(async function(acceptedcase) {
        var parent = acceptedcase.parent
        var caseDocRef = Firebase.firestore()
        .collection(baseZip).doc(parent)
        .collection("cases").doc(acceptedcase.caseid)
        try {
          await Firebase.firestore().runTransaction(function (transaction) {
            return transaction.get(caseDocRef).then(function (sfDoc) {
              if (!sfDoc.exists) {
                throw "Document does not exist!";
              }
              var acceptedBy = rootState.auth.user.id;
              transaction.update(caseDocRef, {
                acceptedBy: acceptedBy ,
                acceptedOn: Firebase.firestore.FieldValue.serverTimestamp(),
                status: "accepted"
              });
            });
          });
        }
        catch (error) {
          console.log("Transaction failed: ", error);
        }
      })
    },

    async fetchAcceptedCases ({ commit, rootState }, payload) {
      let baseZip = rootState.auth.userProfile.baseZip;
      let user = rootState.auth.user.id
      if (rootState.auth.medical = true) {
        Firebase.firestore()
        .collectionGroup("cases")
        .where("zip", "==", baseZip)
        .where("acceptedBy", "==", user)
        .orderBy("priority", "desc")
        .limit(100)
        .onSnapshot(function(querySnapshot) {
          commit('RESET_CASE_LOAD')
            querySnapshot.forEach(function(doc) {
              let parent = doc.ref.parent.parent.id
              var caseLoc = doc.data().coords
              var distanceAway = haversine(caseLoc, rootState.auth.medicalLocation)
              commit('SET_CASE_LOAD', Object.assign({ caseid: doc.id, parent: parent, distance: distanceAway.toFixed(1) }, doc.data()))
            });
        });
      }
    },

    async completeCase ({ rootState }, payload) {
      let baseZip = rootState.auth.userProfile.baseZip;
      let user = rootState.auth.user.id;
      let notes = payload.notes;
      let caseid = payload.caseid;
      let parent = payload.parent;
      if (rootState.auth.medical = true) {
        await Firebase.firestore()
        .collection(baseZip).doc(parent)
        .collection('cases').doc(caseid)
        .update({
          status: "completed",
          completionNotes: notes,
          completionDate: Firebase.firestore.FieldValue.serverTimestamp(),
          updated: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(res => {
        }).catch(err => {
            console.log(err)
        })
      }
    },

    async addComment ({ rootState }, payload) {
      let datenow = new Date()
      let baseZip = rootState.auth.userProfile.baseZip;
      let comment = { comment: payload.comment, commentedBy: rootState.auth.user.id, submitted: datenow }
      let caseid = payload.caseid;
      let parent = payload.parent;
      if (rootState.auth.medical = true) {
        await Firebase.firestore()
        .collection(baseZip).doc(parent)
        .collection('cases').doc(caseid)
        .update({
          comments: Firebase.firestore.FieldValue.arrayUnion(comment),
          updated: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(res => {
        }).catch(err => {
            console.log(err)
        })
      }
    },

    async removeCase ({ rootState }, payload) {
      let datenow = new Date()
      let baseZip = rootState.auth.userProfile.baseZip;
      let caseid = payload.caseid;
      let parent = payload.parent;
      let notes = { removeNotes: payload.removeNotes, removedBy: rootState.auth.user.id, whenRemoved: datenow }
      console.log(notes)
      if (rootState.auth.medical = true) {
        await Firebase.firestore()
        .collection(baseZip).doc(parent)
        .collection('cases').doc(caseid)
        .update({
          status: "new",
          acceptedBy: "",
          acceptedOn: null,
          caseRemovals: Firebase.firestore.FieldValue.arrayUnion(notes),
          updated: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(res => {
        }).catch(err => {
            console.log(err)
        })
      }
    },

    async removeCases ({ rootState }, payload) {
      let datenow = new Date()
      let baseZip = rootState.auth.userProfile.baseZip;
      let removalLoad = payload.removalLoad;
      let notes = { removeNotes: payload.removalNotes, removedBy: rootState.auth.user.id, whenRemoved: datenow }
      if (rootState.auth.medical = true) {
        _.forEach(removalLoad, async function(key, value){
          await Firebase.firestore()
          .collection(baseZip).doc(key.parent)
          .collection('cases').doc(key.caseid)
          .update({
            status: "new",
            acceptedBy: "",
            acceptedOn: null,
            caseRemovals: Firebase.firestore.FieldValue.arrayUnion(notes),
            updated: Firebase.firestore.FieldValue.serverTimestamp()
          }).then(res => {
          }).catch(err => {
              console.log(err)
          })
        })
      }
    },

    async updateCase ({ commit}, payload) {
      var toUpdate = payload.caseid
      Firebase.firestore().collection('cases').doc(toUpdate).update({
        updated: firebase.firestore.FieldValue.serverTimestamp()
      }).then(res => {
          commit('SET_CURRENT_CASE', res.data())
      }).catch(err => {
          console.log(err)
      })
    },
  

    async createMyCaseLoad ({ commit, rootState, dispatch}, payload) {
      let baseZip = rootState.auth.userProfile.baseZip;
      if (rootState.auth.medical = true) {

        //First, check if there are any Priority 3 cases in my baseZip
        Firebase.firestore().collection('cases')
        .where("zip", "==", baseZip)
        .where("priority", "==", 3)
        // .where("acceptedBy", "==", "")
        .limit(20)
        .get()
        .then(function(querySnapshot) {
          commit('RESET_CASE_LOAD')
        //for each Priority 3 case found, let me check if there are any other cases at that same address
        querySnapshot.forEach(function(doc) {
          Firebase.firestore().collection('cases')
          .where("coords", "==", doc.data().coords)
          .orderBy("priority", "desc")
          .limit(20)
          .get()
          .then(function(querySnapshot) {
            //For each Priority 3 case and associated cases, assign that case to this user and commit that to the store.
          querySnapshot.forEach(async function(doc) {
            var thisCase = doc.data()
            var thisId = doc.id
            var thisUser = rootState.auth.user.id
            var caseLoc = doc.data().coords
            var distanceAway = haversine(caseLoc, rootState.auth.medicalLocation)
            Object.assign(thisCase, {distance: distanceAway.toFixed(1)});
            await commit('SET_CASE_LOAD', Object.assign({ caseid: doc.id }, thisCase))
            var caseDocRef = Firebase.firestore().collection("cases").doc(thisId)
            //This is where I am assigning those cases
            return Firebase.firestore().runTransaction(function(transaction) {
              return transaction.get(caseDocRef).then(function(sfDoc) {
                  if (!sfDoc.exists) {
                      throw "Document does not exist!";
                  }
                  var newPopulation = thisUser
                  transaction.update(caseDocRef, { 
                    acceptedBy: newPopulation, 
                    acceptedOn: Firebase.firestore.FieldValue.serverTimestamp(), 
                    status: "pending" })
              })
              }).then(function() {
              }).catch(function(error) {
                  console.log("Transaction failed: ", error)
              })
          })
          dispatch('fillMyCaseLoad')
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error)
          })
        })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
      }
    },

    //No I am checking to see how many slots are available after the prioirty 3's
    async fillMyCaseLoad ({ commit, state, rootState}) {
      var remainder = 20 - state.caseLoad.length
      let baseZip = rootState.auth.userProfile.baseZip;
      let timestamp = Firebase.firestore.FieldValue.serverTimestamp()

      Firebase.firestore().collection('cases')
        .where("zip", "==", baseZip)
        .where("acceptedBy", "==", "")
        .get()
        .then(function(querySnapshot) {
        //for each Priority 3 case found, let me check if there are any other cases at that same address
        querySnapshot.forEach(function(doc) {
          Firebase.firestore().collection('cases')
          .where("coords", "==", doc.data().coords)
          .orderBy("priority", "desc")
          .limit(remainder)
          .get()
          .then(function(querySnapshot) {
            //For each Priority 3 case and associated cases, assign that case to this user and commit that to the store.
          querySnapshot.forEach(async function(doc) {
            var thisCase = doc.data()
            var thisId = doc.id
            var thisUser = rootState.auth.user.id
            var caseLoc = doc.data().coords
            var distanceAway = haversine(caseLoc, rootState.auth.medicalLocation)
            Object.assign(thisCase, {distance: distanceAway.toFixed(1)});
            await commit('SET_CASE_LOAD', Object.assign({ caseid: doc.id }, thisCase))
            var caseDocRef = Firebase.firestore().collection("cases").doc(thisId)
            //This is where I am assigning those cases
            return Firebase.firestore().runTransaction(function(transaction) {
              return transaction.get(caseDocRef).then(function(sfDoc) {
                  if (!sfDoc.exists) {
                      throw "Document does not exist!";
                  }
                  var newPopulation = thisUser
                  transaction.update(caseDocRef, { 
                    acceptedBy: newPopulation, 
                    acceptedOn: Firebase.firestore.FieldValue.serverTimestamp(), 
                    status: "pending" })
              })
              }).then(function() {
                console.log("Transaction successfully committed!")
              }).catch(function(error) {
                  console.log("Transaction failed: ", error)
              })
          })
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error)
          })
        })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
      },

    async fetchMyCaseLoad ({ commit, rootState, dispatch }) {
      let baseZip = rootState.auth.userProfile.baseZip;
      if (rootState.auth.medical = true) {
        await Firebase.firestore().collection('cases')
        .where("zip", "==", baseZip)
        .where("priority", "==", 3)
        .get()
        .then(function(querySnapshot) {
          commit('RESET_CASE_LOAD')
        querySnapshot.forEach(function(doc) {
          Firebase.firestore().collection('cases')
          .where("coords", "==", doc.data().coords)
          .orderBy("priority", "desc")
          .limit(20)
          .get()
          .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {

            var thisCase = doc.data()
            var caseLoc = doc.data().coords
            var distanceAway = haversine(caseLoc, rootState.auth.medicalLocation)
            Object.assign(thisCase, {distance: distanceAway.toFixed(1)});
            commit('SET_CASE_LOAD', Object.assign({ caseid: doc.id }, thisCase))
          });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          })
        });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
        commit('SET_CURRENT_CASE')
      }
    },

    async setCurrentCase ({ commit }) {
        Firebase.firestore().collection('cases').doc().get().then(res => {
            commit('SET_CURRENT_CASE', res.data())
        }).catch(err => {
            console.log(err)
        })
    },

    async pushCaseLoad ({ commit }) {
      Firebase.firestore().collection('cases').doc().get().then(res => {
          commit('SET_CURRENT_CASE', res.data())
      }).catch(err => {
          console.log(err)
      })
    },
},
    
}