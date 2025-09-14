const weekDayMap = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
};

// 课表日期数据配置
export const COURSE_CONFIG = {
  start_date: '2025-09-08',
  end_date: '2025-02-10',
  start_month: 9,
  start_day: 8,
  disDay: getDaysSinceYearStart('2025-09-08'),
};

export const timeStampMap = {
  第一大节: '8:30 10:00',
  第二大节: '10:20 11:50',
  第三大节: '14:00 15:30',
  第四大节: '15:50 17:20',
  第五大节: '18:40 20:10',
  第六大节: '20:20 21:50',
};

function genMonthMap() {
  const defaultMonthMap = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  let year = new Date().getFullYear();

  if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
    defaultMonthMap[2] = 29;
  }
  return defaultMonthMap;
}
export var monthMap = genMonthMap();

export class Time {
  public static readonly ONE_SECOND = 1;
  public static readonly ONE_MINUTE = 60 * Time.ONE_SECOND;
  public static readonly ONE_HOUR = 60 * Time.ONE_MINUTE;
  public static readonly ONE_DAY = 24 * Time.ONE_HOUR;
  public static readonly ONE_WEEK = 7 * Time.ONE_DAY;
  public static readonly ONE_MONTH = 30 * Time.ONE_DAY;
  public static readonly ONE_YEAR = 365 * Time.ONE_DAY;
}

export function getDaysSinceYearStart(date: string) {
  // 创建当前日期的对象
  const currentDate = new Date(date); // 注意：月份是从0开始计数的

  // 创建今年第一天的日期对象
  const yearStart = new Date(currentDate.getFullYear(), 0, 1);

  // 计算两个日期之间的毫秒数差异
  const diffMilliseconds = currentDate.getTime() - yearStart.getTime();

  // 将毫秒数转换为天数
  // 加1是因为我们从1月1日开始算起
  return Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24)) + 1;
}

export function calcTotal(date) {
  const { month, day } = date;
  let result = 0;
  for (let d = 0; d < month; d++) {
    result += monthMap[d + 1];
  }
  result += day;
  return result;
}
export function getCurrentDate(data) {
  const date = new Date();
  // debugger;
  if (data) {
    date.setFullYear(data.year || date.getFullYear());
    if (data.month >= 13) {
      date.setFullYear(date.getFullYear() + 1);
      date.setMonth(data.month - 13);
      date.setDate(data.day);
    } else {
      date.setFullYear(data.year || date.getFullYear());
      date.setMonth(data.month - 1);
      date.setDate(data.day);
    }
  } else {
    // date.setMonth(date.getMonth() + 1);
  }
  const month = date.getMonth();
  const day = date.getDate();
  const weekDay = date.getDay();
  const d = {
    month,
    day,
  };
  if (month === 12) {
    // debugger
  }
  let week = calcTotal(d) - COURSE_CONFIG.disDay;
  let index = Math.floor(week / 7) + 1;
  return {
    week: index,
    weekStr: `第${index}周`,
    weekDay: `${weekDayMap[weekDay]}`,
  };
}
// 获取字符串日期
export function getDateString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // 格式2025年5月18日
  return {
    date: `${year}年${month}月${day}日`,
    year,
    month,
    day,
  };
}
