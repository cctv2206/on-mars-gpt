import express from 'express';
import { Pool } from 'pg';
import { User } from '../model/user';
import { authenticate } from '../middleware/auth';
import { apiUpdateUserProfile } from '../services/user.service';
import { apiLocationEnter, apiLocationLeave } from '../services/location.service';

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

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

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

// // todo: remove this
// app.get('/api/user/id', (req, res) => {
//     const openaiUserId = req.header('openai-ephemeral-user-id');
//     res.json({
//         message: 'Welcome to Mars! Your id is ' + openaiUserId
//     });
// });

app.get('/api/location/enter', apiLocationEnter(pool));

app.post('/api/location/leave', apiLocationLeave(pool));

app.post('/api/data', (req, res) => {
    const body = req.body;
    console.log('body', body);
    if (body) {
        res.json({
            message: 'Data received'
        });
    } else {
        res.status(200).json({
            message: 'Empty body'
        });
    }
})

export default app;
