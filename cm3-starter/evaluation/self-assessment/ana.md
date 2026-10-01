# Self-Assessment – Anastasiia Tkach
 
## Quality and functionality of my code
By the end of the marathon, the features I worked on work end to end. A user can log in, see their name in the navbar, log out, add a vehicle rental and edit an existing one. 
Requests reach the backend, the data is saved in MongoDB in the shape the schema expects, and protected requests send the JWT from localStorage.

What I think is good about the code:

- Form inputs use the reusable `useField` hook, and the auth requests live in the `useSignup` and `useLogin` hooks, so the page components are short and readable.
- Error handling is consistent.
- The data sent from the frontend matches the backend controller and the Mongoose schema field by field.

What I would improve with more time:
- `useSignup` and `useLogin` are almost identical and could be merged into one hook.
- Several bugs were only found during testing. Agreeing on the exact request format with the backend before writing the forms would have prevented most of them.

## Challenges and how I overcame them
 
**Signup looked successful but no users were saved.** There were two causes. First, the component checked `if (!error)` right after `await signup()`, but `error` inside the handler still held the old value from the last render, so the app logged the user in and navigated home even when the request failed. I fixed this by making the hook return `true` or `false` and acting on that result. Second, the form sent `license_number` and flat `city`, `licenseExpiryDate` and `yearsOfExperience` fields, while the controller and schema expected `licenseNumber` and a nested `address` object. The controller rejected every request with "Please add all fields". I compared the payload, the controller and the schema side by side and changed the payload to match the schema.
 
**`NetworkError when attempting to fetch resource`.** This meant the request got no response at all. I checked the dev server and backend terminals to find which part of the chain was not running or had crashed.
 
**The "Add Vehicle Rental" button navigated away before saving.** The submit button had `onClick={() => navigate("/")}`, so the page left before the form was submitted. Removing the `onClick` and navigating only after a successful request fixed it.
 
To work through these problems I used the browser's Network tab, the backend and dev server logs.
 
## What I learned
 
- The frontend payload, the controller's destructuring and the Mongoose schema form one contract. Mongoose silently drops fields that are not in the schema, so a mismatch can fail without an obvious error.
- Always check `response.ok` before parsing a response, and show errors to the user instead of only logging them.
- When debugging a request, start with evidence: the status code and response body in the Network tab tell which layer to look at.
 
