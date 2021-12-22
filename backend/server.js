const app = require('./app');
const openConnection = require('./database');

// open mongo connection
openConnection();

// start express app
app.listen(4001, () => "App listening on port 4001");