Meteor.subscribe('reservations');

Template.calendar.helpers({
  options: function () {
    let events = [];
    reservations = Reservations.find().fetch();
    _.each(reservations, function (event) {
       events.push({
          title: event.userId,
          start: event.date,
          allDay: true
       });
    });
    return {
      events: events
    }
  }
});

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
  }
});

Template.calendar.rendered = function () {
  var fc = this.$('.fc');
  this.autorun(function () {
    var res = Reservations.find().fetch();
    fc.fullCalendar('refetchEvents');
  });
}
