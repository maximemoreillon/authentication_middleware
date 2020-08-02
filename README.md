# Express authorization middleware

## Usage

```
const express = require('express')
const auth = require('@moreillon/authentication_middleware')

auth.authentication_api_url = 'https://auth.example.com'
auth.authentication_api_route  = '/user_from_jwt'

const app = express()
app.use(auth.authenticate)
```
