Meteor.subscribe('reservations');

Template.body.rendered = function () {
  Session.setDefault("showCreate", false);
  Session.setDefault("alertMessage", null);
}

Template.body.events({
  'click #showCreateReservation': function (e) {
    e.preventDefault();
      Session.set("showCreate", !Session.get("showCreate"));
  }
});

Template.body.helpers({
  showCreate: function () {
    return Session.get("showCreate");
  },
  alertMessage: function () {
    return !!Session.get("alertMessage");
  },
  isFirstLogin: function () {
    return !Meteor.user().profile;
  }
});
