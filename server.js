const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection')
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({alter : true }).then(() => 
// Chee's addition - see week13/activity03 for info in sequelize.sync
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
}))
