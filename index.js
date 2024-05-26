const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const bodyParser = require('body-parser');
const dashboardRoutes = require('./routes/dashboardRoutes');
const createError = require('http-errors');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();
require("./model/dbConnect");

app.use(helmet());
const corOptions = {
    origin: 'http://localhost:3000',
}
app.use(cors(corOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user', userRoutes);
app.use('/api/items', itemsRoutes);
app.use('./dashboard', dashboardRoutes);

// Handling 404 error
app.use(async (req, res, next) => {
    next(createError.NotFound());
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.status === 401) {
        // Handle 401 Unauthorized error
        res.status(401).send({
            error: {
                status: 401,
                message: "Unauthorized: Invalid username or password"
            }
        });
    } else {
        // Handle other errors
        res.status(err.status || 500).send({
            error: {
                status: err.status || 500,
                message: err.message || "Internal Server Error"
            }
        });
    }
});

app.listen(process.env.port || 4000, function () {
    console.log('Now listening for requests on: http://localhost:4000');
});