Template.alert.helpers({
  alertMessage: function () {
    return Session.get("alertMessage");
  },
  alertLevel: function () {
    return Session.get("alertType");
  }
});

Template.alert.events({
  'click .close': function () {
    Session.set("alertType", null);
    Session.set("alertMessage", null);
  }
});
