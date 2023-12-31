// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const loDash = require("lodash"); //this lodash can be use as (_) or underscore.
const mongoose = require("mongoose");

const homeStartingContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
	"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
	"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/blogSite");

// For dynamic route Schema
const postSchema = new mongoose.Schema({
	postTitleName: String,
	postBodyPara: String,
});

// For dynamic route Model; userposts is the table or collection name.
const PostModel = mongoose.model("userPost", postSchema);

// this route is for home route
app.get("/", function (req, res) {
	const findIntoDB = async () => {
		const foundData = await PostModel.find();
		res.render("home", {
			homePara: homeStartingContent,
			formDatas: foundData,
		});
	};

	findIntoDB();
});

//this is about route
app.get("/about", function (req, res) {
	res.render("about", { aboutPara: aboutContent });
});

// this is contact route
app.get("/contact", function (req, res) {
	res.render("contact", { contactPara: contactContent });
});

// this is compose route
app.get("/compose", function (req, res) {
	res.render("compose");
});

app.post("/compose", function (req, res) {
	const title = req.body.postTitle;
	const body = req.body.postBody;

	const InsertOne = async () => {
		const post = new PostModel({
			postTitleName: title,
			postBodyPara: body,
		});

		await post.save();
		res.redirect("/");
	};
	InsertOne();
});

// this is for inside routing parameter
// Dynamic Express routing parameter
app.get("/posts/:postId", function (req, res) {
	const idFromEjs = req.params.postId;

	const findTitle = async () => {
		const foundId = await PostModel.findOne({ _id: idFromEjs });

		res.render("posts", {
			head: foundId.postTitleName,
			body: foundId.postBodyPara,
		});
	};
	findTitle();
});

app.listen(5050, function () {
	console.log("Server started on port 5050");
});
