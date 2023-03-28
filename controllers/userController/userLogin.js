const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../models");
const currentUser = require("../fetchData/currentUser");
require("dotenv").config();
const SECRET = process.env.SECRET_KEY;

exports.postLogin = async (req, res) => {
    try {
        const abc = req.body;
        const response = {
            email: req.body.email,
            password: req.body.password,
        };
        const userId = await currentUser(response.email);
        const user = await db.sequelize.query(
            "EXEC dbo.spusers_getuser :userId",
            {
                replacements: { userId: userId },
            }
        );
        if (user[1] !== 0) {
            const userCheck = await bcrypt.compare(
                response.password,
                user[0][0].password
            );
            if (userCheck) {
                const userEmail = user[0][0].email;
                jwt.sign({ userEmail }, SECRET, (error, token) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.cookie("userToken", token, {
                            sameSite: "none",
                            secure: true,
                            expires: false,
                            maxAge: 1000 * 60 * 60 * 24 * 30,
                        });
                        res.status(200).json({ data: user[0][0] });
                    }
                });
            } else {
                res.json({ message: "Invalid Password" });
            }
        } else {
            res.status(403).json({
                message: "User doesn't exist",
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "No data available" });
    }
};

exports.getLogout = (req, res) => {
    res.clearCookie("userToken");
    res.json({ message: "Logged Out Successfully" });
};
