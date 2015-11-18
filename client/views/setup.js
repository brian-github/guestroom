Template.setup.events({
  'click #saveProfile': function (e, tmp) {
    e.preventDefault();
    let first = tmp.$('#firstName').val();
    let last = tmp.$('#lastName').val();
    let userId = Meteor.userId();

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
