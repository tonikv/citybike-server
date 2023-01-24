// Create functions to load CSV data and process it to Mongo Atlas database
const fs = require('fs');
const papa = require('papaparse');
const { Journey } = require('./models');
const { Station } = require('./models');

// const fileJorneys = fs.createReadStream('./2021-06.csv');
// const fileStations = fs.createReadStream('./stations.csv');


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

            const error = station.validateSync();

            if (error) {
                console.error(error);
            } else {
                station.save();
                console.log(`saved files ${count++}`);
            }

        },
        complete: function (result, file) {
            console.log('parsing complete', count);
        }
    })
};


// Read CSV file and store documents to database. Don't record Journeys lasting under 10 seconds and distance less than 10 meters.
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

            // Don't record journeys lasting under 10 seconds and distance less than 10 meters.
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

                const error = journey.validateSync();

                if (error) {
                    console.error(error);
                } else {
                    journey.save();
                    console.log(`saved files ${count++}`);
                }
            }
        },
        complete: function (result, file) {
            console.log('parsing complete', count);
        }
    })
};

module.exports = {
    parseFilesStation,
    parseFilesJourney,
}
