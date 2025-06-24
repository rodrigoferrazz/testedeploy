// Import the createClient function from the Supabase JS library
const { createClient } = require('@supabase/supabase-js');

// Define the Supabase project URL and API key
const supabaseUrl = 'https://ouigkghvckktwinjnsyr.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91aWdrZ2h2Y2trdHdpbmpuc3lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU1NDk1OSwiZXhwIjoyMDYyMTMwOTU5fQ.IU5W0Ezh0rOnCbM6nZHlU_0vSirM9gmHogQ9WrHuO7w"; 

// Create a Supabase client instance using the URL and API key
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the Supabase client for use in other parts of the application
module.exports = supabase;