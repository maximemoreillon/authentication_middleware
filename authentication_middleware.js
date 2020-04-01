const axios = require('axios')

// secret set by the application
exports.authentication_api_url = undefined

exports.middleware = (req, res, next) => {

  // check if the API URL is defined
  if(!exports.authentication_api_url){
    console.log(new Error("Authentication API URL not set"))
    return res.status(500).send('Authentication API URL not set in the server-side application')
  }

  // Check if authorization header is set
  if(!req.headers.authorization) return res.status(403).send('Authorization header needs to be set for this route')

  // parse the headers to get the token
  let token = req.headers.authorization.split(" ")[1];
  if(!token) return res.status(403).send('JWT not present in authorization header')

  // Send the token to the authentication api for verification
  axios.post(exports.authentication_api_url, {jwt: token})
  .then(response => {

    // passing the user object to the route using res.locals
    res.locals.user = response.data

    // allow continuation to the route
    next()
  })
  .catch(error => { res.status(403).send(error) })

}
