import express from 'express';

const app = express();

import { getWeatherData } from '../services/weather';

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to ExpressWeather! Ask ChatGPT for the weather in your city.',
    });
});

app.get('/api/weather', async (req, res) => {
    let location = req.query.location || 'San Francisco';

    const response = await getWeatherData(location);

    return res.json({
        ...response,
    });
});

export default app;
