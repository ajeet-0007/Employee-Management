// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
// 	destination: (req, file, callback) => {
// 		callback(
// 			null,
// 			path.join(
// 				__dirname,
// 				'..','..',
// 				'Cloud-Storage',
// 				'public',
// 				'images',
// 			),
// 		);
// 	},
// 	filename: (req, file, callback) => {
// 		callback(null, Date.now() + '_' + file.originalname);
// 	},
// });
// const upload = multer({ storage: storage });

// module.exports = upload;
