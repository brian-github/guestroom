Meteor.publish('reservations', function () {
  return Reservations.find();
});

Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {profile: 1}});
});
