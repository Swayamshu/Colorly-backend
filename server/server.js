// import modules
const express = require("express");
const { json, urlencoded } = express;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { PaletteRoutes, UserRoutes } = require("./routes");

const app = express();

app.use(json());
app.use(urlencoded({ extended: false })); // can access params in req variable
app.use(cors());

// routes
app.use("/palette", PaletteRoutes);
app.use("/auth", UserRoutes);

const port = process.env.PORT || 8000;

// db
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB CONNECTED");
		app.listen(port, () => {
			console.log(`Server is running on port: ${port}`);
		});
	})
	.catch((err) => console.log("DB CONNECTION ERROR", err));