Template.createReservation.events({
  'click #create': function (e, tmp) {
    e.preventDefault();
    let date = tmp.$('#date').val();
    let name = tmp.$('#guestName').val();
    let userId = Meteor.userId();

    date = date.split("-");
    let dateObj = new Date(date[0], date[1]-1, date[2]);
    if(!date) {
      Session.set("alertMessage", "Need Date");
      Session.set("alertType", "danger");
    }
    if(!name) {
      Session.set("alertMessage", "Need Name");
      Session.set("alertType", "danger");
    }

    if(userId && date && name) {
      Meteor.call('createReservation', userId, dateObj, name, function (err, res) {
        if(err) {
          Session.set("alertMessage", "Failed to save");
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
