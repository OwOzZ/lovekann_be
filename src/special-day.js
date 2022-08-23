const { specialDay } = require("./constant");

function getSpecialDayData() {
  const curDate = new Date();
  const aDay = 1000 * 60 * 60 *24;
  //计算周年纪念日
  const inLoveDate = new Date(specialDay.inLoveDay);
  const inLoveTsDiff = curDate.getTime() - inLoveDate.getTime();
  const inloveDayDiff = Math.floor(inLoveTsDiff / 1000 / 60 / 60 / 24);

  // 计算女朋友生日
  var birthdayDate = new Date(`${curDate.getFullYear()}-${specialDay.gfBirthday}`);
  var birthdayTsDiff = birthdayDate.getTime() - curDate.getTime();
  if (birthdayTsDiff <= -aDay) {
    birthdayDate = new Date(`${curDate.getFullYear() + 1}-${specialDay.gfBirthday}`);
    birthdayTsDiff = birthdayDate.getTime() - curDate.getTime();
  }
  const birthdayDayDiff = Math.floor(birthdayTsDiff / 1000 / 60 / 60 / 24);

  return {
    inloveDayDiff,
    birthdayDayDiff
  }
}

module.exports = {
  getSpecialDayData
}