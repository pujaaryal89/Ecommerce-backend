const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: { type: String, enum: ["seller", "user"], required: true },
        confirm_password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.index({
    username: "text",
});

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        const hashedConfirmPassword = await bcrypt.hash(
            this.confirm_password,
            salt
        );
        this.password = hashedPassword;
        this.confirm_password = hashedConfirmPassword;
        next();
    } catch (error) {}
});

const User = mongoose.model("user", userSchema);
module.exports = User;
