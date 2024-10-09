const express = require('express');
const mongoose = require('mongoose');
const { env } = require('process');

const app = express();
const port = env.PORT||3000;

// MongoDB connection
const dbURI = 'mongodb+srv://shreyashnalawade01:foxiscoming@cluster0.gwv0pja.mongodb.net/sensor_data?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define a schema for readings
const readingSchema = new mongoose.Schema({
  device_id: String,
  temperature: Number,
  humidity: Number,
  moisture: Number,
  nitrogen: Number,
  potassium: Number,
  sodium: Number,
  timestamp: Date
});

const Reading = mongoose.model('Reading', readingSchema);

// API endpoint to get the latest reading for a specific device_id
app.get('/latest-reading/:device_id', async (req, res) => {
  const { device_id } = req.params;

  try {
    // Find the latest reading for the provided device_id
    const latestReading = await Reading.findOne({ device_id }).sort({ timestamp: -1 });

    if (!latestReading) {
      return res.status(404).send({ message: 'No readings found for the given device ID' });
    }

    // Send the latest reading as the response
    res.status(200).send(latestReading);
  } catch (err) {
    console.error('Error retrieving data:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
