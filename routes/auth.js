const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const fetchUser = require("../Middlewares/fetchuser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "testwebtokenxhexkforauth";

router.post(
    "/createuser",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "The password should be at least 5 characters long").isLength({ min: 5 }),
      body("name", "Name is required").notEmpty()
    ],
    async (req, res) => {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const secPassword = await bcryptjs.hash(req.body.password, salt);
      try {
        let user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPassword,
        });
        const data = {
          user: {
            id: user.id
          }
        };
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({ authToken });
      } catch (error) {
        res.status(500).send({msg:"Internal Server Error Occurred"});
        console.log(error.message);
      }
    }
  );
  

router.post("/login", [body('email', 'Enter a valid email').isEmail(),
body('password', 'The password cannot be blank').exists()],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }); 
            if (!user) { 
                res.status(400).json({ success, error: "Please login with the correct credentials" });
            }

            else {

                const passwordCompare = await bcryptjs.compare(password, user.password); 
                if (!passwordCompare) { 
                    res.status(400).json({ success, error: "Please login with the correct credentials" });
                }
                else {
                    const data = {
                        user: {
                            id: user.id
                        }
                    }
                    success = true;
                    const authToken = jwt.sign(data, JWT_SECRET);
                    res.send({ authToken });
                }
            }
        } catch (error) {
            res.status(500).send("Internal Server Error Occured");
            console.log(error.message);
        }
    });

//Route 3: Get user details by Authenication Token using post request : /api/auth/getuser endpoint : Login required
router.post("/getuser", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        res.status(500).send("Internal Server Error Occured");
        console.log(error.message);
    }
})


module.exports = router;