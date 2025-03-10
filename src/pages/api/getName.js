import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    const query = `
      select user_name from current_vote;
    `
    
    const allName = await pool.query(query)

    return res.status(200).json({ 
      success: true, 
      data: {
        allName: allName.rows
      }
    })
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' })
  }
}
