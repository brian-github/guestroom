Template.createReservation.events({
  'click #create': function (e, tmp) {
    e.preventDefault();
    let date = tmp.$('#date').val();
    let name = tmp.$('#guestName').val();
    let userId = Meteor.userId();

    date = date.split("-");
    let dateObj = new Date(date[0], date[1]-1, date[2]);
    let today = new Date();
    //don't let user reserve an already past date
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
      Meteor.call('createReservation', userId, dateObj, name, function (err, res) {
        if(err) {
          if(err.error === "already-reserved") {
            Session.set("alertMessage", "Already reserved for that date");
            tmp.$('#date').val('');
          } else if(err.error === "too-many-dates") {
            Session.set("alertMessage", "Already reserved 7 dates");
          }
          else {
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
