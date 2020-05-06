//3) install and import bcryptjs
const bcrypt = require( "bcryptjs" )
const router = require("express").Router();

const Users = require("../users/users-model.js");

//1) write a post to register a user w/credentials
router.post("/register", (req, res) => {
  //const credentials = req.body
  //2) set up credentials
  const userInfo = req.body

  //4) set up your hash with hashSync
  // the password will be hashed and rehashed 2^n times ( 8 in this case)
  //keep low in development ( 8ish ) , set as high as possible in production ( 14-16 ) 
  //higher number of rounds slows down hackers from recalculating hashes
  //5) set number of hash rounds to a variable
  const ROUNDS = process.env.HASHING_ROUNDS || 8
  const hash = bcrypt.hashSync( userInfo.password, ROUNDS )

  //6) set your password to hash
  userInfo.password = hash

  //7) pass in credentials ( go to users-model)
  Users.add( userInfo )
    .then(user => {
      res.json(user);
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
  //11) destructure username and password
  const { username, password } = req.body

  //12) check DB for username
  Users.findBy( { username } )
    .then( ( [ user ] ) => {
      //if there is a user and the password matches
      if( user && bcrypt.compareSync( password, user.password ) ) {
        res.status( 200 ).json( { hello: user.username } )
      } else {
        res.status( 401 ).json( { message: "invalid credentials" } )
      }
  } ).catch( err => {
    res.status( 500 ).json( { message: "Error finding user" } )
  })
})

module.exports = router;