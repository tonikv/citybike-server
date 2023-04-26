import { config } from "dotenv";
import { Station, Journey, IStationModel, IJourneyModel } from "../models";
import {
  fetchStationByName,
  fetchStation,
  fetchStations,
} from "../services/stations";
import {
  fetchJourneysByQuery,
  fetchTopUsedJourneys,
} from "../services/journeys";
import mongoose from "mongoose";
import { connectTestDatabase, insertTestData } from "../testDatabase";

config();

beforeAll(async () => {
  await connectTestDatabase();
});

beforeEach(async () => {
  await insertTestData(); // stations length 3, journeys length 5
});

afterEach(async () => {
  await Station.deleteMany({});
  await Journey.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Stations", () => {
  it("fetchStations should give all data", async () => {
    const response: IStationModel[] = await fetchStations();
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(3);
  });

  it("fetchStation(fid) should return correct data", async () => {
    const response: IStationModel | null = await fetchStation("1");
    if (response === null) {
      expect(response).toBeNull();
      return;
    }
    expect(response).toBeInstanceOf(Object);
    expect(response.FID).toBe(1);
  });

  it("fetchStation(fid) should give null when data cannot be found", async () => {
    const response: IStationModel | null = await fetchStation("1000");
    expect(response).toBeNull();
  });

  it("fetchStationByName(station name) should give correct data", async () => {
    const response: IStationModel | null = await fetchStationByName("A Station");
    if (response === null) {
      expect(response).toBeNull();
      return;
    }
    expect(response).toBeInstanceOf(Object);
    expect(response.Nimi).toBe("A Station");
  });
});

describe("Journeys", () => {
  it("fetchTopUsedJourneys should return three journeys", async () => {
    const response = await fetchTopUsedJourneys();
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(3);
  });

  it("fetchJourneysByQuery(options) descending order limited to 3 results", async () => {
    const options = {
      page: 0,
      limit: 3,
      sortingOrder: "desc",
      sortBy: "Departure_station_name",
    };
    const response = await fetchJourneysByQuery(options);
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(3);
    expect(response[0].Departure_station_name).toBe("C Station");
  });

  it("fetchJourneysByQuery(options) ascending order limited to 2 results", async () => {
    const options = {
      page: 0,
      limit: 2,
      sortingOrder: "asc",
      sortBy: "Departure_station_name",
    };
    const response = await fetchJourneysByQuery(options);
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(2);
    expect(response[0].Departure_station_name).toBe("A Station");
  });
});
