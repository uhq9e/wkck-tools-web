export type Birthday = [month: number, day: number];

export function calcNextHalfwayBirthday(b1: Birthday, b2: Birthday): Date {
  const today = new Date();
  const currentYear = today.getFullYear();

  let date = calcHalfwayBirthday(
    new Date(currentYear, b1[0] - 1, b1[1]),
    new Date(currentYear, b2[0] - 1, b2[1])
  );

  while (date < today) {
    date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
  }

  return date;
}

export function calcHalfwayBirthday(b1: Date, b2: Date): Date {
  if (b1 > b2) {
    [b1, b2] = [b2, b1];
  }

  const midTimestamp = (b1.getTime() + b2.getTime()) / 2;
  return new Date(midTimestamp);
}

export function diffYMDHMS(from: Date, to: Date) {
  if (to < from) [from, to] = [to, from];

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  if (hours < 0) {
    hours += 24;
    days--;
  }

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

export function getRemainingTime(targetDate: Date) {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}
