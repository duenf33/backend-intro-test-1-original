const bcrypt = require("bcryptjs");
const User = require("../model/User");
var axios = require("axios");

module.exports = {
	//v3 promises
	// signup: (body) => {
	//     return new Promise((resolve, reject) => {
	//     bcrypt
	//         .genSalt(10)
	//         .then((salt) => {
	//         bcrypt
	//             .hash(body.password, salt)
	//             .then((hashedPassword) => {
	//             const createdUser = new User({
	//                 firstName: body.firstName,
	//                 lastName: body.lastName,
	//                 email: body.email,
	//                 password: hashedPassword,
	//             });
	//             createdUser
	//                 .save()
	//                 .then((savedUser) => {
	//                 resolve(savedUser);
	//                 })
	//                 .catch((error) => {
	//                 reject(error);
	//                 });
	//             })
	//             .catch((error) => {
	//             reject(error);
	//             });
	//         })
	//         .catch((error) => {
	//         reject(error);
	//         });
	//     });
	// },

	// v2
	// signup: (body, callback) => {
	//     bcrypt.genSalt(10, function(err, salt) {
	//         if(err) {
	//             return callback(err, nul);
	//         } else {
	//             bcrypt.hash(body.password, salt, function (err, hash) {
	//                 if (err) {
	//                     return callback(err, null);
	//                 } else {
	//                     const createdUser = new User({
	//                         firstName: body.firstName,
	//                         lastName: body.lastName,
	//                         email: body.email,
	//                         password: hash,
	//                     });

	//                     createdUser.save(function (err, userCreatedInfo) {
	//                         if (err) {
	//                             return callback(err, null);
	//                         } else {
	//                             return callback(null, userCreatedInfo)
	//                         }
	//                     });
	//                 }
	//             })
	//         }
	//     })
	// }

	// v4 async and await
	getAllUsers: async (req, res) => {
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
	sendToSignup: async (req, res) => {
		if (req.session.user) {
			res.redirect("/users/home");
		} else {
			res.render("sign-up", { error: true });
		}

		// res.render("sign-up", { error: null, success: null });
	},
	sendToLogin: async (req, res) => {
		if (req.session.user) {
			res.redirect("/users/home");
		} else {
			res.render("login", { error: true });
		}
	},
	getHome: async (req, res) => {
		// try {

		//   let result = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.WEATHER_API_KEY}&q=hamster`);

		//   res.json(result.data);
		// } catch (e) {
		//   res.status(500).json({
		//     message: "failure",
		//     data: e.message,
		//   })
		// }

		if (req.session.user) {
			res.render("home", { user: req.session.user.email });
		} else {
			res.render("message", { error: true });
		}
	},
	postHome: async (req, res) => {
		if (req.session) {
			try {
				let result = await axios.get(
					// `https://api.openweathermap.org/data/2.5/weather?q=${req.body.search}&units=imperial&appid=${process.env.WEATHER_API_KEY}`
						
					`https://api.openweathermap.org/data/2.5/find?q=${req.body.search}&units=imperial&appid=${process.env.WEATHER_API_KEY}`

					// `https://api.giphy.com/v1/gifs/search?api_key=${process.env.WEATHER_API_KEY}&q=${req.body.search}`
				);

				res.render("home", { data: result.data, user: req.session.user.email });
				console.log(result.data)
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
			// console.log(hashedPassword)
			const createdUser = new User({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				password: hashedPassword,
			});
			// if(req.body.firstName === "" || req.body.lastName === ""){

			//     if(password.length < 8){
			//     res.status(404).json({
			//     message: "Password must be 8 or more characters long.",
			//     });
			// }
			// else {

			let savedUser = await createdUser.save();

			res.render("sign-up", {
				success: true,
			});

			// res.status(200).json({
			//     message: "success",
			//     user: savedUser,
			// });
			// }
		} catch (error) {
			res.status(500).json({
				message: "error",
				errorMessage: error.message,
			});
		}
	},
	deleteUserByID: async (req, res) => {
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
	deleteUserByEmail: async (req, res) => {
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
	updateUserByID: async (req, res) => {
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
	updateUserByEmail: async (req, res) => {
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
		// let renderEmail = User.findOne({email: req.body.email})

		try {
			let logon = await User.findOne({ email: req.body.email }); // logon variable used to render the email from the data base.

			if (!logon) {
				res.render("login", {
					// this will redirect to the login.ejs page and display error message.
					error: {
						message: "Sorry, user does not exists please go signup!",
					},
				});

				// res.status(404).json({
				//     message: "failure",
				// });
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
					// res.render("home", { user: logon.email }); // this will render the home.ejs page and get the email from the logon variable

					// res.json({
					//     message: "success",
					//     successMessage: "Logged In!"
					// });
				} else {
					res.render("login", {
						// this will render the login.ejs page and will display this message if there is a problem with either the password or email.
						error: {
							message: "Sorry, please check your email and password",
						},
					});

					// res.status(500).json({
					//     message: "failure",
					//     successMessage: "please check email and password",
					// })
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
		req.session.destroy(); // destroy in the server side

		res.clearCookie("connect.sid", {
			// destroy in the data base
			path: "/",
			httpOnly: true,
			secure: false,
			maxAge: null,
		});

		return res.redirect("/users/login");
	},
};
