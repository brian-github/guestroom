Meteor.methods({
  createReservation: function (userId, date, guestName) {
    check(userId, String);
    // check(date, Date);
    console.log(date);

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
  cancelReservation: function (userId, date) {
    check(userId, String);
    check(date, String);

    if(Meteor.userId() === userId) {
      return Reservations.remove({userId: userId, date: date});
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
