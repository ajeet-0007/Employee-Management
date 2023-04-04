const db = require("../../models");
const multer = require("multer");
const csv = require("fast-csv");
const fs = require("fs")
const { QueryTypes } = require("sequelize");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + "/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const postUploadUserDetails = (req, res) => {
  try {
    uploadCSVFile(__dirname + "/uploads/" + req.file.filename);
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "File upload failed" });
  }
};

const uploadCSVFile = (file) => {
  let stream = fs.createReadStream(file);
  let csvData = [];
  let fileStream = csv
    .parse()
    .on("data", (data) => {
      csvData.push(data);
    })
    .on("end", async () => {
      csvData.shift();
      await db.sequelize.query("INSERT INTO users (hrmid, name, email, phone, role, reportingManager, location, joiningDate ) VALUES ?", {
        replacements: [csvData],
        type: QueryTypes.INSERT,
      });
      fs.unlinkSync(file);
    });
  stream.pipe(fileStream);
};

module.exports = { postUploadUserDetails, upload };
