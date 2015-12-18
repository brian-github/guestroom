Meteor.subscribe('reservations');
Meteor.subscribe('users');

Template.body.rendered = function() {
  Session.setDefault("showCreate", false);
  Session.setDefault("alertMessage", null);
  Session.setDefault("type", "guestroom");
}

Template.body.events({
  'click #showCreateReservation': function(e) {
    e.preventDefault();
    Session.set("showCreate", !Session.get("showCreate"));
  },
  'click .type': function (e, tmp) {
    var id = e.currentTarget.id;
    tmp.$('.type').removeClass("active");
    tmp.$('#'+id).addClass("active");
    Session.set("type", id);
  }
});

Template.body.helpers({
  showCreate: function() {
    return Session.get("showCreate");
  },
  alertMessage: function() {
    return !!Session.get("alertMessage");
  },
  displayType: function () {
    var type = Session.get("type");
    if(type === "guestroom") {
      return "Guest Room";
    }
    if(type === "basement") {
      return "Basement";
    }
  },
  isFirstLogin: function() {
    return !Meteor.user().profile;
  },
  remaining: function() {
    return 7 - (Reservations.find({
      userId: Meteor.userId(),
      type: "guestroom"
    }).count());
  },
  count: function () {
    return Reservations.find({type: "basement", userId: Meteor.userId()}).count();
  },
  loading: function () {
    return !Meteor.users.findOne();
  }
});

Template.registerHelper('type', function (test) {
  var type = Session.get("type");
  return type === test;
});
