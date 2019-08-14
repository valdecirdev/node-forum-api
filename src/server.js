require('dotenv').config();

const express  = require('express');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);

require('./database/index');

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cors());

require('./app/routes/index')(app);

const port = process.env.PORT || 3330;
app.listen(port, function () {
    console.log('App listening on port %s', port);
});
