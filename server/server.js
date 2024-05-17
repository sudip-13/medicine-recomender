const express = require('express');
const connectDB = require('./database/db')
const {getDoctor} = require('./controllers/disease.controller');
const cors = require('cors');
connectDB();

const corsOption = {
  origin: '*',
  credentials: true
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/getDoctor', getDoctor);

app.listen(5173, () => {
  console.log('Example app listening on port 5173!');
});
