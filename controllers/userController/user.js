const bcrypt = require("bcrypt");
const db = require("../../models");
const currentUser = require("../fetchData/currentUser");
const User = db.user;

exports.postSignUp = async (req, res) => {
    try {
        let response = req.body;
        response.password = await bcrypt.hash(response.password, 10);
        const userId = await currentUser(response.email);
        if (!userId) {
            const data = await db.sequelize.query(
                "EXEC dbo.spusers_postsignup :hrmid, :name, :email, :password, :phone, :image, :role, :reportingManager, :allocation, :joiningDate",
                {
                    replacements: {
                        hrmid: response.hrmid,
                        name: response.name,
                        email: response.email,
                        password: response.password,
                        phone: response.phone,
                        image: response.image,
                        role: response.role,
                        reportingManager: response.reportingManager,
                        allocation: response.allocation,
                        joiningDate: response.joiningDate,
                    },
                }
            );
            return res
                .status(201)
                .json({ message: "User created successfully" });
        } else {
            return res.json({ message: "User already exist" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "No data available",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userEmail = req.user.userEmail;
        const userId = await currentUser(userEmail);
        const data = await db.sequelize.query(
            "EXEC dbo.spusers_getuser :userId",
            {
                replacements: { userId: userId },
            }
        );
        return res.status(200).json(data[0][0]);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "No data available",
        });
    }
};
