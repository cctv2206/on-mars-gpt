import express from 'express';

const app = express();

import { getWeatherData } from '../services/weather';

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to Mars!',
    });
});

app.get('/api/hello', (req, res) => {
    res.json({
        message: 'Welcome to Mars! Remember, whatever happens on Mars, stays on Mars.',
    });
});

app.get('/api/weather', async (req, res) => {
    let location = req.query.location as string || 'San Francisco';

    const response = await getWeatherData(location);

    return res.json({
        ...response,
    });
});

export default app;
