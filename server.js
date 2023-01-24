require('dotenv').config();
const app = require('./index.js');
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});
