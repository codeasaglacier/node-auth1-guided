//Uncle Iroh's big questions:
//Authentication ( AuthN ) == Who are you?
//Authorization ( AuthZ ) == What do you want?

//AuthN Core Principles
//-Requiring strong passwords
		//not too ridiculous, don't make it a hassle for users
//-Properly storing passwords
		//NEVER store passwords in plain text, hash them instead.
		//password --> bcrypt.js/argon2 --> hash
		//hash passwords before they are stored in the database
		//Password too long error means the password is probably not being hashed
//-Preventing brute-force attacks
		//Brute Force Attack = guessing possible passwords with an algorithm over and over until finding the right one
		//[ Rainbow Table ] = generated table of every possible password run through a particular hashing algorithm
		//Time Complexity = when our code loop over something again and again until a certain amount of time has passed
		//100,000,000 hashes - 2 milliseconds/hash = 55 hours
		//100,000,000 hashes - 2 seconds/hash = 6 years
		//Salting = prepend or append a random sting before hashing
//Sessions and cookies
		//Once you have authenticated, the period until you log out is known as a session
		//Cookies are a way to store small chunks of data i something called a cookie jar, which gets sent through the header
		//First client sends credentials to the server at the login endpoint
		//Second server verifies credentials via the bcrypt hash
		//If authorized, server creates a session
		//Server sends back the session data as a set-cookie header
		//Client stores the cookie in it's cookie jar
		//Client sends cookie on every subsequent request
		//Server verifies the cookie is valid
		//Server provides access to the resource ( authorized )

    const express = require("express")
    const Users = require("../users/users-model")
    const bcrypt = require( "bcryptjs" )
    // const restrict = require( "../middleware/restrict" )
    //16) import sessions and restrict objects
    const { sessions, restrict } = require( "../middleware/restrict" )
    
    const router = express.Router()
    
    router.post("/register", async (req, res, next) => {
      try {
        const { username } = req.body
        const user = await Users.findBy({ username }).first()
    
        if (user) {
          return res.status(409).json({
            message: "Username is already taken",
          })
        }
    
        res.status(201).json(await Users.add(req.body))
      } catch(err) {
        next(err)
      }
    })
    
    router.post("/login", async (req, res, next) => {
      try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()
        const hash = await bcrypt.hash( password, 12 )
    
        //write a function to compare password to hash
        //since bcrypt hashes generate different results due to the salting,
        //we rely on the magic internals to compare hashes rather rather than doing 
        //it manually with "!=="
        const passwordValid = await bcrypt.compare( password, user.password )
    
        //3)compare hash to user password ( Brandon left video at 1:08:46 )
        if (!user || !passwordValid ) {
          return res.status(401).json({
            message: "Invalid Credentials",
          })
        }
    
        //17) create random virtual token for the session
        //26) comment out the virtual token
        // const authToken = Math.random()
        // //since authToken is a variable and not a key it needs bracket syntax instead of dot syntax
        // sessions[ authToken ] = user.id
    
        // //18) send virtual token in header ( go to restrict )
        // //21) to set up cookies to handle real tokens, first comment out the virtual token authorization
        // // res.setHeader( "Authorization", authToken )
        // // the Path=/ allows the cookie to be seen by all the endpoints, Path=/auth/login would restrict the cookies to only that endpoint
        // // To set the cookies same site priority to true, add SameSite=Strict
        // res.setHeader( "Set-Cookie", `token=${ authToken }; Path=/; SameSite=Strict ` )
    
        //27) create req.session object and attach user object ( go to restrict )
        req.session.user = user
    
        res.json({
          message: `Welcome ${user.username}!`
        })
      } catch(err) {
        next(err)
      }
    })
    
    //33) destroy session to log out ( go to package.json to import dotenv by putting  -r dotenv/config  in your server script between nodemon and index. Then create .env file and go to index )
    router.get( "/logout", restrict(), ( req, res, next ) => {
      req.session.destroy( ( err ) => {
        if ( err ) {
          next( err )
        } else {
          res.json( {
            message: "Successfully logged out"
          } )
        }
      } )
    } )
    
    module.exports = router