const express = require('express');
const router = express.Router();
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI-powered travel recommendations
router.post('/generate', async (req, res) => {
  try {
    const { userId, destination, startDate, endDate, budget, travelers, travelStyle, interests } = req.body;

    if (!destination || !startDate || !endDate || !budget || !travelers || !travelStyle || !interests) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Compose a prompt for GPT
    const prompt = `
You are a travel assistant. Create a personalized trip plan for:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Budget: $${budget}
- Travelers: ${travelers}
- Style: ${travelStyle}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}

Respond in JSON with:
{
  "hotels": [ 
    { 
      "name": "...", 
      "rating": ..., 
      "price": ..., 
      "description": "...", 
      "image": "🏨", 
      "amenities": [...], 
      "location": "..." 
    }, 
    ... 
  ],
  "activities": [ 
    { 
      "name": "...", 
      "duration": "...", 
      "price": ..., 
      "description": "...", 
      "image": "🎨", 
      "category": "..." 
    }, 
    ... 
  ],
  "itinerary": [ 
    { 
      "day": 1, 
      "title": "...", 
      "activities": ["..."], 
      "meals": { 
        "breakfast": "...", 
        "lunch": "...", 
        "dinner": "..." 
      } 
    }, 
    ... 
  ],
  "summary": {
    "destination": "...",
    "duration": ...,
    "estimatedCost": { 
      "total": ..., 
      "breakdown": { 
        "accommodation": ..., 
        "activities": ..., 
        "food": ..., 
        "transport": ... 
      } 
    },
    "bestTimeToVisit": "...",
    "weatherInfo": "..."
  }
}

CRITICAL: For the "image" field, use ONLY emoji icons, NEVER URLs or text like "image_url". Use these emojis:
- Hotels: 🏨 (general), 🏖️ (beach resort), 🏛️ (historic), 🏠 (boutique), 🏘️ (hostel), 🏔️ (mountain), 🏰 (castle)
- Activities: 🎨 (art), 🖼️ (gallery), 👨‍🍳 (cooking), 🍽️ (food), 🏃 (sports), 🦁 (wildlife), 🏛️ (historic), 🏖️ (beach), 🚶 (walking), ⛵ (boat), 🎭 (culture), 🛍️ (shopping), 🌸 (nature), 🗼 (landmarks)
- Choose the most appropriate emoji for each item.
`;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the JSON from GPT's response
    let gptText = completion.choices[0].message.content;
    // Find the first and last curly braces to extract JSON
    const firstBrace = gptText.indexOf('{');
    const lastBrace = gptText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      gptText = gptText.substring(firstBrace, lastBrace + 1);
    }
    let recommendations;
    try {
      recommendations = JSON.parse(gptText);
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Failed to parse AI response', raw: gptText });
    }

    // Fix any remaining "image_url" or URL values with appropriate emojis
    if (recommendations.hotels) {
      recommendations.hotels.forEach(hotel => {
        if (hotel.image && (hotel.image.includes('http') || hotel.image === 'image_url')) {
          hotel.image = '🏨';
        }
      });
    }

    if (recommendations.activities) {
      recommendations.activities.forEach(activity => {
        if (activity.image && (activity.image.includes('http') || activity.image === 'image_url')) {
          // Choose emoji based on category
          const categoryEmojis = {
            'Museums & Art': '🎨',
            'Food & Dining': '🍽️',
            'Nature & Outdoors': '🏃',
            'Historical Sites': '🏛️',
            'Beaches': '🏖️',
            'Cultural': '🎭',
            'Adventure': '🏔️',
            'Relaxation': '🌸',
            'Sightseeing': '🗼'
          };
          activity.image = categoryEmojis[activity.category] || '🎯';
        }
      });
    }

    // Save trip data to database if userId is provided
    let tripId = null;
    if (userId) {
      try {
        const db = require('../db');
        const saveQuery = `
          INSERT INTO trips (user_id, destination, start_date, end_date, budget, travelers, travel_style, interests, recommendations)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `;
        
        const saveValues = [
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

        const saveResult = await db.query(saveQuery, saveValues);
        tripId = saveResult.rows[0].id;
      } catch (saveError) {
        console.error('Error saving trip:', saveError);
        // Continue without saving if there's an error
      }
    }

    res.json({ 
      success: true, 
      data: recommendations,
      tripId: tripId
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ success: false, message: 'Failed to generate recommendations' });
  }
});

module.exports = router; 