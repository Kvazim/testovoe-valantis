import dayjs from 'dayjs';
import { DateTime } from '../const';
import { PASSWORD } from '../const';
import md5 from 'md5'

export function getCurrentUTCDateWithoutDelimiter() {
    const now = new Date();
    const year = String(now.getUTCFullYear());
    let month = String(now.getUTCMonth() + 1);
    month = month < '10' ? `0${month}` : month;
    let day = String(now.getUTCDate());
    day = day < '10' ? `0${day}` : day;
    return `${year}${month}${day}`;
  }

  export const getAuhToken = () => {
    const timestamp = dayjs().format(DateTime.YearMonthDay);
    return md5(`${PASSWORD}_${timestamp}`);
  };
