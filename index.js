const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const morgan = require( "morgan" )
//24) install, import express-session
const session = require( "express-session" )
//31) install, import connect-session-knex
const KnexSessionStore = require( "connect-session-knex" )( session )
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")
//33) import config
const dbConfig = require( "./database/config" )

const server = express()
const port = process.env.PORT || 5000

server.use(cors())
server.use(helmet())
server.use( morgan() )
server.use(express.json())
//25) call express-session with options ( go to auth-router )
server.use( session( {
	//https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
	name: "token", //overwrites the default cookie name, hides our stack better
	resave: false, //avoid recreating sessions that have not changed
	saveUninitialized: false, //GDPR laws against setting cookies automatically
	//34) after storing secret in .env, pass .env to secret
	secret: process.env.COOKIE_SECRET || "secret", //cryptographically sign the cookie
	//30) create cookie option 
	cookie: {
		// maxAge: 15000 //expires cookie after 15 seconds
		httpOnly: true //disallows javascript from reading our cookie contents
	},
	//32) create store option ( go to auth-router )
	store: new KnexSessionStore( {
		knex: dbConfig,  //configured instance of knex
		createtable: true // if session doesn't exist, create it automatically
	} )
} ) )

server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
	})
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
