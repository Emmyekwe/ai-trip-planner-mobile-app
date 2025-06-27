const express = require('express');
const router = express.Router();
const db = require('../db');

// Save trip recommendations
router.post('/save', async (req, res) => {
  try {
    const { 
      userId, 
      destination, 
      startDate, 
      endDate, 
      budget, 
      travelers, 
      travelStyle, 
      interests, 
      recommendations 
    } = req.body;

    // Validate required fields
    if (!userId || !destination || !startDate || !endDate || !budget || !travelers || !travelStyle || !interests || !recommendations) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Insert trip data into database
    const query = `
      INSERT INTO trips (user_id, destination, start_date, end_date, budget, travelers, travel_style, interests, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at
    `;

    const values = [
      userId,
      destination,
      startDate,
      endDate,
      parseFloat(budget),
      parseInt(travelers),
      travelStyle,
      interests,
      JSON.stringify(recommendations)
    ];

    const result = await db.query(query, values);

    res.json({
      success: true,
      data: {
        tripId: result.rows[0].id,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error saving trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save trip'
    });
  }
});

// Get user's trip history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get user's trip history
    const query = `
      SELECT id, destination, start_date, end_date, budget, travelers, travel_style, interests, recommendations, created_at
      FROM trips 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const result = await db.query(query, [userId]);

    // Parse recommendations JSON for each trip
    const trips = result.rows.map(trip => {
      let recommendations;
      try {
        // Handle both JSONB and string formats
        recommendations = typeof trip.recommendations === 'string' 
          ? JSON.parse(trip.recommendations) 
          : trip.recommendations;
      } catch (e) {
        console.error('Error parsing recommendations:', e);
        recommendations = {};
      }
      
      return {
        ...trip,
        recommendations,
        duration: Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))
      };
    });

    res.json({
      success: true,
      data: trips
    });

  } catch (error) {
    console.error('Error fetching trip history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip history'
    });
  }
});

// Get specific trip details
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID is required'
      });
    }

    const query = `
      SELECT id, user_id, destination, start_date, end_date, budget, travelers, travel_style, interests, recommendations, created_at
      FROM trips 
      WHERE id = $1
    `;

    const result = await db.query(query, [tripId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const trip = result.rows[0];
    
    // Handle recommendations parsing
    let recommendations;
    try {
      recommendations = typeof trip.recommendations === 'string' 
        ? JSON.parse(trip.recommendations) 
        : trip.recommendations;
    } catch (e) {
      console.error('Error parsing recommendations:', e);
      recommendations = {};
    }
    
    trip.recommendations = recommendations;
    trip.duration = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      data: trip
    });

  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip'
    });
  }
});

// Delete a trip
router.delete('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.body; // For authorization

    if (!tripId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID and User ID are required'
      });
    }

    const query = `
      DELETE FROM trips 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await db.query(query, [tripId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip'
    });
  }
});

module.exports = router; 