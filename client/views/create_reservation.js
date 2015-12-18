Template.createReservation.events({
  'click #create': function (e, tmp) {
    e.preventDefault();
    var date = tmp.$('#date').val();
    var name = tmp.$('#guestName').val();
    var userId = Meteor.userId();
    var type = Session.get("type");

    date = date.split("-");
    var dateObj = new Date(date[0], date[1]-1, date[2]);
    var today = new Date();
    //don't var user reserve an already past date
    console.log(dateObj-today);
    if(dateObj - today < 0) {
      Session.set("alertMessage", "Date already past");
      Session.set("alertType", "danger");
      return false;
    }
    if(!date) {
      Session.set("alertMessage", "Need Date");
      Session.set("alertType", "danger");
    }
    if(!name) {
      Session.set("alertMessage", "Need Name");
      Session.set("alertType", "danger");
    }

    if(userId && dateObj && name) {
      Meteor.call('createReservation', userId, dateObj, name, type, function (err, res) {
        if(err) {
          if(err.error === "already-reserved") {
            Session.set("alertMessage", "Already reserved for that date");
            tmp.$('#date').val('');
          } else if(err.error === "too-many-dates") {
            Session.set("alertMessage", "Already reserved 7 dates");
          } else if(err.error === "next-period") {
            Session.set("alertMessage", "Can only reserve for current contact period");
          } else if(err.error === "already-passed") {
            Session.set("alertMessage", "Date already passed");
          } else {
            Session.set("alertMessage", "Failed to save");
          }
          Session.set("alertType", "danger");
        }
        if(res) {
          tmp.$('#date').val('');
          tmp.$('#guestName').val('');
          Session.set("showCreate", false);
        }
      });
    }
  }
});
