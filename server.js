require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookiesSession = require("cookie-session");
const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ exten: true }));

app.use(
    cookiesSession({
        name: "drnhs-session",
        //keys: ["key1", "key2"],
        secret: "COOKIE_SECRET",
        httpOnly: true
    })
);

const db = require("./app/models");
const Role = db.role;
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and Re-sync Database");
    initial();
})


function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "admin"
    });

    Role.create({
        id: 3,
        name: "moderator"
    });
}
//simple route
app.get("/", (req, res, next) => {
    res.json({
        status: 200,
        message: "WELCOME GUYS",
        Data: "JDS TEST"
    })
});

//routes
require("./app/routes/auth.route")(app);
require("./app/routes/user.route")(app);


//set port, listen for request
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});