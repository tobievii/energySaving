/*********************************
 *该框架为阿尔里技术的内部框架,兼容ie9+*
 *********************************/

/*封装属性,函数部分*/

var doc = document,
    m_random = Math.random,
    m_floor = Math.floor,
    m_round = Math.round,
    m_ceil = Math.ceil;

//根据id获取元素
function getEleById(id) {
  return doc.getElementById(id);
}

//根据class获取元素
function getEleByCls(cls) {
  return doc.getElementsByClassName(cls);
}

//根据标签名获取元素
function getEleByTname(tagName) {
  return doc.getElementsByTagName(tagName);
}

//根据name获取元素
function getEleByName(name) {
  return doc.getElementsByName(name);
}

/**
 * 星级评分
 * @param rate:空白星星数
 * @return String
 */
function starRate(rate) {
  return '★★★★★☆☆☆☆☆'.slice(5 - rate, 10 - rate);
}

//随机生成字符串
function randomStrNoRepeat() {
  return (randomNumNoRepeat() + m_random()).toString(16).replace(/\./g, '');
}

//随机生成一串数字
function randomNumNoRepeat() {
  return toInt((new Date().getTime() + randomNum(0, 1000000) + '').slice(4));
}

//类数组转数组
function toArray(likeArr) {
  return [].slice.call(likeArr);
}

//数字金钱格式化
function parseMoney(num) {
  return (num + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//取整
function toInt(num) {
  return num | 0;
}

/**
 * 生成区间内的随机数,默认生成小数
 * @param min:最小数
 * @param max:最大数
 * @param bool:boolean值,true生成整数,false生成小数
 * @return Number
 */
function randomNum(min, max, bool) {
  min = min || 0;
  max = max || 100;
  return bool ? toInt(m_random() * (max - min + 1) + min)
      : m_random() * (max - min) + min;
}

/**
 * 数组去重(忽略类型)
 * @param arr:要去重的数组
 * @return Array
 */
function arrSet(arr) {
  var newArr = [],
      obj = {},
      item = null;

  for (var i = 0, len = arr.length; i < len; i++) {
    item = arr[i];
    if (item instanceof Array) {
      newArr.push(arrSet(item));
    } else {
      if (!obj[item]) {
        newArr.push(item);
        obj[item] = 1;
      }
    }
  }
  return newArr;
}

/**
 * 获取/设置样式,获取的样式默认带单位
 * @param ele:获取/设置样式的元素,默认body
 * @param obj:字符串/数组/对象
 * @param unit:boolean值,true不带单位,false带单位
 * @return String or Array
 */
function css(ele, obj, unit) {
  ele = ele || doc.body;
  obj = obj || ['position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom', 'border'];
  if (typeof obj === 'string') {//获取单个样式
    var style = ele.hasAttribute(obj) && ele[obj] || ele.style[obj] || window.getComputedStyle(ele)[obj];

    if (unit && style.indexOf('px') > 0 && style.indexOf(' ') < 0) {
      return +style.substr(0, style.indexOf('px'));
    } else {
      return style;
    }
  } else if (obj instanceof Array) {//获取多个样式
    var style = null,
        styleObj = {};

    for (var i = -1; obj[++i];) {
      style = ele.hasAttribute(obj[i]) && ele[obj[i]] || ele.style[obj[i]] || window.getComputedStyle(ele)[obj[i]];
      if (unit && style.indexOf('px') > 0 && style.indexOf(' ') < 0) {
        style = +style.substr(0, style.indexOf('px'));
      }
      styleObj[obj[i]] = style;
    }
    return styleObj;
  } else {//设置样式
    for (var item in obj) {
      ele.style[item] = obj[item];
    }
    return ele;
  }
}

/**
 * @return 数组形式的className
 */
Node.prototype.classes = function () {
  return this.className.split(' ');
}

/**
 * 给指定元素加一个类名,如果已存在则不添加
 * @param str:类名
 */
Node.prototype.addClass = function (str) {
  var classList = this.className !== '' ? this.className.split(' ') : [];

  if (classList.indexOf(str) < 0) {
    classList.push(str);
    this.className = classList.join(' ');
  }
}

/**
 * 删除指定元素的某一个类名,如果不存在则不删除
 * @param str:类名
 */
Node.prototype.delClass = function (str) {
  var classList = this.className.split(' ');

  if (classList.indexOf(str) >= 0) {
    for (var i = -1; classList[++i];) {
      if (classList[i] === str) {
        classList.splice(i, 1);
        if (classList.length === 0) {
          this.removeAttribute('class');
          return;
        }
      }
    }
    this.className = classList.join(' ');
  }
}

/**
 * 添加/删除指定元素的某一个类名
 * @param str:类名
 */
Node.prototype.toggleClass = function (str) {
  var classList = this.className.split(' ');

  if (classList.indexOf(str) >= 0) {
    this.delClass(str);
  } else {
    this.addClass(str);
  }
}

/**
 * 给长度不满足条件的字符串补位
 * @param str:原字符串
 * @param len:最终的字符串长度,默认为2
 * @param fill:填充物,默认填0
 * @param direction:往左/右填充,默认左边
 * @param bool:最终的字符串长度超出指定长度是否截取,true不截取,false截取,默认截取
 * @return String
 */
function fillStr(str, len, fill, direction, bool) {
  str = str + '' || '';
  len = len || 2;
  fill = fill || 0;

  while (str.length < len) {
    str = direction ? str + fill : fill + str;
  }
  return bool ? str : str.substr(0, len);
}

/**
 * 从网址中获取值,若网址不带值则返回网址
 */
function getHrefVal() {
  var str = window.location.href;

  if (str && str.indexOf('?') === 0) {
    str = str.slice(str.indexOf('?') + 1);
    var arr = str.split('&'),
        item = null,
        obj = {};

    for (var i = 0, len = arr.length; i < len; i++) {
      item = arr[i].split('=');
      obj[item[0]] = item[1];
    }
    return obj;
  } else {
    return str;
  }
}

/**
 * 日期格式化
 * @param obj.date:时间
 * @param obj.timestamp:时间戳
 * @param obj.format:日期格式,填写数字
 * @return String
 */
function dateFormat(obj) {
  obj = obj || {};
  var timestamp = obj.timestamp,
      oldDate = obj.date,
      date = new Date(oldDate || timestamp),
      year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate(),
      week = date.getDay(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds(),
      format = obj.format,
      newDate = '';

  month = fillStr(month + 1);
  day = fillStr(day);
  hour = fillStr(hour);
  min = fillStr(min);
  sec = fillStr(sec);
  switch (week) {
    case 0:
      week = '星期日';
      break;
    case 1:
      week = '星期一';
      break;
    case 2:
      week = '星期二';
      break;
    case 3:
      week = '星期三';
      break;
    case 4:
      week = '星期四';
      break;
    case 5:
      week = '星期五';
      break;
    case 6:
      week = '星期六';
      break;
  }
  switch (format) {
    case 1:
      newDate = year + '年' + month + '月' + day + '日 ' + hour + '时' + min + '分' + sec + '秒';
      break;
    case 2:
      newDate = year + '年' + month + '月' + day + '日 ' + hour + '时' + min + '分' + sec + '秒 ' + week;
      break;
    case 3:
      newDate = year + '年' + month + '月' + day + '日';
      break;
    case 4:
      newDate = hour + '时' + min + '分' + sec + '秒';
      break;
    case 5:
      newDate = hour + '时' + min + '分' + sec + '秒' + date.getMilliseconds() + '毫秒';
      break;
    case 6:
      newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      break;
    case 7:
      newDate = year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;
      break;
    default:
      newDate = year + '年' + month + '月' + day + '日 ' + hour + '时' + min + '分' + sec + '秒' + date.getMilliseconds() + '毫秒 ' + week;
      break;
  }
  return newDate;
}

/**
 * 计算时间差,第一个时间减第二个时间
 * @param date1:时间1
 * @param date2:时间2
 * @param unit:时间差的单位
 * @return Number
 */
function dateDiffe(date1, date2, unit) {
  if (!date1 && !date2) {
    return;
  }
  date1 = date1 || new Date().getTime();
  if (typeof date1 === 'string') {
    date1 = new Date(dateFormat({date: date1, format: 6})).getTime();
  }
  date2 = date2 || new Date().getTime();
  if (typeof date2 === 'string') {
    date2 = new Date(dateFormat({date: date2, format: 6})).getTime();
  }

  var different = date1 - date2;

  switch (unit) {
    case '年':
      different = different / 31536000000;
      break;
    case '月':
      different = different / 2592000000;
      break;
    case '日':
      different = different / 86400000;
      break;
    case '时':
      different = different / 3600000;
      break;
    case '分':
      different = different / 60000;
      break;
    case '秒':
      different = different / 1000;
      break;
    default:
      break;
  }
  return different;
}

/**
 * 快速排序
 * @param arr:要排序的数组
 */
function quickSort(arr) {
  arr = arr || [];
  var len = arr.length;
  if (len <= 1) {
    return arr;
  }

  var pivotIndex = Math.floor(len / 2),
      pivot = arr.splice(pivotIndex, 1)[0],//被删除的数作为基准点
      smallArr = [], //比基准点小的
      bigArr = []; //比基准点大的

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      smallArr.push(arr[i]);
    } else {
      bigArr.push(arr[i]);
    }
  }
  return quickSort(smallArr).concat([pivot], quickSort(bigArr));
}

/**
 * 统计每个字符在字符串/数组里出现的次数
 * @param obj:字符串/数组
 */
function charActiveCount(obj) {
  var res = {};
  obj = obj || [];

  if (typeof obj === 'string') {
    obj = obj.split('');
  }
  for (var i = -1; obj[++i];) {
    var item = obj[i];

    if (res[item]) {
      res[item]++;
    } else {
      res[item] = 1;
    }
  }
  return res;
}

/**
 * 深浅拷贝
 * @param obj:要拷贝的对象
 * @param deep:boolean值,true:深拷贝,false:浅拷贝
 * @return Array or Object
 */
function objCopy(obj, deep) {
  var o = obj instanceof Array ? [] : {};

  for (var item in obj) {
    var val = obj[item];

    if (deep && typeof val === 'object') {
      o[item] = objCopy(val, deep);
    } else {
      o[item] = val;
    }
  }
  return o;
}

/**
 * 获取兄弟节点
 * @param ele:已获取到的节点或获取的条件(如'.box','#box')
 * @return array或者document.body
 */
function brotherEles(ele) {
  var elem = null,
      eleArr = [],
      eleIdx = 0;

  if (ele.nodeType) {
    eleArr = toArray(ele.parentElement.children);
    eleIdx = [].indexOf.call(eleArr, ele);
    eleArr.splice(eleIdx, 1);
    return eleArr;
  } else if (typeof ele === 'string') {
    if (ele.indexOf('#') === 0) {
      elem = getEleById(ele.substr(1));

      if (elem) {
        eleArr = toArray(elem.parentElement.children);
        eleIdx = [].indexOf.call(eleArr, elem);
        eleArr.splice(eleIdx, 1);
      }
      return eleArr;
    } else {
      var arr = [];
      elem = ele.indexOf('.') === 0 ? getEleByCls(ele.substr(1)) : getEleByTname(ele);

      if (elem[1]) {
        for (var i = -1; elem[++i];) {
          eleArr = toArray(elem[i].parentElement.children);
          eleIdx = [].indexOf.call(eleArr, elem[i]);
          eleArr.splice(eleIdx, 1);
          arr.push(eleArr);
        }
        return arr;
      } else if (elem[0]) {
        eleArr = toArray(elem[0].parentElement.children);
        eleIdx = [].indexOf.call(eleArr, elem[0]);
        eleArr.splice(eleIdx, 1);
        return eleArr;
      }
    }
  } else {
    return toArray(doc.body.children);
  }
}

/**
 * 设置cookie
 * @param data.name:cookie的名称
 * @param data.value:cookie的值
 * @param data.time:cookie的到期时间(单位:小时)
 */
function setCookie(data) {
  if (data.join) {
    for (var i = 0; data[++i];) {
      setCookie(data[i]);
    }
  } else {
    doc.cookie = data.name + '=' + encodeURIComponent(data.value) + ';expires=' +
        new Date(new Date().getTime() + data.time * 60 * 60 * 1000).toGMTString();
  }
}

/**
 * 获取cookie
 * @param name:要获取的cookie的名称
 * @return String
 */
function getCookie(name) {
  return doc.cookie.match(new RegExp(name + '=([^;]+)'))[1];
}

/**
 * 删除cookie
 * @param name:要删除的cookie名称
 */
function delCookie(name) {
  setCookie({
    name: name,
    value: '',
    time: -1
  });
}

/**
 * 绑定多个元素,动态计算值
 * @param obj.parent:要绑定的元素的父级
 * @param obj.ele[0]:input
 * @param obj.ele[1]:带有值的任意元素
 * @param obj.target:显示最终值的元素
 * @param obj.symbol:运算符号
 */
function dataBind(obj) {
  var parent = obj.parent,
      ele1 = obj.ele[0],
      ele2 = obj.ele[1],
      target = obj.target,
      symbol = obj.symbol || '*',
      self = obj.self;

  if (!parent || !ele1 && !ele2) {
    console.error('dataBind函数必须指定父节点及一个子节点!');
    return;
  }
  if (typeof parent === 'string') {
    if (parent.indexOf('#') === 0) {
      parent = getEleById(parent.substr(1));
    } else if (parent.indexOf('.') === 0) {
      parent = getEleByCls(parent.substr(1))[0];
    } else {
      parent = getEleByTname(parent)[0];
    }
  }
  if (typeof ele1 === 'string') {
    if (ele1.indexOf('#') === 0) {
      ele1 = parent.getElementById(ele1.substr(1));
    } else if (ele1.indexOf('.') === 0) {
      ele1 = parent.getElementsByClassName(ele1.substr(1));
    } else {
      ele1 = parent.getElementsByTagName(ele1);
    }
  }
  if (typeof ele2 === 'string') {
    if (ele2 && ele2.indexOf('#') === 0) {
      ele2 = parent.getElementById(ele2.substr(1));
    } else if (ele2 && ele2.indexOf('.') === 0) {
      ele2 = parent.getElementsByClassName(ele2.substr(1));
    } else {
      ele2 = parent.getElementsByTagName(ele2);
    }
  }
  if (typeof target === 'string') {
    if (target && target.indexOf('#') === 0) {
      target = parent.getElementById(target.substr(1));
    } else if (target && target.indexOf('.') === 0) {
      target = parent.getElementsByClassName(target.substr(1));
    } else {
      target = parent.getElementsByTagName(target);
    }
  }
  if (!obj.ele2 && !obj.symbol) {
    for (var i = -1; ele1[++i];) {
      ele1[i].i = i;
      ele1[i].addEventListener('input', function () {
        target[this.i].innerText = this.value;
      });
    }
  } else {
    for (var i = -1; ele1[++i];) {
      ele1[i].i = i;
      ele1[i].addEventListener('input', function () {
        var i = this.i,
            ele1Val = +ele1[i].value.trim(),
            ele2Val = +ele2[i].innerText.trim(),
            tar = target[i];

        if (self) {
          switch (symbol) {
            case '+':
              tar.innerText = ele1Val + ele2Val;
              break;
            case '-':
              tar.innerText = ele1Val - ele2Val;
              break;
            case '*':
              tar.innerText = ele1Val * ele2Val;
              break;
            case '/':
              tar.innerText = ele1Val / ele2Val;
              break;
            case '%':
              tar.innerText = ele1Val % ele2Val;
              break;
            case '^':
              tar.innerText = ele1Val ^ ele2Val;
              break;
            case '&':
              tar.innerText = ele1Val & ele2Val;
              break;
            default:
              tar.innerText = window.eval(ele1Val + symbol + ele2Val);
              break;
          }
        } else {
          var total = 0;

          for (var i = -1; ele2[++i];) {
            total += +ele2[i].innerText.trim();
          }
          target[0].innerText = total;
        }
      });
    }
  }
}

/**
 * 发送XMLHttpRequest请求
 * @param obj.url:请求路径
 * @param obj.method:请求类型,默认POST
 * @param obj.async:异步(默认)/同步(false)
 * @param obj.data:可传参数{...}
 * @param obj.dataType:success函数接受的参数类型
 * @param obj.success:请求成功后执行的函数
 * @param obj.done:无论请求成功还是失败都要执行的函数
 */
function ajax(obj) {
  var xhr = new XMLHttpRequest(),
      url = obj.url,
      method = obj.method,
      async = obj.async,
      data = obj.data,
      dataType = obj.dataType,
      success = obj.success,
      params = [];

  if (url && typeof url === 'string') {
    async = async === undefined ? true : async;
    if (data) {
      for (var item in data) {
        params.push(encodeURI(item) + '=' + encodeURI(data[item]));
      }
    }
    params.push(encodeURI('timestamp') + '=' + encodeURI(new Date().getTime()));
    params = params.join('&');
    if (method === 'get' || method === 'GET') {
      xhr.open('GET', url + '?' + params, async);
      xhr.send(null);
    } else {
      xhr.open('POST', url, async);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
      xhr.send(params);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (success) {
            if (dataType === 'json') {
              success(JSON.parse(xhr.responseText));
            } else {
              success(xhr.responseText);
            }
          }
        }
        obj.done && obj.done(xhr);
        xhr.onreadystatechange = null;
      }
    }
  } else {
    console.error('ajax函数的url参数错误!');
  }
}

//正则验证姓名
function checkName(name, ele, msg) {
  name = name.replace(/\s/g, '');
  msg = msg || '姓名格式不正确';

  if (typeof ele === 'string') {
    if (ele.indexOf('#') === 0) {
      ele = getById(ele.substr(1));
    } else if (ele.indexOf('.') === 0) {
      ele = getEleByCls(ele.substr(1))[0];
    } else {
      ele = getEleByTname(ele)[0];
    }
  }
  if (/^[\u4E00-\u9FA5]{2,4}$/.test(name)) {
    ele.innerText = '';
    return name;
  } else {
    ele.innerText = msg;
    return false;
  }
}

//正则验证身份证号
function checkID(id, ele, msg) {
  id = id.replace(/\s/g, '');
  msg = msg || '身份证号格式不正确';

  if (typeof ele === 'string') {
    if (ele.indexOf('#') === 0) {
      ele = getById(ele.substr(1));
    } else if (ele.indexOf('.') === 0) {
      ele = getEleByCls(ele.substr(1))[0];
    } else {
      ele = getEleByTname(ele)[0];
    }
  }
  if (/^[1-9]\d{7}((0\d)|(1[0-2]))(([012]\d)|3[01])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([012]\d)|3[01])\d{3}([0-9]|X)$/.test(id)) {
    ele.innerText = '';
    return id;
  } else {
    ele.innerText = msg;
    return false;
  }
}

//正则验证手机号码
function checkPhone(phone, ele, msg) {
  phone = phone.replace(/\s/g, '');
  msg = msg || '手机号格式不正确';

  if (typeof ele === 'string') {
    if (ele.indexOf('#') === 0) {
      ele = getById(ele.substr(1));
    } else if (ele.indexOf('.') === 0) {
      ele = getEleByCls(ele.substr(1))[0];
    } else {
      ele = getEleByTname(ele)[0];
    }
  }
  if (/^(13[0-9])|(14[57])|(15[0-35-9])|(16[6])|(17[035-8])|(18[0-9])|(19[89])\d{8}$/.test(phone)) {
    ele.innerText = '';
    return phone;
  } else {
    ele.innerText = msg;
    return false;
  }
}

/*兼容部分*/

//请求动画帧
window.requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

//添加事件监听者
function addEvtListener(ele, evt, fn, bool) {
  if (ele.addEventListener) {
    ele.addEventListener(evt, fn, bool);
  } else {
    ele.attachEvent('on' + evt, fn);
  }
}

//鼠标滚轮事件
function mousewheelEvt(ele, fn, bool) {
  if (ele.addEventListener) {
    if (ele.onmousewheel) {
      ele.addEventListener('mousewheel', fn, bool);
    } else {
      ele.addEventListener('DOMMouseScroll', fn, bool);
    }
  } else {
    ele.attachEvent('onmousewheel', function () {
      fn.call(ele);
    });
  }
}