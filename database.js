// Connect to MongoDB 
require('dotenv').config()
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

try {
    mongoose.connect(process.env.MONGOURI, options);
    console.log('Database connected!')
} catch (error) {
    console.error(error)
}