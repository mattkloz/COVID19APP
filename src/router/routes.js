import store from '../store'
import Firebase from 'firebase/app'
import 'firebase/auth'

export default [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', name: 'landing', component: () => import('../pages/shared/landing.vue') }
    ]
  },

  {
    path: '/login',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/shared/userLogin.vue') }
    ]
  },

  {
    path: '/newcase',
    component: () => import('layouts/UserLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', name: 'newcase', component: () => import('../pages/users/newcase.vue') }
    ],
  },

  {
    path: '/userdashboard',
    component: () => import('layouts/UserLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', name: 'userdashboard', component: () => import('../pages/users/dashboard.vue') }
    ],
  },

  {
    path: '/contact',
    component: () => import('layouts/UserLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', name: 'contact', component: () => import('../pages/users/contact.vue') }
    ],
  },

  {
    path: '/symptoms',
    component: () => import('layouts/UserLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', name: 'symptoms', component: () => import('../pages/users/symptoms.vue') }
    ],
  },

  {
    path: '/review',
    component: () => import('layouts/UserLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', name: 'review', component: () => import('../pages/users/review.vue') }
    ],
  },

  {
    path: '/userprofile',
    component: () => import('layouts/UserLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', name: 'userprofile', component: () => import('../pages/users/profile.vue') }
    ],
  },

  {
    path: '/medicaldashboard',
    component: () => import('layouts/MedicalLayout.vue'),
    meta: { authRequired: true},
    beforeEnter: (to, from, next) => {
      let isMedical = store.state.auth.medical
      if (!isMedical) {
        next('userdashboard')
      } else next()
    },
    children: [
      { path: '', name: 'medicaldashboard', component: () => import('../pages/medical/dashboard.vue') }
    ],
  },
 
  {
    path: '/medicalprofile',
    component: () => import('layouts/MedicalLayout.vue'),
    meta: { authRequired: true },
    beforeEnter: (to, from, next) => {
      let isMedical = store.state.auth.medical
      if (!isMedical) {
        next('userdashboard')
      } else next()
    },
    children: [
      { path: '', name: 'medicalprofile', component: () => import('../pages/medical/profile.vue') }
    ],
  },

  {
    path: '/medicalallcases',
    component: () => import('layouts/MedicalLayout.vue'),
    meta: { authRequired: true },
    beforeEnter: (to, from, next) => {
      let isMedical = store.state.auth.medical
      if (!isMedical) {
        next('userdashboard')
      } else next()
    },
    children: [
      { path: '', name: 'medicalallcases', component: () => import('../pages/medical/allcases.vue') }
    ],
  },

  {
    path: '/map',
    component: () => import('layouts/MedicalLayout.vue'),
    meta: { authRequired: true },
    beforeEnter: (to, from, next) => {
      let isMedical = store.state.auth.medical
      if (!isMedical) {
        next('userdashboard')
      } else next()
    },
    children: [
      { path: '', name: 'map', component: () => import('../pages/medical/map.vue') }
    ],
  },
  
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
