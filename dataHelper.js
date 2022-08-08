// Create functions to load CSV data and process it to Mongo Atlas database
// Also create helper functions to extract additional information from data
const fs = require('fs');
const papa = require('papaparse');
const { Journey } = require('./models');
const { Station } = require('./models');

// Check stations usage amount and store information to database
const setStationUsageInformation = async () => {
    const stations = await Station.find({});
    let count = 0;

    for (let station of stations) {
        const startJourneys = await Journey.find({ Departure_station_name: station.Nimi }).countDocuments();
        const endJourneys = await Journey.find({ Return_station_name: station.Nimi }).countDocuments();

        station.Starting_station_count = startJourneys;
        station.Ending_station_count = endJourneys;
        const doc = await station.save();
        console.log(`Files saved ${count++}`)
    }
}

// Check stations usage amount. Used in Journey route to pass information to client. 
const getStationUsageInformation = async (start_name, end_name) => {
    const startJourneys = await Journey.find({ Departure_station_name: start_name }).countDocuments();
    const endJourneys = await Journey.find({ Return_station_name: end_name }).countDocuments();
    return ({ start: startJourneys, end: endJourneys });
}

// const fileStations = fs.createReadStream('./stations.csv');
// const fileJorneys = fs.createReadStream('./2021-06.csv');
// Read CSV file and store documents to database
const parseFilesStation = (file) => {
    let count = 0;
    papa.parse(file, {
        skipEmptyLines: true,
        transformHeader: h => h.trim(),
        header: true,
        delimiter: ",",
        step: function (result) {
            let station = new Station({
                FID: result.data.FID,
                ID: result.data.ID,
                Nimi: result.data.Nimi,
                Osoite: result.data.Osoite,
                Kaupunki: result.data.Kaupunki,
                Operaattori: result.data.Operaattor,
                Kapasiteetti: result.data.Kapasiteet,
                x: result.data.x,
                y: result.data.y,
            })

            station.save(function (err) {
                if (err) console.error(err);
                console.log(`saved files ${count++}`);
            })
        },
        complete: function (result, file) {
            console.log('parsing complete', count);
        }
    })
};

// Read CSV file and store documents to database. Don't record Journeys lastig under 10 seconds and distance less than 10 meters.
const parseFilesJourney = (file) => {
    let count = 0;
    papa.parse(file, {
        skipEmptyLines: true,
        transformHeader: h => h.trim(),
        header: true,
        delimiter: ",",
        step: function (result) {
            let time = Number(result.data["Duration (sec.)"]);
            let distance = Number(result.data['Covered distance (m)']);

            if (time > 10 && distance > 10) {
                let journey = new Journey({
                    Departure: result.data.Departure,
                    Return: result.data.Return,
                    Departure_station_id: result.data["Departure station id"],
                    Departure_station_name: result.data["Departure station name"],
                    Return_station_id: result.data["Return station id"],
                    Return_station_name: result.data["Return station name"],
                    Covered_distance: result.data['Covered distance (m)'],
                    Duration: result.data["Duration (sec.)"],
                })

                journey.save(function (err) {
                    if (err) console.error(err);
                    console.log(`saved files ${count++}`);
                })
            }
        },
        complete: function (result, file) {
            console.log('parsing complete', count);
        }
    })
};

module.exports = {
    getStationUsageInformation: getStationUsageInformation
}