import { Pool } from "pg";
import { Request, Response, NextFunction } from 'express';
import { User } from "../model/user";

export const apiUpdateUserProfile = (pool: Pool) => {
  return async (req: Request, res: Response) => {
    const { username, language } = req.body;
    let user = req.user as User;
    
    if (username) {
      user.username = username;
    }

    if (language) {
      user.language = language;
    }

    const updateQuery = `
      UPDATE users
      SET username = $1, language = $2
      WHERE id = $3
      returning *
    `;
    const values = [user.username, user.language, user.id];
    const result = await pool.query(updateQuery, values);
    user = result.rows[0];

    res.json({
      status: 'success',
      data: {
        username: user.username,
        language: user.language,
      },
      message: `User profile updated successfully. From now on, remember to user the new username and user's preferred language`,
  });
  }
}