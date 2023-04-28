/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import papa from "papaparse";
import { Journey, Station } from "./models";

type IStationCSV = {
    FID: number;
    ID: number;
    Nimi: string;
    Osoite: string;
    Kaupunki: string;
    Operaattor: string;
    Kapasiteet: number;
    x: number;
    y: number;
};

type IJourneyCSV = {
    Departure: string;
    Return: string;
    "Departure station id": number;
    "Departure station name": string;
    "Return station id": number;
    "Return station name": string;
    "Covered distance (m)": number;
    "Duration (sec.)": number;
};

interface IStationParseStep {
    data: IStationCSV;
    errors: any;
    meta: any;
}

interface IJourneyParseStep {
    data: IJourneyCSV;
    errors: any;
    meta: any;
}

// Read CSV file and store documents to database
const parseFilesStation = (file: fs.ReadStream) => {
    let count = 0;
    papa.parse(file, {
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
        header: true,
        delimiter: ",",
        step: function (row: IStationParseStep) {
            const station = new Station({
                FID: row.data.FID,
                ID: row.data.ID,
                Nimi: row.data.Nimi,
                Osoite: row.data.Osoite,
                Kaupunki: row.data.Kaupunki,
                Operaattori: row.data.Operaattor,
                Kapasiteetti: row.data.Kapasiteet,
                x: row.data.x,
                y: row.data.y,
            });

            const error = station.validateSync();

            if (error) {
                console.error(error);
            } else {
                station.save();
                console.log(`saved files ${count++}`);
            }
        },
        complete: function () {
            console.log(`parsing complete - file count: ${count}`);
        },
        error: function (error: Error) {
            console.error(`parsing error: ${error}`);
        },
    });
};

// Read CSV file and store documents to database. Don't record Journeys lasting under 10 seconds and distance less than 10 meters.
const parseFilesJourney = (file: fs.ReadStream) => {
    let count = 0;
    papa.parse(file, {
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
        header: true,
        delimiter: ",",
        step: function (row: IJourneyParseStep) {
            const time = Number(row.data["Duration (sec.)"]);
            const distance = Number(row.data["Covered distance (m)"]);

            // Don't record journeys lasting under 10 seconds and distance less than 10 meters.
            if (time > 10 && distance > 10) {
                const journey = new Journey({
                    Departure: row.data.Departure,
                    Return: row.data.Return,
                    Departure_station_id: row.data["Departure station id"],
                    Departure_station_name: row.data["Departure station name"],
                    Return_station_id: row.data["Return station id"],
                    Return_station_name: row.data["Return station name"],
                    Covered_distance: row.data["Covered distance (m)"],
                    Duration: row.data["Duration (sec.)"],
                });

                const error = journey.validateSync();

                if (error) {
                    console.error(error);
                } else {
                    journey.save();
                    console.log(`saved files ${count++}`);
                }
            }
        },
        complete: function () {
            console.log("parsing complete", count);
        },
        error: function (error: Error) {
            console.error(`parsing error: ${error}`);
        },
    });
};

export { parseFilesStation, parseFilesJourney };
