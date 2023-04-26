import { Journey, IJourneyModel } from "../models";

interface FetchJourneyOptions {
  sortingOrder: string;
  sortBy: string;
  page: number;
  limit: number;
}

interface TopJourney {
  Departure_station_name: string;
  Return_station_name: string;
  count: number;
}

interface StationUsageInformation {
  start: number;
  end: number;
}

const pipeline = [
  {
    $group: {
      _id: {
        Departure_station_name: "$Departure_station_name",
        Return_station_name: "$Return_station_name",
      },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $limit: 5,
  },
];

const fetchJourneys = async (): Promise<IJourneyModel[]> => {
  return await Journey.find({});
};

const fetchJourneysByQuery = async (
  options: FetchJourneyOptions
): Promise<IJourneyModel[]> => {
  let item: any = {};
  item[options.sortBy] = options.sortingOrder === "asc" ? 1 : -1;

  return await Journey.find({})
    .sort(item)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .select(
      "Departure_station_name Return_station_name Covered_distance Duration"
    )
    .exec();
};

const fetchStationUsageInformation = async (
  start_name: string,
  end_name: string
): Promise<StationUsageInformation> => {
  const startJourneys = await Journey.find({
    Departure_station_name: start_name,
  }).countDocuments();
  const endJourneys = await Journey.find({
    Return_station_name: end_name,
  }).countDocuments();
  return { start: startJourneys, end: endJourneys };
};

const fetchTopUsedJourneys = async (): Promise<TopJourney[]> => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result: TopJourney[] = await Journey.aggregate(pipeline).exec();
    let topJourneys: TopJourney[] = [];
    for (const item of result) {
      const top: TopJourney = {
        Departure_station_name: item.Departure_station_name,
        Return_station_name: item.Return_station_name,
        count: item.count,
      };
      topJourneys.push(top);
    }
    return topJourneys;
  } catch (error) {
    throw error;
  }
};

export {
  fetchJourneys,
  fetchJourneysByQuery,
  fetchTopUsedJourneys,
  fetchStationUsageInformation,
};
