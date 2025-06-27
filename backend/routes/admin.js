const express = require('express');
const router = express.Router();
const db = require('../db');

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM trips) as total_trips,
        (SELECT COUNT(*) FROM trips WHERE created_at >= NOW() - INTERVAL '7 days') as recent_trips
    `;
    
    const result = await db.query(statsQuery);
    const stats = result.rows[0];
    
    res.json({
      totalUsers: parseInt(stats.total_users),
      totalTrips: parseInt(stats.total_trips),
      recentTrips: parseInt(stats.recent_trips)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const usersQuery = `
      SELECT id, name, email, created_at
      FROM users 
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(usersQuery);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all trips with user information
router.get('/trips', async (req, res) => {
  try {
    const tripsQuery = `
      SELECT 
        t.id,
        u.name as user_name,
        t.destination,
        t.start_date,
        t.end_date,
        t.budget,
        t.travelers,
        t.travel_style,
        t.created_at
      FROM trips t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
    
    const result = await db.query(tripsQuery);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

module.exports = router; 