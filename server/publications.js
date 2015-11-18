Meteor.publish('reservations', function () {
  return Reservations.find();
});

Meteor.startup(function () {
  if(Reservations.find().count() === 0) {
    // let date = new Date(2015, 10, 11);
    let date = "2015-11-11";
    Meteor.call('createReservation', "Brian", date);
  }
});
