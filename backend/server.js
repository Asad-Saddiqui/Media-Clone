const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
// const connectDB = require("./db/connectDB");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const NotificatioModel = require("./models/NotificationModel.js");
// const job = require("./cron/cron");
const app = express();
var http = require('http').Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

dotenv.config();
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			// To avoid warnings in the console
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};
connectDB();
// job.start();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors());

const folderPath = './uploads/';

// Configure Express to serve static files from the uploads folder
app.use(express.static(folderPath));
// app.use('/', (req, res) => {
// 	res.send({ res: "asjkdhkas" });
// 	console.log("hekjwe");
// })
// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
const socketIdMap = {};

io.on('connection', (socket) => {
	console.log('connected to user')
	// console.log(socket)
	const data = socket.handshake.headers.authorization;
	const userData = JSON.parse(data);
	// console.log({ userData })
	socketIdMap[userData._id] = socket.id;
	console.log(socketIdMap)
	setTimeout(() => {
		socket.emit("custom", "hello from server");
	}, 3000);
	socket.on('liked', async (payload) => {
		console.log(payload)
		// console.log({ payload })
		const recipientSocketId = socketIdMap[payload.postedID];
		if (recipientSocketId) {
			console.log({ recipientSocketId })
			// Send the notification to the recipient user
			let notification = await NotificatioModel.create({
				sender: payload.uid._id,
				receiver: payload.postedID,
				postid: payload.pid,
				name: payload.uid.username,
				img: payload.uid.profilePic,
				text: payload.message,
				action: payload.action
			})
			notification.save();
			console.log(notification)
			let notifications = await NotificatioModel.find({
				receiver: payload.postedID,
				seen: false
			})
			console.log({ notifications })
			io.to(recipientSocketId).emit('receiveNotification', notifications);

			console.log(`Notification sent from ${payload.uid} to ${payload.postedID}: ${payload.message}`);
		} else {
			console.log(`Recipient user ${payload.recipientId} is not connected.`);

		}
	});

	socket.on('Unliked', async (payload) => {
		console.log({ payload })
		delete_ = await NotificatioModel.deleteOne({
			sender: payload.uid,
			receiver: payload.postedID,
			postid: payload.pid,
		})

		if (delete_) {
			let notifications = await NotificatioModel.find({
				receiver: payload.postedID,
				seen: false
			})
			console.log({ notifications })
			const recipientSocketId = socketIdMap[payload.postedID];
			io.to(recipientSocketId).emit('receiveNotification', notifications);
		}

	});
	socket.on('refreshData', async (payload) => {
		console.log({ mypayload: payload })

		let notifications = await NotificatioModel.find({
			receiver: payload._id,
			seen: false
		})
		console.log({ notifications })
		const recipientSocketId = socketIdMap[payload._id];
		io.to(recipientSocketId).emit('datarefresh', notifications);
	});
	socket.on('updateData', async (payload) => {
		console.log({ mypayload: payload })

		let notifications = await NotificatioModel.updateMany({
			receiver: payload._id,
			seen: false
		}, { $set: { seen: true } }, { new: true })
		console.log({ Ok: notifications })
		const recipientSocketId = socketIdMap[payload._id];
		io.to(recipientSocketId).emit('updatedData', notifications);
	});


})



http.listen(PORT, () => {
	console.log("Connected", PORT)
});

