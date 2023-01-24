const mongoose = require('mongoose');
const fs = require('fs');
const { connectTestDatabase } = require('../testDatabase.js');
const { Station, Journey } = require('../models.js');
const { parseFilesStation, parseFilesJourney } = require('../dataParser.js');

const csvStations = fs.createReadStream('./testStations.csv'); // 9 stations
const csvMalformedStations = fs.createReadStream('./testStationsMalformed.csv'); // 9 stations - 2 malformed

const csvJourneys = fs.createReadStream('./testJourneys.csv'); // 9 journeys
const csvMalformedJourneys = fs.createReadStream('./testJourneysMalformed.csv'); // 9 journeys - 2 malformed - 2 under 10 seconds

beforeAll(async () => {
    await connectTestDatabase();
});

beforeEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.connection.close()
});

describe('Parsing functions', () => {
    it('parsings Stations with working csv', async () => {
        jest.spyOn(Station.prototype, 'save').mockImplementation(() => { });
        const parsedStations = parseFilesStation(csvStations);
        const stations = await Station.find();
        expect(Station.prototype.save).toHaveBeenCalledTimes(9);
    });

    it('parsing Stations with malformed csv', async () => {
        jest.spyOn(Station.prototype, 'save').mockImplementation(() => { });
        const parsedStations = parseFilesStation(csvMalformedStations);
        const stations = await Station.find();
        expect(Station.prototype.save).toHaveBeenCalledTimes(7);
    });

    it('parsing Journeys with working csv', async () => {
        jest.spyOn(Journey.prototype, 'save').mockImplementation(() => { });
        const parsedJourneys = parseFilesJourney(csvJourneys);
        const journeys = await Journey.find();
        expect(Journey.prototype.save).toHaveBeenCalledTimes(9);
    });

    it('parsing Journeys with malformed csv', async () => {
        jest.spyOn(Journey.prototype, 'save').mockImplementation(() => { });
        const parsedJourneys = parseFilesJourney(csvMalformedJourneys);
        const journeys = await Journey.find();
        expect(Journey.prototype.save).toHaveBeenCalledTimes(5);
    });

});
