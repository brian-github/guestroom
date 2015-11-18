Template.calendar.helpers({
  events: function () {
    var fc = $('.fc');
    return function (start, end, tz, callback) {
      Meteor.subscribe('reservations', start.toDate(), end.toDate(), 'America/Los_Angeles', function () {
        fc.fullCalendar('refetchEvents');
      });
      var events = Reservations.find().fetch().map(function (it) {
              return {
                  title: it.userId,
                  start: it.date,
                  allDay: true
              };
          });
      callback(events);
    }
  }
});
