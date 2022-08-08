const mongoose = require('mongoose');
  
// Journey Modal Schema
const journeysSchema = new mongoose.Schema({
    Departure: Date,
    Return: Date,
    Departure_station_id: Number,
    Departure_station_name: String,
    Return_station_id: Number,
    Return_station_name: String,
    Covered_distance: Number,
    Duration: Number
});
  
// Stations Modal Schema
const stationsSchema = new mongoose.Schema({
    FID: Number,
    ID: Number,
    Nimi: String,
    Osoite: String,
    Kaupunki: String,
    Operaattori: String,
    Kapasiteetti: Number,
    x: Number,
    y: Number,
    Starting_station_count: Number,
    Ending_station_count: Number
});
  
// Create model objects
const Journey = mongoose.model('journey', journeysSchema);
const Station = mongoose.model('station', stationsSchema);
  
// Export model objects
module.exports = {
    Journey, Station
}