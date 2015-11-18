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
                  allDay: true
              };
          });
      callback(events);
    }
  }
});

function getName(userId) {
  return Meteor.user().profile.firstName || userId;
}

Template.calendar.rendered = function () {
  var fc = this.$('.fc');
  this.autorun(function () {
    var res = Reservations.find().fetch();
    fc.fullCalendar('refetchEvents');
  });
}
