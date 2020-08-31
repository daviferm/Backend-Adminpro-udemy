const mongoose = require('mongoose');

const dbConnection = async() => {

    const path = process.env.DB_CNN;

    try {
        await mongoose.connect(path, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online..');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos!!');

    }

}

module.exports = {
    dbConnection
}