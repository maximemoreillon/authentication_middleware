# Express authorization middleware

A simple middleware for express that retrieves a JWT from a user's request and sends it to the authentication service for decoding.
The authentication service then replies with the user information correspoding to the token, which the middleware saves as res.locals.user

## Usage

```
// Crerate an express app
const app = require('express')()

// Import que authentication middleware
const auth = require('@moreillon/authentication_middleware')

// Set the URL of the authentication service
// Defaults to http://authentication
// Can also be set using
auth.url = 'https://auth.example.com/user_from_jwt'

// Register the middleware application-wide
app.use(auth.authenticate)
```
