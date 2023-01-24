const mongoose = require('mongoose');

// Journey Modal Schema
const journeysSchema = new mongoose.Schema({
    Departure: { type:Date, required: true },
    Return: { type:Date, required: true },
    Departure_station_id: { type: Number, required: true },
    Departure_station_name: { type: String, required: true },
    Return_station_id: { type: Number, required: true },
    Return_station_name: { type: String, required: true },
    Covered_distance: { type: Number, required: true },
    Duration: { type: Number, required: true },
});

// Stations Modal Schema
const stationsSchema = new mongoose.Schema({
    FID: { type: Number, required: true, unique: true},
    ID: { type: Number, required: true, unique: true},
    Nimi: { type: String, required: true},
    Osoite: { type: String, required: true},
    Kaupunki: { type: String, required: true},
    Operaattori: { type: String, required: true },
    Kapasiteetti: { type: Number, required: true },
    x: { type:Number, required: true },
    y: { type:Number, required: true },
    Starting_station_count: Number,
    Ending_station_count: Number,
    Average_journey_distance_starting: Number,
    Average_journey_distance_ending: Number,
});

// Create model objects
const Journey = mongoose.model('journey', journeysSchema);
const Station = mongoose.model('station', stationsSchema);

// Export model objects
module.exports = {
    Journey, Station
}
