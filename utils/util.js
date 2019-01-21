// 时间格式化输出，如3:25:19 86。每10ms都会调用一次
function dateformat(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);

  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);

  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;

  // 毫秒位，保留2位
  var micro_sec = Math.floor((micro_second % 1000) / 10);

  return [hr, min, sec].map(formatNumber);
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function remove_array(array, index) {
  for (var i = 0; i < array.length; i++) {
    var temp = array[i];
    if (!isNaN(index)) {
      temp = i;
    }
    if (temp == index) {
      for (var j = i; j < array.length; j++) {
        array[j] = array[j + 1];
      }
      array.length = array.length - 1;
    }
  }
  return array;
}


/** 
 *多个定时器
*/
function countdowns(that, total_micro_seconds, initCallback) {
  var clock = [];
  for (var i = 0; i < total_micro_seconds.length; i++) {
    var total_micro_second = total_micro_seconds[i];
    if (total_micro_second <= 0 || isNaN(total_micro_second)) {
      clock[i] = [0, 0, 0].map(formatNumber);
      if (that.timer != undefined) {
        // total_micro_seconds = remove_array(total_micro_seconds, i),
        initCallback(i);
      }
      continue;
    } else {
      clock[i] = dateformat(total_micro_second);
    }
  }
  

  that.setData({ clock: clock });

  if (total_micro_seconds.length < 1) {
    if (that.timer != undefined) {
      clearTimeout(that.timer);
    }
  }

  that.timer = setTimeout(function () {
    var temp_array = [];
    for (var i = 0; i < total_micro_seconds.length; i++) {
      var total_micro_second = total_micro_seconds[i] - 60;
      temp_array[i] = total_micro_second;
    }

    countdowns(that, temp_array, initCallback);
  }
    , 60);
}


function redirect(url){
  if (!url) return false;

  if (url == 'index' || url == 'groups' || url == 'orders' || url == 'personal') {
    wx.switchTab({
      "url": url
    });
  } else {

    var pages = getCurrentPages()    //获取加载的页面
    if (pages.length >= 3) {

      wx.redirectTo({
        "url": url
      })
      return true;
    }

    wx.navigateTo({
      "url": url,
    })
  }
}



module.exports = {
  countdowns: countdowns,
  redirect: redirect
}