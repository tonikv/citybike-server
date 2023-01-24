const { Station } = require('../models.js');

// Fetch all stations from database. Sorted by station name.
const fetchStations = async () => {
    return await Station.find({}).sort("Nimi");
}

// Fetch station by FID
const fetchStation = async (fid) => {
    return await Station.findOne({ "FID": fid });
}

// Fetch station by name
const fetchStationByName = async (name) => {
    return await Station.findOne({ Nimi: name });
}

// Create new station
const createStation = async (newStation) => {
    const station = new Station(newStation);
    return await station.save();
}

// Update station
const updateStation = async (fid, updatedStation) => {
   return await Station.findOneAndUpdate({ "FID": fid }, updatedStation, { new: true });
}

// Delete station
const deleteStation = async (fid) => {
    return await Station.findOneAndDelete({ "FID": fid });
}

// Get average distance traveled to station
const getAverageDistanceToStation = async (name) => {
    const pipeline = [
        {
            $match: {
                Return_station_name: name
            }
        },
        {
            $group: {
                _id: null,
                averageDistance: { $avg: "$Covered_distance" }
            }
        }
    ];

    const getData = await Journey.aggregate(pipeline);
    if (getData.length === 0) {
        return 0;
    }
    return getData[0].averageDistance;
}

// Get average distance traveled from station
const getAverageDistanceFromStation = async (stationName) => {
    const pipeline = [
        {
            $match: {
                Departure_station_name: stationName
            }
        },
        {
            $group: {
                _id: null,
                averageDistance: { $avg: "$Covered_distance" }
                }
        }
    ];

    const getData = await Journey.aggregate(pipeline);
    if (getData.length === 0) {
        return 0;
    }
    return getData[0].averageDistance;
}

// Add additional information to stations
const setStationUsageInformation = async () => {
    const stations = await Station.find({});
    let count = 0;

    for (let station of stations) {
        const startJourneys = await Journey.find({ Departure_station_name: station.Nimi }).countDocuments();
        const endJourneys = await Journey.find({ Return_station_name: station.Nimi }).countDocuments();
        const averageDistanceStarting = await getAverageDistanceFromStation(station.Nimi);
        const averageDistanceEnding = await getAverageDistanceToStation(station.Nimi);

        station.Starting_station_count = startJourneys;
        station.Ending_station_count = endJourneys;
        station.Average_journey_distance_starting = averageDistanceStarting;
        station.Average_journey_distance_ending = averageDistanceEnding;
        const doc = await station.save();
        console.log(`Files saved ${count++}`)
    }
}

module.exports = {
  fetchStations,
  fetchStation,
  fetchStationByName,
};
