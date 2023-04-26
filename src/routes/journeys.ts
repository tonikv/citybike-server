// Journeys route for returning information from database about journeys.
import { Router } from "express";
import { Response, Request } from "express";

export const journeyRoute = Router();

import {
  fetchJourneysByQuery,
  fetchTopUsedJourneys,
  fetchStationUsageInformation,
} from "../services/journeys";

// Define the about route
journeyRoute.get("/about", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Handles access to citybike journeys data" });
});

// Get top five most used journeys
journeyRoute.get("/topfive", async (_req, res) => {
  try {
    const topUsed = await fetchTopUsedJourneys();
    res.status(200).json(topUsed);
  } catch (err: any) {
    res.status(err.status).json(err.message);
  }
});

// Get journeys sorted skipped and limited, according to request params.
journeyRoute.get(
  "/sorted/:page/:limit/:sortBy/:sortOrder/:filter?",
  async (req, res) => {
    // Construct items for database query. Pass in defaults, if params are missing.

    interface FetchJourneyOptions {
      sortingOrder: string;
      sortBy: string;
      page: number;
      limit: number;
    }

    const options: FetchJourneyOptions = {
      page: parseInt(req.params.page) || 0,
      limit: parseInt(req.params.limit) || 10,
      sortingOrder: req.params.sortOrder,
      sortBy: req.params.sortBy,
    };

    try {
      const result = await fetchJourneysByQuery(options);
      if (result.length === 0) {
        res.status(400).json({ error: "No journeys found" });
        return;
      }
      res.status(200).json(result);
    } catch (err: any) {
      res.status(err.status).json(err.message);
    }
  }
);

// Get information about station usage amount. Params are station names.
journeyRoute.get("/usage/:start/:end", async (req, res) => {
  const startName = req.params.start;
  const endName = req.params.end;
  try {
    const data = fetchStationUsageInformation(startName, endName);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(err.status).json(err.message);
  }
});
