import { Pool, PoolClient } from "pg";

export type TxnAction<T> = (client: PoolClient) => Promise<T>;

export const doInTxn = async <T>(pool: Pool, action: TxnAction<T>): Promise<T> => {
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    const res = await action(client);
    await client.query("COMMIT");
    return res;
  } catch (err) {
    console
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};