import { Request, Response, NextFunction } from 'express';
import { PluginLabApp, PluginLabTokenPayload } from "@pluginlab/node-sdk";
import { Pool } from 'pg';
import { User } from '../model/user';

const pluginLabApp = new PluginLabApp({
  pluginId: process.env.PLUGINLAB_ID as string,
  secretKey: process.env.PLUGINLAB_SECRET_KEY as string,
});

// Middleware to check authentication
export const authenticate = (pool: Pool) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.header('Authorization');

    if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // The PluginLabAuth is the main entry point for all the members related operations
    const auth = await pluginLabApp.getAuth();
    const token = authToken.split(' ')[1];

    try {
      // If the token is valid, it will return the user id
      const payload = await auth.verifyIdToken(token) as PluginLabTokenPayload

      // You may also decode and store user information in the request object for later use
      const pluginlabUser = payload.user;

      try {
        // Check if user exists in the database
        const queryUser = `
          SELECT * FROM users WHERE pluginlab_id = $1
        `;
        const values = [pluginlabUser.id];
        const result = await pool.query(queryUser, values);
        let user: User;
        if (result.rowCount === 0) {
          // Create a new user in the database
          const queryInsertUser = `
          INSERT INTO users (pluginlab_id)
          VALUES ($1)
          returning *
        `;
          const values = [pluginlabUser.id];
          const res = await pool.query(queryInsertUser, values);
          user = res.rows[0];
        } else {
          user = result.rows[0];
        }
        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Cannot find user, please try again later' });
      }

    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}