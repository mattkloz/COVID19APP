# COVID-19 TESTING REQUESTS & PRIORITIZATION APPLICATION

[DEMO APP](https://ricovid19.firebaseapp.com/)

[VIEW THE REPO](https://github.com/mattkloz/COVID19APP)

This is an app for people to request in-home COVID-19 testing, which prioritizes those requests and allows medical professionals to act on those requests. This was developed for use in Rhode Island (my home state) but is likely applicable anywhere in the US (or world if you update the Zip Code tracking to some local format, or stricly on coordinates).

Build on the Quasar Framework (quasar.dev), this app can can build for web, iOS and android. It uses Google Firebase (firebase.google.com) for authentication and the Firestore db(NoSql), so it is client-only app (no backend).

## Using the Demo App:
- Visit the Demo App link above (works best on your mobile device) and login with your phone number or email address.
- Create a few cases with addresses in the zip code that you live
- Fill in your Profile page and select the 'Request Medical' checkbox
- I will review Medical Requests periodically and will let you know when you have been approved
- You can then login again but will be redirected to the Medical Dashboard
- Set your 'Base Zip' in your profile to your local zip code
- Any cases (including the cases you created at that zip code previously) will be visible in the 'Open Cases' tab
- You can then view case details, view them on a map and add them to your caseload
- You can then interact with cases in your caseload, such as navigating, completing or commenting on cases.

## Major Functionality:

### Users:
- Users can login by phone or email
- Users can submit "cases" (requests for testing) for themselves or others, they can also comment on and remove previously created cases
- Cases reside under addresses which reside under zip codes (Zipcode->Street Address->Case)
- Cases collect myriad information on the person requesting a test, such as their age, symptoms they are experiencing, preexisting conditions, etc. which creates a "priority" based on these conditions

#### Adding Symptoms to a case
![Users Demo](https://demo-mjk.s3.amazonaws.com/symptoms3.gif)

### Medical Professionals:
- Medical Professionals (MPs) are users with a designated "medical" flag, they use the same login as regular users but are redirected to a separate dashboard.
- MPs set a base zipcode that allows them to see open cases in that area, and they also must allow the app to get their current location.
- Cases are grouped by address and then presented to an MP based on the priorities of the cases. They can also view open cases on a map.
- MP's "accept" cases, which assign the case to them in the db, and moves the case to their "caseload", making the cases unavailable to other MPs in the same area.
- MPs can then interact with the cases in their caseload (e.g. add comments, view contact info, navigate to the case location (which opens the case location in the user's mobile device with directions), complete the case or remove the case from their caseload.)

#### Case Management
![Medical Demo](https://demo-mjk.s3.amazonaws.com/medical3.gif)

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
- If a medical user changes their base zip while they have active cases in their caseload, those cases are removed from their caseload. Should prevent a change of basezip with incomplete cases in a caseload.
    

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
