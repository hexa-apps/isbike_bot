const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    userLocation: {
        type: String,
        required: true
    },
    stationId: {
        type: String,
        required: true
    },
    time : {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Location', LocationSchema);