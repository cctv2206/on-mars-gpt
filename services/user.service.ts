import { Pool } from "pg";
import { Request, Response, NextFunction } from 'express';
import { User } from "../model/user";
import { doInTxn } from "../util/db.util";

export const apiUpdateUserProfile = (pool: Pool) => {
  return async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        status: 'error',
        message: 'Name is required.',
      });
      return;
    }

    const user = req.user as User;

    if (name === user.username) {
      res.json({
        status: 'success',
        data: {
          username: user.username
        },
        message: `User profile updated successfully.`,
      });
      return;
    }

    const sameNameRows = await doInTxn(pool, async (client) => {
      const query = `
        SELECT *
        FROM users
        WHERE username = $1
      `;
      const values = [name];
      const result = await client.query(query, values);
      return result.rows;
    });

    if (sameNameRows.length > 0) {
      res.status(400).json({
        status: 'error',
        message: 'Name is already taken. Kindly ask user to choose another name.',
      });
      return;
    }

    const rows = await doInTxn(pool, async (client) => {
      const updateQuery = `
        UPDATE users
        SET username = $1
        WHERE id = $2
        returning *
      `;
      const values = [name, user.id];
      const result = await pool.query(updateQuery, values);
      return result.rows;
    })

    if (!rows.length) {
      res.status(400).json({
        status: 'error',
        message: 'Update user profile error. Please try again later.',
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        username: name
      },
      message: `User profile updated successfully.`,
    });
  }
}