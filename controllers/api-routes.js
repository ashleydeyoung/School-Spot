/* eslint-disable camelcase */
// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
	// Using the passport.authenticate middleware with our local strategy.
	// If the user has valid login credentials, send them to the members page.
	// Otherwise the user will be sent an error
	app.post("/api/login", passport.authenticate("local"), function(req, res) {
		res.json(req.user);
	});

	// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
	// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
	// otherwise send back an error
	app.post("/api/signup", function(req, res) {
		db.User.create({
			// eslint-disable-next-line camelcase
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: req.body.password,
			user_type: req.body.user_type
		})
			.then(function() {
				res.redirect(307, "/api/login");
			})
			.catch(function(err) {
				res.status(401).json(err);
			});
	});

	// Route for logging user out
	app.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});

	// Route for getting some data about our user to be used client side
	app.get("/api/user_data", function(req, res) {
		if (!req.user) {
			// The user is not logged in, send back an empty object
			res.json({});
		} else {
			// Otherwise send back the user's email and id
			// Sending back a password, even a hashed password, isn't a good idea
			res.json({
				email: req.user.email,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				id: req.user.id,
				user_type: req.body.user_type
			});
		}
	});

	// Route for getting a list of teachers
	app.get("/api/teachers", function(req, res) {
		User.findAll({
			attributes: ["id", ["firstName", "First Name"], ["lastName", "Last Name"]],
			where: {
				user_type: "Teacher"
			}
		}).then(function(dbTeachers) {
			res.json(dbTeachers);
		});
	});

	// Route for getting a list of students
	app.get("/api/students", function(req, res) {
		User.findAll({
			attributes: ["id", ["firstName", "First Name"], ["lastName", "Last Name"]],
			where: {
				user_type: "Student"
			}
		}).then(function(dbStudents) {
			res.json(dbStudents);
		});
	});
};