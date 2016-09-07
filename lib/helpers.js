DAY_LIMIT = 3;

var spring = [0,1,2,3,4];
var summer = [5,6,7];
var fall = [8, 9, 10, 11];

contractStart = function () {
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

contractEnd = function () {
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
