// @flow

export default {
  // Functions return fixtures
  getNeighborhoodBoundaries: (city: string) => {
    const sfData = require('../Fixtures/sanFrancisco.json')
    return {
      ok: true,
      data: sfData
    }
  },
  getCity: (city: string) => {
    // This fixture only supports Boise or else returns toronto
    const boiseData = require('../Fixtures/boise.json')
    const torontoData = require('../Fixtures/toronto.json')
    return {
      ok: true,
      data: city.toLowerCase() === 'boise' ? boiseData : torontoData
    }
  }
}
