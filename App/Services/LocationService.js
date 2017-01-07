import LocationActions from '../Redux/LocationRedux'

module.exports = function() {
  console.log('configuring interval');
  this.setInterval(()=>{
      console.log("In Interval");
      //LocationActions.locationRequest("ElmerFudd");
      console.log("LocationAction Called");
  }, 5000);
};
