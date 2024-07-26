import { Pool } from "pg";
// export async function dbConnection() {
//   const client = new Client();
//   await client.connect();

// }

const pool = new Pool({ ssl: true });
pool.on("error", function poolError(err, client) {
  console.error("Unexpected error: ", err);
  return process.exit(-1);
});

export const query = async (text: string, params: Array<any>) => {
  console.log("IRUN");
  const start = Date.now();
  const client = await pool.connect();
  const result = await client.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: result.rowCount });
  return result;
};
