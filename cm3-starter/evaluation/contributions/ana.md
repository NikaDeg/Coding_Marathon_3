# Contributions – Anastasiia Tkach

## My role in the group project

I worked mainly on the frontend side of user authentication and the vehicle rental forms, and on connecting these pages to the backend API. In practice, I built the authentication integration, restricted the vehicle rental functionality to authenticated users, built the login and logout flow and the pages for adding and editing vehicle rentals, and fixed the integration problems between the React frontend, the Express controllers and the Mongoose models so that data actually reached the database in the right shape. I also made the changes needed to prepare the app for deployment.

## Features and branches

| Feature | Branch | What I did |
|---|---|---|
| User login and logout | `ana-frontend` | Login page and `useLogin` hook; Navbar that shows the logged-in user and a logout button that clears localStorage. |
| Signup and auth hooks | `ver2` | Fixed the signup page so the data it sends matches the user schema; reworked the `useSignup` and `useLogin` hooks to check the response, return success or failure and show errors in the form. |
| Add vehicle rental | `ana-frontend`, `ver2` | Form for creating a new vehicle rental, sending the JWT in the `Authorization` header, required category selection, `listingDate` set at creation, error message shown in the form. |
| Edit vehicle rental | `ana-frontend`, `ver1`, `ver2` | Edit page that loads the existing vehicle, pre-fills the form (including converting dates to the `YYYY-MM-DD` format the date input needs) and sends a `PUT` request with the token. |
| Navbar, listing components and routing | `ana-frontend`, `ver1` | Added authentication to the navbar and listing components, fixed the listing cards and links so they open the correct vehicle, and updated `App` routes so the app works with authentication. |
| Deployment | `ver1` | Madehanges needed to deploy the app.|

## Commits

My own commits in chronological order. Merge commits are left out.

| Commit | Branch | Message |
|---|---|---|
| `edf5389` | `ana-frontend` | (feat) add, edit pages plus components and app has added routes |
| `0855444` | `ver1` | troubleshooting link |
| `d0ce6aa` | `ver1` | list card opens correctly |
| `20e07a1` | `ver1` | (fix) edit button works |
| `5d944af` | `ver1` | (fix) edit works |
| `9cf506a` | `ana-frontend` | (feat) authentication features and loginpage |
| `3a2f3ba` | `ana-frontend` | app |
| `a16b7ac` | `ver1` | (chore) changes for deploiment |
| `f1ade91` | `ver2` | signup changes |
| `179ea0e` | `ver2` | (fix) hooks fix |
| `3b1db3f` | `ver2` | (fix) signup page |
| `94a5462` | `ver2` | token for pages |
| `5eb84d0` | `ver2` | (fix) addPage little last fix |

## Pull requests

I merged my work directly into the shared branches (`ver1`, `ver2`) with git merges rather than through pull requests.