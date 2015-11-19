Template.userReservations.helpers({
  listRes: function () {
    return Reservations.find({userId: Meteor.userId()});
  },
  dateFormat: function (date) {
    return date.toDateString();
  }
});

Template.userReservations.events({
  'click .cancel': function (e, tmp) {
    e.preventDefault();
    let id = e.currentTarget.id;
    Meteor.call('cancelReservation', Meteor.userId(), id);
  }
});
