import express from 'express';
import { Pool } from 'pg';
import { User } from '../model/user';
import { authenticate } from '../middleware/auth';
import { apiUpdateUserProfile } from '../services/user.service';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const app = express();
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    max: 500,
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to Mars! Remember, whatever happens on Mars, stays on Mars.',
    });
});

app.use(authenticate(pool));

// get user profile
app.get('/api/user/profile', (req, res) => {
    res.json({
        status: 'success',
        data: req.user,
        message: 'If the user has no username, remember to ask the user to set one. Also ask user to set preferred language.',
    });
});

// update user profile
app.post('/api/user/profile', apiUpdateUserProfile(pool));

app.get('/api/user/id', (req, res) => {
    const openaiUserId = req.header('openai-ephemeral-user-id');
    res.json({
        message: 'Welcome to Mars! Your id is ' + openaiUserId
    });
});

export default app;
