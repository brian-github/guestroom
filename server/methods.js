Meteor.methods({
  createReservation: function (userId, date, guestName, type) {
    check(userId, String);
    check(date, Date);
    check(guestName, String);
    check(type, String);

    //
    if(date < new Date(new Date().setDate(new Date().getDate()-1))) {
      throw new Meteor.Error("already-passed");
    }

    if(date > contractEnd()) {
      throw new Meteor.Error("next-period");
    }

    if(type === "guestroom") {
      var count = Reservations.find({
        userId: userId,
        type: "guestroom",
        date: {
          $gte: contractStart(),
          $lte: contractEnd()
        }
      }).count();
      var dateCheck = Reservations.findOne({"date": date, type: "guestroom"});
      if (dateCheck) {
        throw new Meteor.Error("already-reserved");
      }
      //limit 3 per semester
      if(count < DAY_LIMIT) {
        return Reservations.insert({
          userId: userId,
          date: date,
          guestName: guestName,
          type: type
        });
      } else {
        throw new Meteor.Error("too-many-dates");
      }
    }

    if(type === "basement") {
        var count = Reservations.find({
          type: "basement",
          "date": date
        }).count();
        if(count < 2) {
          return Reservations.insert({
            userId: userId,
            date: date,
            guestName: guestName,
            type: type
          });
        } else {
          throw new Meteor.Error("already-reserved");
        }
    }

  },
  cancelReservation: function (userId, resId) {
    check(userId, String);
    check(resId, String);
    var res = Reservations.findOne({_id: resId});
    if(userId === res.userId) {
      if(res.date < new Date()) {
        throw new Meteor.Error("already-passed");
      } else {
        return Reservations.remove({_id: resId});
      }
    } else {
      throw new Meteor.Error("access-denied");
    }
  },
  adminCancelReservation: function (userId, resId) {
    check(userId, String);
    check(resId, String);
    var user = Meteor.users.findOne({_id: userId});
    if(user.profile.isAdmin) {
      return Reservations.remove({_id: resId});
    }
  },
  setName: function (userId, first, last) {
    check(userId, String);
    check(first, String);
    check(last, String);
    Meteor.users.update({_id: userId}, {$set: {"profile.firstName": first, "profile.lastName": last}});
  }
});

function sendReminderEmail () {
    var now = new Date();
     weekFromNow = now.setDate(now.getDate()+7);
    var date = new Date(weekFromNow);
    date.setHours(0,0,0,0);
    var res = Reservations.findOne({date: weekFromNow});
    var user = Meteor.users.findOne({_id: res.userId});
    if(res && user && user.emails[0]) {
      Email.send({
        to: user.emails[0].address,
        from: "noreply@hip.coop",
        subject: "Guest Room Reminder",
        text: "Reminder that you have the guest room booked on " + res.date +". If you no longer need it, please log in and cancel."
      });
    }
}

var spring = [0,1,2,3,4];
var summer = [5,6,7];
var fall = [8, 9, 10, 11];

function contractStart () {
  var date = new Date();
  var month = date.getMonth() + 1;
  if(_.indexOf(spring, month) !== -1) {
    return new Date(date.getFullYear(), 0,0);
  }
  if(_.indexOf(summer, month) !== -1) {
    return new Date(date.getFullYear(), 5,0);
  }
  if(_.indexOf(fall, month) !== -1) {
    return new Date(date.getFullYear(), 8,0);
  }
}

function contractEnd () {
  var date = new Date();
  var month = date.getMonth() + 1;
  if(_.indexOf(spring, month) !== -1) {
    return new Date(date.getFullYear(), 5,0);
  }
  if(_.indexOf(summer, month) !== -1) {
    return new Date(date.getFullYear(), 8,0);
  }
  if(_.indexOf(fall, month) !== -1) {
    return new Date(date.getFullYear(), 12,0);
  }
}

Meteor.startup(function() {
    if(Meteor.users.find().count() === 0) {
      Accounts.createUser({
        username: "hm",
        email: "hiphm@bsc.coop",
        password: "admin",
        profile: {
          firstName: "House",
          lastName: "Manager",
          isAdmin: true
        }
      });
    }
    Meteor.setInterval(sendReminderEmail, 10799999);
});
