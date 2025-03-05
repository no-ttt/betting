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

    const query = `
      select * from record;
    `;
    
    const result = await client.query(query);
    
    return res.status(200).json({ 
      success: true, 
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.end();
  }
}
