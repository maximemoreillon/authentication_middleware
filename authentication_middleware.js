const axios = require('axios')
const Cookies = require('cookies')
const dotenv = require('dotenv')

dotenv.config()

exports.authentication_api_url = process.env.AUTHENTICATION_API_URL
  || process.env.AUTHENTICATION_MANAGER_URL
  || process.env.AUTHENTICATION_MANAGER_API_URL
  || 'http://authentication'

exports.authentication_api_route = '/user_from_jwt'

let retrieve_jwt = (req, res) => {
  /*
  Retrieving the token from either cookies or authorization header
  */

  let jwt = undefined

  // See if jwt available from authorization header
  if(!jwt){
    if(('authorization' in req.headers)) {
      jwt = req.headers.authorization.split(" ")[1]
    }
  }

  // Try to get JWT from cookies
  if(!jwt) {
    let cookies = new Cookies(req, res)
    jwt = cookies.get('jwt')
  }

  return jwt
}

exports.authenticate = (req, res, next) => {

  // Retrieves user information using the JWT provided by the user
  // will NOT allow the user to proceed with the request if not authenticated

  // retrieve JWT
  let jwt = retrieve_jwt(req, res)

  // if no JWT available, reject request
  if(!jwt) {
    console.log('[Auth middleware] JWT not found in either cookies or authorization header')
    res.status(403).send('JWT not found in either cookies or authorization header')
    return
  }

  // Send the token to the authentication api for verification
  const url = `${exports.authentication_api_url}${exports.authentication_api_route}`
  axios.get(url, {params: {jwt: jwt}} )
  .then(response => {

    // passing the user object to the route using res.locals
    res.locals.user = response.data

    // allow to request to proceed
    next()
  })
  .catch( error => {
    // In case the request fails, forward error message
    console.log(error)
    res.status(403).send(error)
  })

}

exports.identify_if_possible = (req, res, next) => {

  // Retrieves user information using the JWT provided by the user
  // WILL allow the user to proceed with the request if authentication fails

  // retrieve JWT
  let jwt = retrieve_jwt(req, res)

  // if no JWT available, just proceed with request
  if(!jwt) {
    return next()
  }

  // Send the token to the authentication api for verification
  axios.get(`${exports.authentication_api_url}${exports.authentication_api_route}`, {params: {jwt: jwt}} )
  .then(response => {
    // passing the user object to the route using res.locals
    res.locals.user = response.data
  })
  .catch(error => { console.log(error) })
  .finally( () => {
    // No matter the outcome, allow to proceed
    next()
  })
}
