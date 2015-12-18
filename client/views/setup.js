Template.setup.events({
  'click #saveProfile': function (e, tmp) {
    e.preventDefault();
    var first = tmp.$('#firstName').val();
    var last = tmp.$('#lastName').val();
    var userId = Meteor.userId();

    if(!first || !last) {
      Session.set("alertMessage", "Need Name");
      Session.set("alertType", "danger");
      return false;
    }

    if(first && last && userId) {
      Meteor.call('setName', userId, first, last, function (err, res) {
        if(err) {

        }
        if(res) {

        }
      });
    }
  }
});
