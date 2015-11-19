Template.calendar.helpers({
  events: function () {
    var fc = $('.fc');
    return function (start, end, tz, callback) {
      Meteor.subscribe('reservations', start.toDate(), end.toDate(), 'America/Los_Angeles', function () {
        fc.fullCalendar('refetchEvents');
      });
      var events = Reservations.find().fetch().map(function (it) {
              return {
                  title: getName(it.userId),
                  start: it.date,
                  allDay: true,
                  id: it._id
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
  }
});

function getName(userId) {
  return Meteor.users.findOne({_id: userId}).profile.firstName || userId;
}

Template.calendar.rendered = function () {
  var fc = this.$('.fc');
  this.autorun(function () {
    var res = Reservations.find().fetch();
    fc.fullCalendar('refetchEvents');
  });
}
