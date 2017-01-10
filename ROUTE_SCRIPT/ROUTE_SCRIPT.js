// const route = require('./mattRouteHome.json');
const route = require('./' + process.argv[2]);

// routes
//  [array of length 1]
//   .legs
//     .start_location
//       .lat
//       .lng
//     .end_location
//       .lat
//       .lng
//     .steps (array of objects)
//       [array]
//         .start_location
//           .lat
//           .lng
//         .end_location
//           .lat
//           .lng

const routePoints = route.routes[0].legs[0].steps.map((obj) => obj.end_location);
routePoints.unshift(route.routes[0].legs[0].start_location)

console.log(routePoints)
