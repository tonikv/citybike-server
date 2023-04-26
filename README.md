# Citybike Server

This is the server-side component of a Citybike application. It is built using [Express.js](https://expressjs.com/) and connects to a MongoAtlas database to serve data to the client-side.

## Features

- Provides endpoints for retrieving information about bike stations and journeys.
- Implements [Morgan](https://www.npmjs.com/package/morgan) for logging.

## Getting Started

To run the server, you will need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

1. Clone the repository: `git clone https://github.com/tonikv/citybike-server.git`
2. CD into the directory: `cd citybike-server`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Start the server: `npm start`

The server will be running on `http://localhost:4000` by default.

## Endpoints

- `GET /` - Welcome message and list of available routes
- `GET /stations/all` - Retrieves information about all bike stations
- `GET /stations/byFID/:fid` - Retrieves information about a specific bike station by its FID
- `GET /journeys/sorted/:param1/:param2/:param3/:param4` - Retrieves information about bike journeys sorted by certain parameters

## Database

This server uses MongoDB Atlas as its database.

To connect to the database, you will need to configure the following environment variable:

- `MONGOURI` - The URI to connect to the MongoDB Atlas cluster.

Below is provided connection string with only read access to database.
`MONGOURI=mongodb+srv://test:testonlyread@citybike.jzmzrm6.mongodb.net/bikedata?retryWrites=true&w=majority`

## CSV Data Processing

These functions are used to read and process data from CSV files and store it in a Mongo Atlas database. Functions are in dataParser file.

parseFilesStation(file)
file - The CSV file containing information about bike stations. The file should have the following structure: [FID, ID, Nimi, Osoite, Kaupunki, Operaattori, Kapasiteetti, x, y]
it will discard rows with missing or malformed data

parseFilesJourney(file)
file - The CSV file containing information about bike journeys. The file should have the following structure: [Departure, Return, Departure_station_id, Departure_station_name, Return_station_id, Return_station_name, Covered_distance, Duration]
it will discard rows with missing or malformed data and journeys lasting under 10 seconds and distance less than 10 meters.

## Testing and Containerization

This server uses [Jest](https://jestjs.io/) for unit testing and [Docker](https://www.docker.com/) for containerization.

To build and run the Docker image, use the command `docker run -d -p 27017:27017 --name test-mongo mongo:latest`

This will start a container and map the host's port 27017 to the container's port 27017. The mongodb will be accessible at `mongodb://localhost:27017/bikedata` within the container.

To run the tests, use the command `npm test`.

## Deployment

- The server is hosted on [Render](https://citybike.onrender.com)
- The frontend is hosted on [Github Pages](https://tonikv.github.io/citybike-ui/)

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
