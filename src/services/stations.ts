import { Journey, Station, IStation, IStationModel } from "../models";

interface INewStation {
    Nimi: string;
    Osoite: string;
    Kaupunki: string;
    Operaattori: string;
    Kapasiteetti: number;
    x: number;
    y: number;
}

async function findLargestFID() {
    const stations = await Station.find({}).sort({ FID: -1 });
    return stations[0].FID;
}

// Fetch all stations from database. Sorted by station name.
export const fetchStations = async (): Promise<IStationModel[]> => {
    return await Station.find({}).sort({ Nimi: 1 });
};

// Fetch station by FID
export const fetchStation = async (
    fid: string
): Promise<IStationModel | null> => {
    return await Station.findOne({ FID: fid });
};

// Fetch station by name
export const fetchStationByName = async (
    name: string
): Promise<IStationModel | null> => {
    return await Station.findOne({ Nimi: name });
};

// Create new station
export const createStation = async (
    newStation: INewStation
): Promise<IStationModel> => {
    const largestFID = await findLargestFID();
    const newFID = largestFID + 1;

    const modelToSave: IStation = {
        FID: newFID,
        ID: Math.floor(Math.random() * 1000000),
        Nimi: newStation.Nimi,
        Osoite: newStation.Osoite,
        Kaupunki: newStation.Kaupunki,
        Operaattori: newStation.Operaattori,
        Kapasiteetti: newStation.Kapasiteetti,
        x: newStation.x,
        y: newStation.y,
    };

    const station: IStationModel = new Station(modelToSave);
    return await station.save();
};

// Update station
export const updateStation = async (
    fid: string,
    updatedStation: IStationModel
): Promise<IStationModel | null> => {
    return await Station.findOneAndUpdate({ FID: fid }, updatedStation, {
        new: true,
    });
};

// Delete station
export const deleteStation = async (
    fid: string
): Promise<IStationModel | null> => {
    return await Station.findOneAndDelete({ FID: fid });
};

// Get average distance traveled to station
export const getAverageDistanceToStation = async (
    name: string
): Promise<number> => {
    const pipeline = [
        {
            $match: {
                Return_station_name: name,
            },
        },
        {
            $group: {
                _id: null,
                averageDistance: { $avg: "$Covered_distance" },
            },
        },
    ];

    const getData: { averageDistance: number }[] = await Journey.aggregate(
        pipeline
    );
    if (getData.length === 0) {
        return 0;
    }
    return getData[0].averageDistance;
};

// Get average distance traveled from station
export const getAverageDistanceFromStation = async (
    stationName: string
): Promise<number> => {
    const pipeline = [
        {
            $match: {
                Departure_station_name: stationName,
            },
        },
        {
            $group: {
                _id: null,
                averageDistance: { $avg: "$Covered_distance" },
            },
        },
    ];

    const getData: { averageDistance: number }[] = await Journey.aggregate(
        pipeline
    );
    if (getData.length === 0) {
        return 0;
    }
    return getData[0].averageDistance;
};

// Add additional information to stations
export const setStationUsageInformation = async (): Promise<void> => {
    const stations: IStationModel[] = await Station.find({});

    for (const station of stations) {
        const startJourneys: number = await Journey.find({
            Departure_station_name: station.Nimi,
        }).countDocuments();
        const endJourneys: number = await Journey.find({
            Return_station_name: station.Nimi,
        }).countDocuments();
        const averageDistanceStarting: number =
            await getAverageDistanceFromStation(station.Nimi);
        const averageDistanceEnding: number = await getAverageDistanceToStation(
            station.Nimi
        );

        station.Starting_station_count = startJourneys;
        station.Ending_station_count = endJourneys;
        station.Average_journey_distance_starting = averageDistanceStarting;
        station.Average_journey_distance_ending = averageDistanceEnding;
        await station.save();
    }
};
