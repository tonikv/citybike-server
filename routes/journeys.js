// Journeys route for returning information from database about journeys.
const express = require('express')
const router = express.Router()
const { Journey } = require('../models.js');
const helper = require('../dataParser');

const { fetchJourneysByQuery, fetchTopUsedJourneys, fetchStationUsageInformation } = require('../services/journeys.js');


// Define the about route
router.get('/about', (req, res) => {
    res.status(200).json({ message: "Handles access to citybike journeys data" });
})

// Get top five most used journeys
router.get('/topfive', async (req, res) => {
    try {
        const topUsed = await fetchTopUsedJourneys();
        res.status(200).json(topUsed);
    } catch (err) {
        res.status(err.status).json(err.message);
    }
})


// Get journeys sorted skipped and limited, according to request params.
router.get('/sorted/:page/:limit/:sortBy/:sortOrder/:filter?', async (req, res) => {
    // Construct items for database query. Pass in defaults, if params are missing.
    let sortingOrder = {};
    sortingOrder[req.params.sortBy] = (req.params.sortOrder === "asc" ? 1 : -1);

    const options = {
        page: parseInt(req.params.page) || 0,
        limit: parseInt(req.params.limit) || 10,
        sortingOrder: sortingOrder,
    }
    try {
        const result = await fetchJourneysByQuery(options);
        if (result.length === 0) {
            res.status(400).json({ error: "No journeys found" });
            return;
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status).json(err.message);
    }
})

// Get information about station usage amount. Params are station names.
router.get('/usage/:start/:end', async (req, res) => {
    const startName = req.params.start;
    const endName = req.params.end;
    try {
        const data = fetchStationUsageInformation(startName, endName);
        res.status(200).json(data);
    } catch (err) {
        res.status(err.status).json(err.message);
    }
})

module.exports = router
