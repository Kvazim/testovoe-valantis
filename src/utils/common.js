import dayjs from 'dayjs';
import { DateTime } from '../const';
import { PASSWORD } from '../const';
import md5 from 'md5'

export const getAuthToken = () => {
  const timestamp = dayjs().format(DateTime.YearMonthDay);
  return md5(`${PASSWORD}_${timestamp}`);
};
