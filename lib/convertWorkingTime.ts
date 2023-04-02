import { WorkingTime, WorkingTimeForEdit, WorkingTimeForBar } from "../types/type"
import dateToStr from "./dateToStr"

// Bar.tsxで使うためにデータベースから取り出したWorkingTimeの内容を変える
export function convertWorkingTimeForBar(workingTime: WorkingTime): WorkingTimeForBar {
    const { begin, beginText, end, endText } = convertRawWorkingTime(workingTime.begin, workingTime.end)
    const diff = end.getTime() - begin.getTime()
    const minuteIncludeHour = Math.floor(diff/60000)
    const hour = Math.floor(minuteIncludeHour/60)
    const minute = minuteIncludeHour - (hour * 60)
    const workingTimeForBar: WorkingTimeForBar = {
        id: workingTime.id,
        employee_number: workingTime.employee_number,
        name: workingTime.name,
        begin: beginText !== "NaN:NaN" ? beginText : "未入力",
        end: endText !== "NaN:NaN" ? endText : "未入力",
        workHours: !isNaN(hour) ? `${hour}時間${minute}分` : "",
        isOverWork: hour > 8 ? true : false
    }
    return workingTimeForBar
}

// working-time/edit/[id].tsxで使うためにデータベースから取り出したWorkingTimeの内容を変える
export function convertWorkingTimeForEdit(workingTime: WorkingTime): WorkingTimeForEdit {
    const { begin, beginText, endText } = convertRawWorkingTime(workingTime.begin, workingTime.end)
    const date = dateToStr(begin)
    const workingTimeForEdit: WorkingTimeForEdit = {
        id: workingTime.id,
        employee_number: workingTime.employee_number,
        name: workingTime.name,
        date: date,
        begin: beginText !== "NaN:NaN" ? beginText : "00:00",
        end: endText !== "NaN:NaN" ? endText : "00:00",
    }
    return workingTimeForEdit
}

//　上二つの関数に共通した処理を抜き出したもの
function convertRawWorkingTime(rawBegin: string, rawEnd: string) {
    const begin = new Date(Date.parse(rawBegin))
    // begin.setHours(begin.getHours() + 9)
    const beginText = `${begin.getHours().toString().padStart(2, '0')}:${begin.getMinutes().toString().padStart(2, '0')}`
    const end = new Date(Date.parse(rawEnd))
    // end.setHours(end.getHours() + 9)
    const endText = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
    return { begin, beginText, end, endText }
}

export function fixWorkingTimeForUpdate(workingTime: WorkingTime, beginText: string, endText: string): { updatedBegin: Date, updatedEnd: Date } {
    const begin = new Date(Date.parse(workingTime.begin))
    // begin.setHours(begin.getHours() + 9)
    const [ beginHours, beginMinutes ] = beginText.split(":")
    begin.setHours(Number(beginHours))
    begin.setMinutes(Number(beginMinutes))
    const end = new Date(Date.parse(workingTime.end))
    // begin.setHours(begin.getHours() + 9)
    const [ endHours, endMinutes ] = endText.split(":")
    end.setHours(Number(endHours))
    end.setMinutes(Number(endMinutes))
    return { updatedBegin: begin, updatedEnd: end }
}

export function makeWorkingTimeForCreate(dateText: string, begin: string, end: string) {
    const beginBase = new Date(dateText)
    const [ beginHours, beginMinutes ] = begin.split(":")
    beginBase.setHours(Number(beginHours))
    beginBase.setMinutes(Number(beginMinutes))
    const endBase = new Date(Date.parse(dateText))
    const [ endHours, endMinutes ] = end.split(":")
    endBase.setHours(Number(endHours))
    endBase.setMinutes(Number(endMinutes))
    return { convertedBegin: beginBase, convertedEnd: endBase }
}