Meteor.publish('reservations', function () {
  return Reservations.find();
});
