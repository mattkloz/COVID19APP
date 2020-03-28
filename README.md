# COVID-19 TESTING REQUESTS

[DEMO APP](https://ricovid19.firebaseapp.com/)

An app to allow users to request in-home COVID-19 testing and medical professionals to respond to those requests.

Build on the Quasar Framework (quasar.dev), this app can can build for web, iOS and android. It uses Google Firebase (firebase.google.com) for authentication and the Firestore db(NoSql), so it is client-only app (no backend).

## Major Functionality:

### Users:
- Users can login by phone or email
- Users can submit "cases" (requests for testing) for themselves or others, they can also comment on and remove previously created cases
- Cases reside under addresses which reside under zip codes (Zipcode->Street Address->Case)
- Cases collect myriad information on the person requesting a test, such as their age, symptoms they are experiencing, preexisting conditions, etc. which creates a "priority" based on these conditions

### Medical Professionals:
- Medical Professionals (MPs) are users with a designated "medical" flag, they use the same login as regular users but are redirected to a separate dashboard.
- MPs set a base zipcode that allows them to see open cases in that area, and they also must allow the app to get their current location.
- Cases are grouped by address and then presented to an MP based on the priorities of the cases. They can also view open cases on a map.
- MP's "accept" cases, which assign the case to them in the db, and moves the case to their "caseload", making the cases unavailable to other MPs in the same area.
- MPs can then interact with the cases in their caseload (e.g. add comments, view contact info, navigate to the case location (which opens the case location in the user's mobile device with directions), complete the case or remove the case from their caseload.)

### Todos:
- Send email or text message to users when their case has been scheduled
- Add ability for hospitals to see case activity in their area
- Add ability for MPs to refer cases to Hospitals
- General cleansing of the UI
- Code cleanup
- More sophisticated "prioritization"
- Admin dashboard to streamline approval of MPs
- Service Workers for offline functionality
- Identifying hotspots based on testing requests and priority
- Streamline the SessionStorage / encrypt it
    

## Install the dependencies
```bash
npm install
```


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
