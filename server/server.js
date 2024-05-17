const express = require('express');
const connectDB = require('./database/db')
const {getDoctor} = require('./controllers/disease.controller');
connectDB();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/getDoctor', getDoctor);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
