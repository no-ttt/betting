import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { user_name, vote_name, bet_amount } = req.body

  try {
    const insertQuery = `
      insert into bet_record (user_name, vote_name, bet_amount) values ($1, $2, $3)
    `
    await pool.query(insertQuery, [user_name, vote_name, bet_amount])

    return res.status(200).json({ 
      success: true
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
}
