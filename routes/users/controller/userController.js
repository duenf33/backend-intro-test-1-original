const bcrypt = require("bcryptjs");
const User = require("../model/User");
var axios = require("axios");
module.exports = {
	displayUsers: async (req, res) => {
		try {
			const foundAllUsers = await User.find({});
			res.status(200).json({
				message: "success",
				users: foundAllUsers,
			});
		} catch (error) {
			res.status(500).json({
				message: "failure",
				errorMessage: error.message,
			});
		}
	},
	displaySignup: async (req, res) => {
		if (req.session.user) {
			res.redirect("/users/home");
		} else {
			res.render("sign-up", { error: true });
		}
	},
	displayLogin: async (req, res) => {
		if (req.session.user) {
			res.redirect("/users/home");
		} else {
			res.render("login", { error: true });
		}
	},
	reqHome: async (req, res) => {
		if (req.session.user) {
			res.render("home", { user: req.session.user.email });
		} else {
			res.render("message", { error: true });
		}
	},
	resHome: async (req, res) => {
		if (req.session) {
			try {
				let result = await axios.get(
					`https://api.openweathermap.org/data/2.5/find?q=${req.body.search}&units=imperial&appid=${process.env.WEATHER_API_KEY}`
				);
				res.render("home", { data: result.data, user: req.session.user.email });
			} catch (e) {
				res.status(500).json({
					message: "failure",
					data: e.message,
				});
			}
		} else {
			res.render("message", { error: true });
		}
	},
	signup: async (req, res) => {
		const { firstName, lastName, email, password } = req.body;
		try {
			const salted = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salted);
			const createdUser = new User({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				password: hashedPassword,
			});
			res.render("sign-up", {
				success: true,
			});
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	userDelByID: async (req, res) => {
		try {
			let deletedUser = await User.findByIdAndDelete({ _id: req.params.id });
			res.status(200).json({
				message: "successfully deleted",
				user: deletedUser,
			});
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	userDelByEmail: async (req, res) => {
		console.log(req.body);
		try {
			let deletedUser = await User.findOneAndDelete({ email: req.body.email });
			res.status(200).json({
				message: "successfully deleted",
				deletedUser: deletedUser,
			});
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	userByIDUpdate: async (req, res) => {
		try {
			let updatedUser = await User.findByIdAndUpdate(
				{ _id: req.params.id },
				{ firstName: req.body.firstName },
				{ new: true }
			);

			res.status(200).json({
				message: "successfully updated",
				updatedUser: updatedUser,
			});
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	userByEmailUpdate: async (req, res) => {
		try {
			let updatedEmail = await User.findOneAndUpdate(
				{ email: req.body.targetEmail },
				req.body,
				{ new: true }
			);

			res.status(200).json({
				message: "successfully updated",
				updatedEmail: updatedEmail,
			});
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	login: async (req, res) => {
		try {
			let logon = await User.findOne({ email: req.body.email });
			if (!logon) {
				res.render("login", {
					error: {
						message: "Sorry, user does not exists please go signup!",
					},
				});
			} else {
				let isPasswordTrue = await bcrypt.compare(
					req.body.password,
					logon.password
				);
				if (isPasswordTrue) {
					req.session.user = {
						_id: logon._id,
						email: logon.email,
					};
					res.redirect("/users/home");
				} else {
					res.render("login", {
						error: {
							message: "Sorry, please check your email and password",
						},
					});
				}
			}
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	logout: async (req, res) => {
		req.session.destroy();
		res.clearCookie("connect.sid", {
			path: "/",
			httpOnly: true,
			secure: false,
			maxAge: null,
		});
		return res.redirect("/users/login");
	},
};