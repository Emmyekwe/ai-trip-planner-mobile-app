const pool = require('./db');

async function viewData() {
  try {
    console.log('🔍 Viewing Travel App Database Data\n');

    // View users
    console.log('👥 USERS:');
    const usersResult = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
    if (usersResult.rows.length > 0) {
      usersResult.rows.forEach(user => {
        console.log(`  ID: ${user.id} | Name: ${user.name} | Email: ${user.email} | Created: ${user.created_at}`);
      });
    } else {
      console.log('  No users found');
    }

    console.log('\n✈️ TRIPS:');
    const tripsResult = await pool.query(`
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
    `);

    if (tripsResult.rows.length > 0) {
      tripsResult.rows.forEach(trip => {
        console.log(`  ID: ${trip.id} | User: ${trip.user_name} | Destination: ${trip.destination}`);
        console.log(`      Dates: ${trip.start_date} to ${trip.end_date} | Budget: $${trip.budget} | Style: ${trip.travel_style}`);
        console.log(`      Created: ${trip.created_at}\n`);
      });
    } else {
      console.log('  No trips found');
    }

    // Summary
    console.log('📊 SUMMARY:');
    const summaryResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM trips) as total_trips
    `);
    const summary = summaryResult.rows[0];
    console.log(`  Total Users: ${summary.total_users}`);
    console.log(`  Total Trips: ${summary.total_trips}`);

  } catch (error) {
    console.error('Error viewing data:', error);
  } finally {
    await pool.end();
  }
}

viewData(); 