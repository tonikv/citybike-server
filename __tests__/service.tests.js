require('dotenv').config();
const { Station, Journey } = require('../models.js');
const { fetchStationByName, fetchStation, fetchStations } = require('../services/stations.js');
const { fetchJourneysByQuery, fetchTopUsedJourneys } = require('../services/journeys.js');
const mongoose = require('mongoose');
const { connectTestDatabase, insertTestData } = require('../testDatabase.js');


beforeAll(async () => {
    await connectTestDatabase();
});

beforeEach(async () => {
    await insertTestData(); // stations length 3, journeys length 5
});

afterEach(async () => {
    await Station.deleteMany();
    await Journey.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close()
});

describe('Stations', () => {
        it('fetchStations should give all data', async () => {
            const response = await fetchStations();
            expect(response).toBeInstanceOf(Array);
            expect(response.length).toBe(3);
        });

        it('fetchStation(fid) should return correct data', async () => {
            const response = await fetchStation(1);
            expect(response).toBeInstanceOf(Object);
            expect(response.FID).toBe(1);
        });

        it('fetchStation(fid) should give null when data cannot be found', async () => {
            const response = await fetchStation(1000);
            expect(response).toBeNull();
        });

        it('fetchStationByName(station name) should give correct data', async () => {
            const response = await fetchStationByName('A Station');
            expect(response).toBeInstanceOf(Object);
            expect(response.Nimi).toBe('A Station');
        });
});


describe('Journeys', () => {
    it('fetchTopUsedJourneys should return three journeys', async () => {
        const response = await fetchTopUsedJourneys();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBe(3);
    });

    it('fetchJourneysByQuery(options) descending order limited to 3 results', async () => {
        const options = {
            page: 0,
            limit: 3,
            sortingOrder: { Departure_station_name: -1 },
        }
        const response = await fetchJourneysByQuery(options);
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBe(3);
        expect(response[0].Departure_station_name).toBe('C Station');
    });

    it('fetchJourneysByQuery(options) ascending order limited to 2 results', async () => {
        const options = {
            page: 0,
            limit: 2,
            sortingOrder: { Departure_station_name: 1 },
        }
        const response = await fetchJourneysByQuery(options);
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBe(2);
        expect(response[0].Departure_station_name).toBe('A Station');
    });

});
