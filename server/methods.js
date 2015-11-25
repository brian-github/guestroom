Meteor.methods({
  createReservation: function (userId, date, guestName, type) {
    check(userId, String);
    check(date, Date);
    check(guestName, String);
    check(type, String);

    if(date < new Date()) {
      throw new Meteor.Error("already-passed");
    }

    if(date > contractEnd()) {
      throw new Meteor.Error("next-period");
    }

    if(type === "guestroom") {
      let count = Reservations.find({
        userId: userId,
        type: "guestroom",
        date: {
          $gte: contractStart(),
          $lte: contractEnd()
        }
      }).count();
      let dateCheck = Reservations.findOne({"date": date, type: "guestroom"});
      if (dateCheck) {
        throw new Meteor.Error("already-reserved");
      }
      if(count < 7) {
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
        let count = Reservations.find({
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
    let res = Reservations.findOne({_id: resId});
    if(userId === res.userId) {
      return Reservations.remove({_id: resId});
    } else {
      throw new Meteor.Error("access-denied");
    }
  },
  adminCancelReservation: function (userId, resId) {
    check(userId, String);
    check(resId, String);
    let user = Meteor.users.findOne({_id: userId});
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
    let now = new Date();
    let weekFromNow = now.setDate(now.getDate()+7);
    weekFromNow.setHours(0,0,0,0);
    let res = Reservations.findOne({date: weekFromNow});
    let user = Meteor.users.findOne({_id: res.userId});
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
  let date = new Date();
  let month = date.getMonth() + 1;
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
  let date = new Date();
  let month = date.getMonth() + 1;
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
