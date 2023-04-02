export default function getStartAndEndOfDay(date: Date) {
    const begin = new Date(date.toDateString())
    const end = new Date(begin.toDateString())
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    const convertedBegin = begin.getTime() / 1000
    const convertedEnd = end.getTime() / 1000
    return { convertedBegin, convertedEnd }
}