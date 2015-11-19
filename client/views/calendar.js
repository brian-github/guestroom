Template.calendar.helpers({
  events: function() {
    var fc = $('.fc');
    return function(start, end, tz, callback) {
      Meteor.subscribe('reservations', start.toDate(), end.toDate(), 'America/Los_Angeles', function() {
        fc.fullCalendar('refetchEvents');
      });
      var events = Reservations.find().fetch().map(function(it) {
        var color = function () {
          if(it.userId === Meteor.userId()) return "#446CB3";
          else return "#67809F";
        }
        return {
          title: getName(it.userId),
          start: it.date,
          allDay: true,
          id: it._id,
          color: color()
        };
      });
      callback(events);
    }
  },
  onEventClicked: function() {
    return function(calEvent, jsEvent, view) {
      var resId = calEvent.id;
      Session.set("selectedRes", resId);
    }
  },
  onDayClicked: function() {
    return function(date, jsEvent, view) {
      Session.set("showCreate", true);
      $('#date').val(date);
    }
  }
});

function getName(userId) {
  if(userId === Meteor.userId()) return "You";
  else return Meteor.users.findOne({
    _id: userId
  }).profile.firstName || userId;
}

Template.calendar.rendered = function() {
  var fc = this.$('.fc');
  this.autorun(function() {
    var res = Reservations.find().fetch();
    fc.fullCalendar('refetchEvents');
  });
}
