import { WorkingTime } from "../types/type"
import { convertWorkingTimeForBar } from "../lib/convertWorkingTime"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Bar({ workingTime }: { workingTime: WorkingTime}) {
    const router = useRouter()
    const workingTimeForBar = convertWorkingTimeForBar(workingTime)

    async function handleOnClick(id: number) {
        try {
            const isOk = window.confirm("削除してもよろしいですか？")
            const url = `https://damp-hita-8422.lolipop.io/api/v1/working_times/${id}`
            const status = isOk ? (
                await fetch(url, { method: "DELETE" })
                    .then((response) => response.json())
                    .then((data) => data.status)
            ) : "NOTDOING"
            if (status === "SUCCESS") {
                router.reload()
                alert("削除しました")
            } else if (status === "ERROR") {
                alert("削除に失敗しました")
            }
        } catch (e) {
            alert("エラーが起きました")
        }        
    }

    return (
        <div className="flex ml-2 mt-2">
            <div className={`flex text-xs w-[512px] rounded-lg pt-2 pb-2 mr-1 border-2 border-indigo-300 ${workingTimeForBar.isOverWork ? "bg-red-200" : "bg-neutral-100"}`}>
            <span className="flex justify-center w-32 border-r-2 border-indigo-300">{workingTimeForBar.employee_number}</span>
                <span className="flex justify-center w-32 border-r-2 border-indigo-300">{workingTimeForBar.name}</span>
                <span className="flex justify-center w-32 border-r-2 border-indigo-300">{workingTimeForBar.begin}</span>
                <span className="flex justify-center w-32 border-r-2 border-indigo-300">{workingTimeForBar.end}</span>
                <span className="flex justify-center w-32">{workingTimeForBar.workHours}</span>
            </div>
            <Link href={`/working-time/edit/${workingTimeForBar.id}`} className="flex justify-center w-12 p-2 mr-1 text-xs border-2 border-indigo-300 rounded-lg bg-neutral-100 hover:bg-neutral-300">修正</Link>
            <button onClick={() => handleOnClick(workingTimeForBar.id)} className="flex justify-center w-12 p-2 text-xs border-2 border-indigo-300 rounded-lg bg-neutral-100 hover:bg-neutral-300">削除</button>
        </div>
    )
}