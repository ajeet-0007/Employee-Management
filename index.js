require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { onConnection } = require('./events');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const userLoginController = require('./controllers/userController/userLogin');
const userController = require('./controllers/userController/user');
const adminLoginController = require('./controllers/adminController/adminLogin');
const adminController = require('./controllers/adminController/admin');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'https://emergent-ventures.vercel.app'], credentials: true }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: ['http://localhost:3000', 'https://emergent-ventures.vercel.app'],
		credentials: true
	},
	cookie: {
		sameSite: 'none',
		secure: true,
		expires: false,
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true
	}
});

io.use((socket, next) => {
	const userToken = socket.request.headers.cookie?.split('; ').find((row) => row.startsWith('userToken='));
	if (!userToken) {
		return next(new Error('Authentication error'));
	}
	return next();
});
io.on('connection', onConnection(io));
const userRoutes = require('./routes/userRoutes')(io);

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/super-admin', superAdminRoutes);
app.post('/', userLoginController.postLogin);
app.put('/signup', userController.putSignUp);
app.post('/admin-login', adminLoginController.postLogin);
app.put('/admin-signup', adminController.putSignUp);

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
