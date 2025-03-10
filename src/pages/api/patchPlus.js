import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

export default async function handler(req, res) {
  const { user_name, plus1, plus2, plus3 } = req.body

  try {
    const updatePlusQuery = `
      update current_vote 
      set plus1 = $2, plus2 = $3, plus3 = $4
      where user_name = $1;
    `
    await pool.query(updatePlusQuery, [user_name, plus1, plus2, plus3])

    return res.status(200).json({ 
      success: true
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
}
