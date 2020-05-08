const db = require("../database/config")
//1) import bcrypt
const bcrypt = require( "bcryptjs" )


async function add(user) {
	//2)add hashing to password with time complexity
	//find a time complexity of 1-2 seconds
	user.password = await bcrypt.hash( user.password, 16 )
	const [id] = await db("users").insert(user)
	return findById(id)
}

function find() {
	return db("users").select("id", "username")
}

function findBy(filter) {
	return db("users")
		.select("id", "username", "password")
		.where(filter)
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

module.exports = {
	add,
	find,
	findBy,
	findById,
}
