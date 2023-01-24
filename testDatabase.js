const mongoose = require('mongoose');
const { Station, Journey } = require('./models.js');

// Connect to MongoDB
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectTestDatabase = async () => {
    try {
        mongoose.connect("mongodb://localhost:27017/bikedata", options);
    } catch (error) {
        console.error(error);
    }
};


const insertTestData = async () => {
    const date = new Date();
    // Create new stations
    const newstationA = new Station({
        FID: 1,
        ID: 1,
        Nimi: "A Station",
        Osoite: "A Address",
        Kaupunki: "A City",
        Operaattori: "A Operator",
        Kapasiteetti: 10,
        x: 10,
        y: 10,
        Starting_station_count: 10,
        Ending_station_count: 10,
        Average_journey_distance_starting: 10,
        Average_journey_distance_ending: 10,
    });

    const newstationB = new Station({
        FID: 2,
        ID: 2,
        Nimi: "B Station",
        Osoite: "B Address",
        Kaupunki: "B City",
        Operaattori: "B Operator",
        Kapasiteetti: 10,
        x: 10,
        y: 10,
        Starting_station_count: 10,
        Ending_station_count: 10,
        Average_journey_distance_starting: 10,
        Average_journey_distance_ending: 10,
    });

    const newstationC = new Station({
        FID: 3,
        ID: 3,
        Nimi: "C Station",
        Osoite: "C Address",
        Kaupunki: "C City",
        Operaattori: "C Operator",
        Kapasiteetti: 10,
        x: 10,
        y: 10,
        Starting_station_count: 10,
        Ending_station_count: 10,
        Average_journey_distance_starting: 10,
        Average_journey_distance_ending: 10,
    });

    // Create new journeys
    const newjourneyOne = new Journey({
        Departure_station_name: 'A Station',
        Return_station_name: 'B Station',
        Departure_station_id: 1,
        Return_station_id: 2,
        Departure: date,
        Return: date,
        Covered_distance: 100,
        Duration: 100,
    });

    const newjourneyTwo = new Journey({
        Departure_station_name: 'B Station',
        Return_station_name: 'A Station',
        Departure_station_id: 2,
        Return_station_id: 1,
        Departure: date,
        Return: date,
        Covered_distance: 200,
        Duration: 200,
    });

    const newjourneyThree = new Journey({
        Departure_station_name: 'A Station',
        Return_station_name: 'B Station',
        Departure_station_id: 1,
        Return_station_id: 2,
        Departure: date,
        Return: date,
        Covered_distance: 300,
        Duration: 300,
    });

    const newjourneyFour = new Journey({
        Departure_station_name: 'C Station',
        Return_station_name: 'A Station',
        Departure_station_id: 3,
        Return_station_id: 1,
        Departure: date,
        Return: date,
        Covered_distance: 400,
        Duration: 400,
    });


    try {
        await newstationA.save();
        await newstationB.save();
        await newstationC.save();
        await newjourneyOne.save();
        await newjourneyTwo.save();
        await newjourneyThree.save();
        await newjourneyFour.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    connectTestDatabase,
    insertTestData,
};
