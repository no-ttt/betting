import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { name } = req.query

  try {
    const remainingBetsQuery = `
      select user_name, remain_count from current_vote
      where user_name = $1
    `
    const userData = await pool.query(remainingBetsQuery, [name])

    const bettingStatisticsQuery = `
      select vote_name, sum(bet_amount) as total_bet_amount from bet_record
      where user_name = $1
      group by vote_name
    `
    const bettingStatistics = await pool.query(bettingStatisticsQuery, [name])

    const totalVoteQuery = `
      select SUM(get_vote) as total_vote
      from current_vote;
    `
    const totalVote = await pool.query(totalVoteQuery)

    const currentVoteQuery = `
      select user_name,
        get_vote as current_vote
      from current_vote;
    `
    
    const currentVote = await pool.query(currentVoteQuery)

    return res.status(200).json({ 
      success: true, 
      data: {
        userName: userData.rows[0]?.user_name,
        remainingBets: userData.rows[0]?.remain_count,
        bettingStatistics: bettingStatistics.rows,
        odds: currentVote.rows.map(row => ({
          user_name: row.user_name,
          total_vote_ratio: Math.floor((totalVote.rows[0].total_vote / row.current_vote) * 100) / 100
        }))
      }
    })
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' })
  }
}
