const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser : true
});

module.exports = mongoose;