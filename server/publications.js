Meteor.publish('reservations', function () {
  if(!this.userId) return [];
  return Reservations.find();
});

Meteor.publish('users', function () {
  if(!this.userId) return [];
  return Meteor.users.find({}, {fields: {profile: 1}});
});
