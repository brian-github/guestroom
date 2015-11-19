Meteor.methods({
  createReservation: function (userId, date, guestName) {
    check(userId, String);
    // check(date, Date);
    check(guestName, String);
    let count = Reservations.find({userId: userId}).count();
    if(count < 7) {
      return Reservations.insert({
        userId: userId,
        date: date,
        guestName: guestName
      });
    } else {
      throw new Meteor.Error("too-many-dates");
    }
  },
  cancelReservation: function (userId, resId) {
    check(userId, String);
    check(resId, String);
    let res = Reservations.findOne({_id: resId});
    if(userId === res.userId) {
      return Reservations.remove({_id: resId});
    } else {
      throw new Meteor.Error("access-denied");
    }
  },
  addToWaitList: function (userId, date) {
    check(userId, String);
    check(date, String);
  },
  removeFromWaitList: function (userId, date) {
    check(userId, String);
    check(date, String);
  },
  confirmReservation: function (userId, date) {
    check(userId, String);
    check(date, String);
  },
  setName: function (userId, first, last) {
    check(userId, String);
    check(first, String);
    check(last, String);
    Meteor.users.update({_id: userId}, {$set: {"profile.firstName": first, "profile.lastName": last}});
  }
});

function sendReminderEmail () {
    let now = new Date();
    now.setDate(now.getDate()+7);
    now.setHours(0,0,0,0);
    let res = Reservations.findOne({date: now});
    let user = Meteor.users.findOne({_id: res.userId});
    if(res && user) {
      Email.send({
        to: user.emails[0].address,
        from: "noreply@hip.coop",
        subject: "Guest Room Reminder",
        text: "Reminder that you have the guest room booked on " + res.date +". If you no longer need it, please log in and cancel."
      });
    }
}

Meteor.startup(function() {
    Meteor.setInterval(sendReminderEmail, 86400000);
});
