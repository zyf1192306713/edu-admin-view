// 将数据库DateTime类型转换为 0000-00-00 00:00:00 格式
export function dateFormat(dateTime) { 
    var span = Date.parse(dateTime)
    var dt = new Date(span)
    var timeStr = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    return timeStr;
 }