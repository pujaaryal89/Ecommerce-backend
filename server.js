const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABASE;
mongoose.connect(db, {}).then(() => {
    console.log("Database is connected");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
