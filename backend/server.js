const app = require('./app');
const database = require('./database');

// open mongo connection
database.openConnection();

// start express app
app.listen(4001, () => "App listening on port 4001");