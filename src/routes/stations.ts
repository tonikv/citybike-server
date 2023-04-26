import { Router, Request, Response } from "express";
import { fetchStations, fetchStation, createStation } from "../services/stations";

interface INewStation {
  Nimi: string;
  Osoite: string;
  Kaupunki: string;
  Operaattori: string;
  Kapasiteetti: number;
  x: number;
  y: number;
}

export const stationRoute = Router();

// Define the about route
stationRoute.get("/about", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Handles access to citybike stations data" });
});

// Get all stations sorted by station name
stationRoute.get("/all", async (_req: Request, res: Response) => {
  try {
    const stations = await fetchStations();
    if (stations.length === 0) {
      res.status(404).json("No stations found");
      return;
    }
    res.status(200).json(stations);
  } catch (err: any) {
    res.status(err.status).json(err.message);
  }
});

// Get station by FID
stationRoute.get("/byFID/:fid", async (req: Request, res: Response) => {
  const queryID = req.params.fid.toString();
  try {
    const station = await fetchStation(queryID);
    if (!station) {
      res.status(404).json("Station not found");
      return;
    }
    res.status(200).json(station);
  } catch (err: any) {
    res.status(err.status).json(err.message);
  }
});

// Store new station to database
stationRoute.post("/create", async (req: Request, res: Response) => {

  const newStation: INewStation = {
    Nimi: req.body.Nimi,
    Osoite: req.body.Osoite,
    Kaupunki: req.body.Kaupunki,
    Operaattori: req.body.Operaattori,
    Kapasiteetti: req.body.Kapasiteetti,
    x: req.body.x,
    y: req.body.y,
  }

  try {
    const saveStation = await createStation(newStation);
    res.status(201).json(saveStation);
  } catch (err: any) {
    res.status(err.status).json(err.message);
  }
});
