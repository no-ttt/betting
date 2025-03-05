import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    await client.connect();

    const updateQuery = `
      update record 
      set ${req.body.bet_type} = ${req.body.bet_type} + $1 
      where user_name = $2
    `;

    const result = await client.query(updateQuery, [req.body.bet_amount, req.body.user_name]);
    
    return res.status(200).json({ 
      success: true
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.end();
  }
}
