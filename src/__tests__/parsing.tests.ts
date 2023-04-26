import mongoose from "mongoose";
import fs from "fs";
import { connectTestDatabase } from "../testDatabase";
import { Station, Journey } from "../models";
import { parseFilesStation, parseFilesJourney } from "../dataParser";
import waitForExpect from "wait-for-expect";

const csvStations = fs.createReadStream("./testStations.csv"); // 9 stations
const csvMalformedStations = fs.createReadStream("./testStationsMalformed.csv"); // 9 stations - 2 malformed

const csvJourneys = fs.createReadStream("./testJourneys.csv"); // 9 journeys
const csvMalformedJourneys = fs.createReadStream("./testJourneysMalformed.csv"); // 9 journeys - 2 malformed - 2 under 10 seconds

beforeAll(async () => {
  await connectTestDatabase();
  jest.spyOn(console, "log").mockImplementation(jest.fn());
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Parsing functions", () => {
  it("parsings Stations with working csv", async () => {
    jest.spyOn(Station.prototype, "save").mockImplementation(() => {});
    const parsedStations = parseFilesStation(csvStations);
    const stations = await Station.find();
    expect(Station.prototype.save).toHaveBeenCalledTimes(9);
  });

  it("parsing Stations with malformed csv", async () => {
    const expectedSaveCalls = 7;

    const saveMock = jest.spyOn(Station.prototype, "save").mockImplementation(() => Promise.resolve());
    parseFilesStation(csvMalformedStations);

    await waitForExpect(() => {
      expect(saveMock).toHaveBeenCalledTimes(expectedSaveCalls);
    });
  });

  it("parsing Journeys with working csv", async () => {
    const expectedSaveCalls = 9;

    const saveMock = jest.spyOn(Journey.prototype, "save").mockImplementation(() => Promise.resolve());
    parseFilesJourney(csvJourneys);

    await waitForExpect(() => {
      expect(saveMock).toHaveBeenCalledTimes(expectedSaveCalls);
    });
  });

  it("parsing Journeys with malformed csv", async () => {
    const expectedSaveCalls = 5;

    const saveMock = jest.spyOn(Journey.prototype, "save").mockImplementation(() => Promise.resolve());
    parseFilesJourney(csvMalformedJourneys);

    await waitForExpect(() => {
      expect(saveMock).toHaveBeenCalledTimes(expectedSaveCalls);
    });
  });

});
