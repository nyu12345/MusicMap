require('dotenv').config();

const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'MusicMap',
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});