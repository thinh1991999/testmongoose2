const express = require("express");
const User = require("../models/User");
const { auth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    User.findOne({ email })
      .exec()
      .then((user) => {
        if (user === null) {
          const newUser = new User({ email, firstName, lastName, password });
          newUser
            .save()
            .then(() => {
              return res.status(200).send({
                message: "Đăng ký thành công",
              });
            })
            .catch((err) => {
              return res.status(400).send(err);
            });
        } else {
          return res.status(400).send({
            error: "Email này đã được đăng ký!",
          });
        }
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
    // User.findOne({ email }).exec((err, user) => {
    //   if (user) {
    //     return res.status(400).send({
    //       error: "Email này đã được đăng ký!",
    //     });
    //   } else {
    //     const newUser = new User({ email, firstName, lastName, password });
    //     newUser.save((err, success) => {
    //       if (err) {
    //         return res.status(400).send({
    //           error: "Có lỗi xảy ra, vui lòng thử lại!",
    //         });
    //       } else {
    //         return res.status(200).send({
    //           mess: "Đăng ký thành công!",
    //         });
    //       }
    //     });
    //   }
    // });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

// Login
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Detail user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// Logout
router.post("/users/me/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update
router.post("/users/me/update", auth, async (req, res) => {
  try {
    const {
      phoneNumber,
      firstName,
      lastName,
      bio,
      gender,
      dateOfBirth,
      address,
    } = req.body;

    User.findOneAndUpdate(
      { email: req.email },
      { phoneNumber, firstName, lastName, bio, gender, dateOfBirth, address },
      { runValidators: true }
    )
      .then((user) => {
        if (user) {
          return res.status(200).send({ mess: "Cap nhat thanh cong" });
        } else {
          return res
            .status(500)
            .send({ error: "Có lỗi xảy ra, vui lòng thử lại" });
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
});

// router.post("/usersTest", async (req, res) => {
//   // Create a new user
//   try {
//     const { email, name, password } = req.body;
//     User.findOne({ email }).exec((err, user) => {
//       if (user) {
//         res.status(400).send({
//           error: "Email này đã được đăng ký!",
//         });
//         return;
//       }
//       const newUser = new User({ email, name, password });
//       newUser.save((err, success) => {
//         if (err) {
//           res.status(400).send({
//             error: "Có lỗi xảy ra, vui lòng thử lại!",
//           });
//           return;
//         } else {
//           res.status(200).send({
//             mess: "Đăng ký thành công!",
//           });
//         }
//       });
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// router.post("/email-activate", async (req, res) => {
//   // activate email
//   try {
//     const { token } = req.body;
//     if (token) {
//       jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
//         if (err) {
//           res.status(400).send({
//             error: "Đường dẫn không đúng hoặc đã hết hạn!",
//           });
//           return;
//         }
//         const { email, name, password } = decodedToken;
//         User.findOne({ email }).exec((err, user) => {
//           if (user) {
//             res.status(400).send({
//               error: "Email này đã được đăng ký!",
//             });
//             return;
//           }
//           const newUser = new User({ email, name, password });
//           newUser.save((err, success) => {
//             if (err) {
//               res.status(400).send({
//                 error: "Có lỗi xảy ra, vui lòng thử lại!",
//               });
//               return;
//             } else {
//               res.status(200).send({
//                 mess: "Đăng ký thành công!",
//               });
//             }
//           });
//         });
//       });
//     } else {
//       res.status(400).send({
//         error: "Co",
//       });
//     }
//     // await user.save();
//     // const token = await user.generateAuthToken();
//     // res.status(201).send({ user, token });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// router.post("/users/login", async (req, res) => {
//   //Login a registered user
//   try {
//     const { email, password } = req.body;
//     const user = await User.findByCredentials(email, password);
//     if (!user) {
//       return res
//         .status(401)
//         .send({ error: "Login failed! Check authentication credentials" });
//     }
//     const token = await user.generateAuthToken();
//     return res.send({ user, token });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send(error);
//   }
// });

// router.get("/users/me", auth, async (req, res) => {
//   // View logged in user profile
//   res.send(req.user);
// });

// router.post("/users/me/update/profile", auth, async (req, res) => {
//   // Log user out of the application
//   try {
//     const { phone, name, gender } = req.body;
//     User.findOneAndUpdate(
//       { email: req.email },
//       { phone, name, gender },
//       { runValidators: true },
//       (err, user) => {
//         if (err) {
//           return res
//             .status(500)
//             .send({ error: "Có lỗi xảy ra, vui lòng thử lại" });
//         } else {
//           return res.status(200).send({ mess: "Cap nhat thanh cong" });
//         }
//       }
//     );
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// router.post("/users/forgotPw", async (req, res) => {
//   // Log user out of the application
//   try {
//     const { email } = req.body;
//     User.findOne({ email }, (err, user) => {
//       if (err || !user) {
//         return res.status(400).send({
//           error: "Không tồn tại tài khoản đăng ký với email này",
//         });
//       }
//       const token = jwt.sign(
//         { _id: user._id },
//         process.env.RESET_PASSWORD_KEY,
//         {
//           expiresIn: "20m",
//         }
//       );
//       const data = {
//         from: "noreply@hello.com",
//         to: email,
//         subject: "Account Activation Link",
//         html: `
//         <h2>Please click on given link to reset your password</h2>
//         <a>${process.env.CLIENT_URL}/authen/resetPw/${token}</a>
//         `,
//       };
//       User.updateOne({ resetPwLink: token }, (err, success) => {
//         if (err) {
//           return res.status(400).send({
//             error: "Link cập nhật mật khẩu xảy ra lỗi",
//           });
//         } else {
//           mg.messages().send(data, function (error, body) {
//             if (error) {
//               return res.status(400).send(error);
//             } else {
//               return res.status(200).send({
//                 mess: "Vui lòng vào gmail xác nhận đặt lại mật khẩu",
//               });
//             }
//           });
//         }
//       });
//     });
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// router.post("/users/reset-pw", async (req, res) => {
//   // Log user out of the application
//   try {
//     const { resetLink, newPw } = req.body;
//     if (resetLink) {
//       if (newPw && newPw.trim().length >= 7) {
//         jwt.verify(
//           resetLink,
//           process.env.RESET_PASSWORD_KEY,
//           async (err, result) => {
//             if (err) {
//               return res.status(400).send({
//                 error: "Link đã hết hạn hoặc không tồn tại",
//               });
//             } else {
//               const { _id } = result;
//               const obj = {
//                 password: await bcrypt.hash(newPw, 8),
//                 resetPwLink: "",
//               };
//               User.findOneAndUpdate(
//                 { resetPwLink: resetLink },
//                 obj,
//                 { runValidators: true },
//                 (err, user) => {
//                   if (err || !user) {
//                     return res.status(400).send({
//                       error: "Link đã hết hạn hoặc không tồn tại",
//                     });
//                   } else {
//                     return res.status(200).send({
//                       mess: "Đặt lại mật khẩu thành công",
//                     });
//                   }
//                 }
//               );
//             }
//           }
//         );
//       } else {
//         return res.status(400).send({
//           error: "Mật khẩu không đủ điều kiện, vui lòng tạo lại",
//         });
//       }
//     } else {
//       return res.status(400).send({
//         error: "Có lỗi xảy ra, vui lòng thử lại",
//       });
//     }
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

module.exports = router;
