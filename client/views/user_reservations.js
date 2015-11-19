Template.userReservations.helpers({
  listRes: function () {
    return Reservations.find({userId: Meteor.userId()});
  },
  dateFormat: function (date) {
    return date.toDateString();
  },
  selectedReservation: function () {
    var res = Session.get("selectedRes");
    var record = Reservations.findOne({_id: res});
    if(res && record) {
      return record;
    } else return false;
  },
  getName: function (userId) {
    return Meteor.users.findOne({_id: userId}).profile.firstName || userId;
  }
});

Template.userReservations.events({
  'click .cancel': function (e, tmp) {
    e.preventDefault();
    let id = e.currentTarget.id;
    Meteor.call('cancelReservation', Meteor.userId(), id);
  }
});

Template.userReservations.rendered = function () {
  Session.setDefault("selectedRes", null);
}
