var tools=(function(){var toolsObj={renderPopup:function(festival,obj,str){var title=obj.querySelector('.title')
var date=obj.querySelector('.date')
var lunar=obj.querySelector('.lunar')
var dateFormat=tools.strFormatDate(str)
var lunarObj=ChineseCalendar.date2lunar(dateFormat);console.log(dateFormat)
title.innerHTML=festival.innerHTML
date.innerHTML=dateFormat.getFullYear()+'年'+(dateFormat.getMonth()+1)+'月'+dateFormat.getDate()+'日'
lunar.innerHTML=lunarObj.lunarMonthChiness+lunarObj.lunarDayChiness+'  ·  '+lunarObj.gzY+'年'+lunarObj.gzM+'月'+lunarObj.gzD+'日'},renderDay:function(year,n){var year=year
var month=n
var firstDay=new Date(year,n,1)
var _hmtl=``
for(var i=0;i<42;i++){var allDay=new Date(year,month,i+1-firstDay.getDay());var allDay_str=tools.returnDateStr(allDay)
var firstDay_str=tools.returnDateStr(firstDay)
var first_lunarday=ChineseCalendar.date2lunar(allDay).lunarDayChiness
var lunarJanuary_month=ChineseCalendar.date2lunar(allDay).lunarMonthChiness
if(tools.returnDateStr(new Date())===allDay_str){if(first_lunarday=='初一'){if(lunarJanuary_month=='正月'){_hmtl+=`<li data-time="${allDay_str}" class="cur-day lunar-january">${allDay.getDate()}</li>`}else{_hmtl+=`<li data-time="${allDay_str}" class="cur-day lunar-first">${allDay.getDate()}</li>`}}else{_hmtl+=`<li data-time="${allDay_str}" class="cur-day">${allDay.getDate()}</li>`}}else if(firstDay_str.substr(0,6)===allDay_str.substr(0,6)){if(first_lunarday=='初一'){if(lunarJanuary_month=='正月'){_hmtl+=`<li data-time="${allDay_str}" class="cur-month lunar-january">${allDay.getDate()}</li>`}else{_hmtl+=`<li data-time="${allDay_str}" class="cur-month lunar-first">${allDay.getDate()}</li>`}}else{_hmtl+=`<li data-time="${allDay_str}" class="cur-month">${allDay.getDate()}</li>`}}else{if(first_lunarday=='初一'){if(lunarJanuary_month=='正月'){_hmtl+=`<li data-time="${allDay_str}" class="lunar-january">${allDay.getDate()}</li>`}else{_hmtl+=`<li data-time="${allDay_str}" class="lunar-first">${allDay.getDate()}</li>`}}else{_hmtl+=`<li data-time="${allDay_str}">${allDay.getDate()}</li>`}}}
return _hmtl},renderDetailMonth:function(dayWrapper,recivedYear,recivedMonth){var array=[]
var recivedDate=new Date()
var _html=``
var date=new Date(recivedYear,recivedMonth,1)
date.setDate(1)
var week=date.getDay()
date.setDate(1-week)
var month=date.getMonth()
for(var i=0;i<42;i++){if(month!==recivedMonth){if(date.getDay()===0||date.getDay()===6){array.push({day:date.getDate(),first_lunarday:ChineseCalendar.lunarTime(date),lunar:ChineseCalendar.date2lunar(date).lunarMonthChiness,state:'weekend',festival:ChineseCalendar.lunarFestival(date),term:ChineseCalendar.lunarTerm(date),dateStr:tools.returnDateStr(date)})}else{array.push({day:date.getDate(),first_lunarday:ChineseCalendar.lunarTime(date),lunar:ChineseCalendar.date2lunar(date).lunarMonthChiness,state:'',festival:ChineseCalendar.lunarFestival(date),term:ChineseCalendar.lunarTerm(date),dateStr:tools.returnDateStr(date)})}}else if(tools.curDay(date,recivedDate)){if(date.getDay()===0||date.getDay()===6){array.push({day:date.getDate(),first_lunarday:ChineseCalendar.lunarTime(date),lunar:ChineseCalendar.date2lunar(date).lunarMonthChiness,state:'weekend cur-day',festival:ChineseCalendar.lunarFestival(date),term:ChineseCalendar.lunarTerm(date),dateStr:tools.returnDateStr(date)})}else{array.push({day:date.getDate(),first_lunarday:ChineseCalendar.lunarTime(date),lunar:ChineseCalendar.date2lunar(date).lunarMonthChiness,state:'cur-day',festival:ChineseCalendar.lunarFestival(date),term:ChineseCalendar.lunarTerm(date),dateStr:tools.returnDateStr(date)})}}else{if(date.getDay()===0||date.getDay()===6){array.push({day:date.getDate(),first_lunarday:ChineseCalendar.lunarTime(date),lunar:ChineseCalendar.date2lunar(date).lunarMonthChiness,state:'weekend cur-month',festival:ChineseCalendar.lunarFestival(date),term:ChineseCalendar.lunarTerm(date),dateStr:tools.returnDateStr(date)})}else{array.push({day:date.getDate(),first_lunarday:ChineseCalendar.lunarTime(date),lunar:ChineseCalendar.date2lunar(date).lunarMonthChiness,state:'cur-month',festival:ChineseCalendar.lunarFestival(date),term:ChineseCalendar.lunarTerm(date),dateStr:tools.returnDateStr(date)})}}
date.setDate(date.getDate()+1)
month=date.getMonth()}
console.log(array);for(var j=0;j<array.length;j++){var festival_state=array[j].festival?'festival show':'festival'
var term_state=array[j].term?'term show':'term'
var first_lunarday=array[j].first_lunarday=='初一'?array[j].lunar+array[j].first_lunarday:array[j].first_lunarday
if(array[j].first_lunarday=='初一'){if(array[j].lunar=='正月'&&array[j].state!==''){var lunar_state='lunar first-lunarJanuary'}else{var lunar_state='lunar first-lunarday'}}else{var lunar_state='lunar'}
_html+=`<li data-time="${array[j].dateStr}" class="${array[j].state}">
                    <p class="info">
                      <span class="${lunar_state}">${first_lunarday}</span>
                      <span class="date"><em>${array[j].day}</em>日</span>
                    </p>
                    <p class="${festival_state}">${array[j].festival}</p>
                    <p class="${term_state}">${array[j].term}</p>
                  </li>`}
dayWrapper.innerHTML=_html},nowDate:function(){return new Date()},returnDateStr:function(date){var year=date.getFullYear();var month=date.getMonth()+1;var day=date.getDate();month=month<=9?('0'+month):(''+month);day=day<=9?('0'+day):(''+day);return year+month+day;},curDay:function(oldTime,nowTime){return oldTime.getFullYear()===nowTime.getFullYear()&&oldTime.getMonth()===nowTime.getMonth()&&oldTime.getDate()===nowTime.getDate()},strFormatDate:function(str){var date=new Date(parseInt(str.substr(0,4)),parseInt(str.substr(4,2)),parseInt(str.substr(6)))
console.log(str)
return date}}
return toolsObj}())