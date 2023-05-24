const generics = {
  monthsOfTheYear: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  getDateTimeDetails(dateTime = new Date().toString()) {
    // check whether there's a space before PM/pm/AM/am
    let d = !dateTime.match(/(\s)(PM|pm|AM|am)$/)
      ? dateTime.replace(/(PM|pm|AM|am)$/, ' $1')
      : dateTime;

    const date = new Date(d);
    let [dd, mm, mmm, yyyy, hours, minutes, seconds, milliseconds] = [
      (date.getDate() < 10 ? '0' : '') + date.getDate(),
      (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1),
      this.monthsOfTheYear[
        parseInt((date.getMonth() < 10 ? '0' : '') + date.getMonth())
      ],
      date.getFullYear() + '',
      (date.getHours() < 10 ? '0' : '') + date.getHours(),
      (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
      (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(),
      (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds(),
    ];

    let yyyymmdd = `${yyyy}${mm}${dd}`;
    let ddmmyyyy = `${dd}${mm}${yyyy}`;
    let yyyymmddhhmmss = `${yyyy}${mm}${dd}${hours}${minutes}${seconds}`;
    let ddmmyyyyhhmmss = `${dd}${mm}${yyyy}${hours}${minutes}${seconds}`;

    return {
      dd,
      mm,
      mmm,
      yyyy,
      hours,
      minutes,
      seconds,
      milliseconds,
      yyyymmdd,
      ddmmyyyy,
      yyyymmddhhmmss,
      ddmmyyyyhhmmss,
    };
  },

  recursivelyFlattenArray: function (arrayToFlatten, flattenedArray = []) {
    arrayToFlatten.forEach((el) => {
      flattenedArray.push(el);
      if (el.children.length) {
        const arrCopy = el.children;
        this.recursivelyFlattenArray(arrCopy, flattenedArray);
        // el.children.length = 0;
      }
    });

    return flattenedArray;
  },
};

export default generics;
