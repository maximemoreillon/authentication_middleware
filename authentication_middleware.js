const axios = require('axios')
const Cookies = require('cookies')

// secret set by the application
exports.authentication_api_url = undefined

exports.middleware = (req, res, next) => {

  // check if the API URL is defined
  if(!exports.authentication_api_url){
    console.log(new Error("Authentication API URL not set"))
    return res.status(500).send('Authentication API URL not set in the server-side application')
  }

  let jwt = undefined

  // See if jwt available from authorization header
  if(!jwt){
    if(('authorization' in req.headers)) {
      jwt = req.headers.authorization.split(" ")[1]
    }
  }

  // Try to get JWT from cookies
  if(!jwt) {
    var cookies = new Cookies(req, res)
    jwt = cookies.get('jwt')
  }

  // if no JWT available, reject request
  if(!jwt) {
    res.status(403).send('JWT not found in either cookies or authorization header')
  }

  // Send the token to the authentication api for verification
  axios.post(`${exports.authentication_api_url}`, {jwt: jwt})
  .then(response => {

    // passing the user object to the route using res.locals
    res.locals.user = response.data

    // allow continuation to the route
    next()
  })
  .catch(error => { res.status(403).send(error) })

}
