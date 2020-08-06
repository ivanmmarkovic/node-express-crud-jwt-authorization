const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/rest_crud';
//mongoose.connect(dbURI, {useNewUrlParser: true});
mongoose.connect(dbURI, { useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});


require('./User');