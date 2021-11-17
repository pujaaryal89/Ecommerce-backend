const mongoose = require("mongoose");

const geoLocationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            index: true,
        },
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
    },
    { timestamps: true }
);

geoLocationSchema.index({
    name: "text",
});

const GeoLocation = mongoose.model("geoLocation", geoLocationSchema);
GeoLocation.createIndexes();

module.exports = GeoLocation;
