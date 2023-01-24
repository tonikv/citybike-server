const { Journey } = require('../models.js');

// Fetch all journeys from database
const fetchJourneys = async () => {
    return await Journeys.find({});
}

// Fetch journeys according to query
const fetchJourneysByQuery = async (options) => {
    return await Journey.find({})
    .sort(options.sortingOrder)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .select('Departure_station_name Return_station_name Covered_distance Duration')
    .exec();
}

// Fetch station usage information
const fetchStationUsageInformation = async (start_name, end_name) => {
    const startJourneys = await Journey.find({ Departure_station_name: start_name }).countDocuments();
    const endJourneys = await Journey.find({ Return_station_name: end_name }).countDocuments();
    return ({ start: startJourneys, end: endJourneys });
}

// Fetch top 5 used journeys
const fetchTopUsedJourneys = async () => {
    const pipeline = [
        {
            $group: {
            _id: {
                Departure_station_name: "$Departure_station_name",
                Return_station_name: "$Return_station_name"
            },
            count: { $sum: 1 }
        }
        },
        {
            $sort:
                { count: -1 }
        },
        {
            $limit: 5
        }
    ];

    const getData = await Journey.aggregate(pipeline)

    // Check if data is empty
    if (getData.length === 0) {
        return [];
    }

    // Format data to be more readable and return result
    let topJourneys = [];
    for (trips of getData) {
        const result = {
            Departure_station_name: trips._id.Departure_station_name,
            Return_station_name: trips._id.Return_station_name,
            count: trips.count
        }
        topJourneys.push(result);
    }
    return topJourneys;
}


module.exports = {
    fetchJourneysByQuery,
    fetchTopUsedJourneys,
    fetchStationUsageInformation,
}
