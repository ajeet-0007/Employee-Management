const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname, '..', 'controllers', 'adminController', 'uploads'));
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + '_' + file.originalname);
	}
});
const upload = multer({ storage: storage });

module.exports = upload;
