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
  },
  isAdmin: function() {
    if (Meteor.user().profile) {
      return Meteor.users.findOne({
        _id: Meteor.userId()
      }).profile.isAdmin;
    }
    return false;
  },
  reservation: function () {
    return Reservations.find({}, {sort: {date: -1}}).fetch();
  }
});

Template.userReservations.events({
  'click .cancel': function (e, tmp) {
    e.preventDefault();
    var id = e.currentTarget.id;
    Meteor.call('cancelReservation', Meteor.userId(), id);
  },
  'click #adminCancel': function (e) {
    e.preventDefault();
    Meteor.call('adminCancelReservation', Meteor.userId(), this._id);
  }
});

Template.userReservations.rendered = function () {
  Session.setDefault("selectedRes", null);
}
