const axios = require('axios');

const GOOGLE_MAPS_SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;

const directionsService = {
  getDirections: async (origin, destination) => {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin,
            destination,
            key: GOOGLE_MAPS_SERVER_KEY
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Directions API error: ${error.message}`);
    }
  }
};

module.exports = directionsService;
