//10) import bcrypt
const bcrypt = require( "bcryptjs" )
//6) import users model
const Users = require( "../users/users-model" )


//14) create a session
const sessions = {}

//4) write a middleware function to prevent unauthorized access
function restrict() {
  //9) create variable for error message
  const authError = {
    message: "Invalid credentials"
  }

  return async( req, res, next ) => {
    // console.log( "Headers:", req.headers )
    try {
      //19) now that we have a sessions token, we don't need to check for username and password, check the user, or hash the password. 
      // const { username, password } = req.headers

      // //5) make sure values aren't empty
      // if ( !username || !password ) {
      //   return res.status( 401 ).json( authError )
      // }
      // //14) research breakpoints for backend
      // console.log( "checkpoint 1" )

      // //7) fetch user from database
      // const user = await Users.findBy( { username } ).first()
      // //8) make sure user exists
      // if ( !user ) {
      //   return res.status( 401 ).json( authError )
      // }
      // console.log( "checkpoint 2" )

      // //11) compare plain text password to hashed password 
      // const passwordValid = await bcrypt.compare( password, user.password )

      // //12) make sure password is correct
      // if ( !passwordValid ) {
      //   return res.status( 401 ).json( authError )
      // }
      // console.log( "checkpoint 3" )
      // //13) if we reach this point, the user is authenticated

      //20) check for auth Header
      // const { authorization } = req.headers
      // if ( !sessions[ authorization ] ) {
      //   return res.status( 401 ).json( authError )
      // }
      //22) Now we need to check the cookies instead of the virtual token, comment out the auth check and write cookie check
      //28) comment out manual cookie check
      // const { cookie } = req.headers
      // if ( !cookie ) {
      //   return res.status( 401 ).json( authError )
      // }
      // //23) extract token from cookie ( go to index )
      // const authToken = cookie.replace( "token=", "" )
      // if ( !sessions[ authToken ] ) {
      //   return res.status( 401 ).json( authError )
      // }

      //29) check if session or user are valid, if not return authError ( go to index )
      if ( !req.session || !req.session.user ) {
        return res.status( 401 ).json( authError )
      }

      next()
    } catch ( err ) {
      next( err )
    }
  }
}

module.exports = {
  sessions,
  restrict
}