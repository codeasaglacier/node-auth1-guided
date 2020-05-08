const express = require("express")
const Users = require("./users-model")
//15) destructure restrict to include sessions
//const restrict = require( "../middleware/restrict" )
const { restrict } = require( "../middleware/restrict" )

const router = express.Router()

router.get("/", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router