import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';

// Test the save endpoint
const testSaveEndpoint = async () => {
  try {
    // First, let's get a look ID from the database
    const looksResponse = await fetch(`${BASE_URL}/api/users/688f97206b028c68fe110fc7/looks`);
    console.log('Looks response status:', looksResponse.status);
    
    if (looksResponse.ok) {
      const looksData = await looksResponse.json();
      console.log('Looks data:', looksData);
      
      if (looksData.looks && looksData.looks.length > 0) {
        const lookId = looksData.looks[0]._id;
        console.log('Testing save for look ID:', lookId);
        
        // Test saving the look
        const saveResponse = await fetch(`${BASE_URL}/api/users/688f97206b028c68fe110fc7/looks/${lookId}/save`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // You'll need to get a real token
          }
        });
        
        console.log('Save response status:', saveResponse.status);
        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          console.log('Save response:', saveData);
        } else {
          const errorData = await saveResponse.text();
          console.log('Save error:', errorData);
        }
      }
    }
  } catch (error) {
    console.error('Error testing save endpoint:', error);
  }
};

testSaveEndpoint(); 