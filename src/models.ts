import mongoose, { Document } from "mongoose";

// Journey Modal Schema
const journeysSchema = new mongoose.Schema({
  Departure: { type: Date, required: true },
  Return: { type: Date, required: true },
  Departure_station_id: { type: Number, required: true },
  Departure_station_name: { type: String, required: true },
  Return_station_id: { type: Number, required: true },
  Return_station_name: { type: String, required: true },
  Covered_distance: { type: Number, required: true },
  Duration: { type: Number, required: true },
});

export interface IJourney {
  Departure: Date;
  Return: Date;
  Departure_station_id: number;
  Departure_station_name: string;
  Return_station_id: number;
  Return_station_name: string;
  Covered_distance: number;
  Duration: number;
}

// Stations Modal Schema
const stationsSchema = new mongoose.Schema({
  FID: { type: Number, required: true, unique: true },
  ID: { type: Number, required: true, unique: true },
  Nimi: { type: String, required: true },
  Osoite: { type: String, required: true },
  Kaupunki: { type: String, required: true },
  Operaattori: { type: String, required: true },
  Kapasiteetti: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  Starting_station_count: Number,
  Ending_station_count: Number,
  Average_journey_distance_starting: Number,
  Average_journey_distance_ending: Number,
});

export interface IStation {
  FID: number;
  ID: number;
  Nimi: string;
  Osoite: string;
  Kaupunki: string;
  Operaattori: string;
  Kapasiteetti: number;
  x: number;
  y: number;
  Starting_station_count?: number;
  Ending_station_count?: number;
  Average_journey_distance_starting?: number;
  Average_journey_distance_ending?: number;
}

export interface IJourneyModel extends IJourney, Document { }
export interface IStationModel extends IStation, Document { }

// Create model objects
export const Journey = mongoose.model<IJourneyModel>("journey", journeysSchema);
export const Station = mongoose.model<IStationModel>("station", stationsSchema);
