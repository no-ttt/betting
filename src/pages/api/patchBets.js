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
  const { user_name, vote_name, bet_amount } = req.body

  try {
    const updateVoteQuery = `
      update current_vote set get_vote = get_vote + $2 where user_name = $1;
    `
    await pool.query(updateVoteQuery, [vote_name, bet_amount])

    console.log(vote_name, bet_amount)

    const updateRemainingBetsQuery = `
      update current_vote set remain_count = remain_count - $2 where user_name = $1;
    `
    await pool.query(updateRemainingBetsQuery, [user_name, bet_amount])
    
    return res.status(200).json({ 
      success: true
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
}
