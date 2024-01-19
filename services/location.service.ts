import { Pool } from "pg";
import { Request, Response, NextFunction } from 'express';
import { User } from "../model/user";
import { getCoordinatesString } from "../util/location.util";
import { doInTxn } from "../util/db.util";

const LOCATION_LIMIT = 10;

const clearUserOccupiedLocation = async (pool: Pool, userId: number) => {
  const rows = await doInTxn(pool, async (client) => {
    const sql = `
      UPDATE location_status
      SET occupied = FALSE, occupied_by = NULL, occupied_since = NULL
      WHERE occupied_by = $1
      returning *
    `;
    const values = [userId];
    const result = await client.query(sql, values);
    return result.rows;
  });
  return rows.length;
}

export const apiLocationEnter = (pool: Pool) => {
  return async (req: Request, res: Response) => {
    const { x, y } = req.query as { x: string, y: string };
    const coordinates = {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
    }

    if (coordinates.x < -LOCATION_LIMIT || coordinates.x > LOCATION_LIMIT || coordinates.y < -LOCATION_LIMIT || coordinates.y > LOCATION_LIMIT) {
      res.json({
        status: 'error',
        message: 'Coordinates out of bounds. Please try another one.',
      });
      return;
    }

    const user = req.user as User;

    const currentLocationRows = await doInTxn(pool, async (client) => {
      const sql = `
        SELECT * FROM location_status
        WHERE occupied_by = $1 AND occupied = TRUE
      `;
      const values = [user.id];
      const result = await client.query(sql, values);
      return result.rows;
    })

    if (currentLocationRows.length) {
      // user is already occupying a location
      res.json({
        status: 'error',
        data: {
          userOccupyingLocation: true
        },
        message: 'Ask user to leave the current location first.',
      });
      return;
    }

    const rows = await doInTxn(pool, async (client) => {
      const sql = `
        UPDATE location_status
        SET occupied = TRUE, occupied_by = $1, occupied_since = NOW()
        WHERE coordinates = $2 
        AND (occupied = FALSE OR (occupied = TRUE AND occupied_since <= NOW() - INTERVAL '2 hours'))
        returning *
      `;
      const values = [user.id, getCoordinatesString(coordinates)];
      const result = await client.query(sql, values);
      return result.rows;
    })

    // check if the location is free
    if (!rows.length) {
      res.json({
        status: 'error',
        message: 'Location is already occupied. Please try another one.',
      });
      return;
    }

    // fetch town records
    const townRecordsRows = await doInTxn(pool, async (client) => {
      const sql = `
        SELECT * FROM town_records
        WHERE coordinates = $1
        ORDER BY created_at DESC;
      `;
      const values = [getCoordinatesString(coordinates)];
      const result = await client.query(sql, values);
      return result.rows;
    })

    if (!townRecordsRows.length) {
      res.json({
        status: 'ok',
        message: 'User entered an uncharted territory.',
      });
      return;
    }

    res.json({
      status: 'ok',
      locationHistory: townRecordsRows,
      message: 'User entered a location which has some history.',
    });
  }
}

export const apiLocationLeave = (pool: Pool) => {
  return async (req: Request, res: Response) => {
    const user = req.user as User;
    const body = req.body;

    const currentCoordinatesRows = await doInTxn(pool, async (client) => {
      const sql = `
        SELECT * FROM location_status
        WHERE occupied_by = $1 AND occupied = TRUE AND occupied_since >= NOW() - INTERVAL '2 hours'
      `;
      const values = [user.id];
      const result = await client.query(sql, values);
      return result.rows;
    });

    if (!currentCoordinatesRows.length) {
      const locationsCleared = await clearUserOccupiedLocation(pool, user.id);
      if (locationsCleared) {
        res.json({
          status: 'ok',
          message: 'User has left the location.',
        });
        return;
      }

      // location occupied by someone else due to timeout
      res.json({
        status: 'error',
        message: 'User is not occupying any location.',
      });
      return;
    }

    const currentCoordinates = currentCoordinatesRows[0].coordinates;

    const rows = await doInTxn(pool, async (client) => {
      const freeLocationSql = `
        UPDATE location_status
        SET occupied = FALSE, occupied_by = NULL, occupied_since = NULL
        WHERE occupied_by = $1
      `;
      const values = [user.id];
      await client.query(freeLocationSql, values);

      const townRecordsSql = `
        INSERT INTO town_records (coordinates, user_id, username, content)
        VALUES ($1, $2, $3, $4)
        returning *
      `;
      const townRecordsValues = [currentCoordinates, user.id, user.username, body.record];
      const result = await client.query(townRecordsSql, townRecordsValues);

      return result.rows;
    });

    if (!rows.length) {
      res.json({
        status: 'error',
        message: 'Having trouble saving the town records.',
      });
      return;
    }

    await clearUserOccupiedLocation(pool, user.id);

    res.json({
      status: 'ok',
      message: 'User left the location.',
    });
  }
}