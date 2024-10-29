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
