const server = require('../index.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const mongoose = require('mongoose');

afterAll(async () => {
  mongoose.connection.close()
});

describe("Journeys route", () => {
  it('GET / journeys/about/ should return a message', async () => {
    const response = await requestWithSupertest.get('/journeys/about');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Handles access to citybike journeys data' });
  });

  it('GET / journeys/topfive/ should give five results', async () => {
    const response = await requestWithSupertest.get('/journeys/topfive');
    expect(response.status).toBe(200);
    expect((response) => {
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(5);
    });
  });

  it('GET / journeys/sorted/0/10/Departure_station_name/asc/ should give ten results', async () => {
    const response = await requestWithSupertest.get('/journeys/sorted/0/10/Departure_station_name/asc/');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(10);
  });

});

describe("Stations route", () => {
  it('GET / stations/about/ should return a message', async () => {
    const response = await requestWithSupertest.get('/stations/about');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Handles access to citybike stations data' });
  });

  it('GET / stations/all/ should give all 457 results', async () => {
    const response = await requestWithSupertest.get('/stations/all');
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(457);
  });

  it('GET / stations/byFID/ should give one result', async () => {
    const response = await requestWithSupertest.get('/stations/byFID/1');
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.FID).toBe(1);
  });

  it('GET /  stations/byFID/ should give error if there is no data', async () => {
    const response = await requestWithSupertest.get('/stations/byFID/1000');
    expect(response.status).toBe(404);
    expect(response.body).toEqual('Station not found');
  })

});
