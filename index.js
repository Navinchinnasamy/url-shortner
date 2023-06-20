const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");
const UserData = require("./models/UserData");

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const allData = await ShortUrl.find();
    res.render("index", { shortUrls : allData });
});

app.post("/short", async (req, res) => {
    // Insert the record using model
    if (req.body.fullUrl) {
        const fullUrl = req.body.fullUrl;
        const record = new ShortUrl({
            full: fullUrl
        });
        await record.save();
    }
    res.redirect("/");
});

app.get("/:slug", async (req, res) => {
    console.log("UserInfo > ", req.socket.remoteAddress, req.headers['user-agent']);
    const shortUrl = req.params.slug;
    const record = await ShortUrl.findOne({short: shortUrl});
    if(!record)
        return res.sendStatus(404);

    record.clicks++;
    record.save();
    const userInfo = new UserData({
        info: req.headers,
        userAgent: req.headers['user-agent']
    });
    await userInfo.save();
    res.redirect(record.full);
});

mongoose.connect("mongodb://localhost/urlshort", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("open", () => {
    app.listen(process.env.PUBLIC_PORT, () => {
        console.log(`Server Started @ ${process.env.PUBLIC_PORT}!`);
    });
});