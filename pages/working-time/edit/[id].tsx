import { GetServerSideProps } from "next"
import { WorkingTime } from "../../../types/type"
import { useForm } from "react-hook-form"
import { convertWorkingTimeForEdit, fixWorkingTimeForUpdate } from "../../../lib/convertWorkingTime"
import { useState } from "react"
import { useRouter } from "next/router"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const workingTimeId = context.params?.id
     
    try {
        const url = `https://damp-hita-8422.lolipop.io/api/v1/working_times/${workingTimeId}`
        const workingTime = await fetch(url, { method: "GET" })
            .then((response) => response.json())
            .then((data) => data.data)
        if (workingTime[0]) {
            return {
                props: {
                    workingTime: workingTime[0]
                }
            }
        } else {
            return { notFound: true }
        }
    } catch (e) {
        return {
            redirect: {
              permanent: false,
              destination: '/error'
            }
        }
    }
}

type Inputs = {
    begin: string;
    end: string;
}

export default function Edit({ workingTime }: { workingTime: WorkingTime }) {
    const [workingTimeForSubmit] = useState(workingTime)
    const router = useRouter()
    const workingTimeForEdit = convertWorkingTimeForEdit(workingTime)
    const { 
        register, 
        handleSubmit,
        formState: {errors}
    } = useForm<Inputs>({
        defaultValues: { 
            begin: workingTimeForEdit.begin,
            end: workingTimeForEdit.end,
        }
    })

    const onSubmit = async (data: Inputs) => {
        const { begin, end } = data
        try {
            const { updatedBegin, updatedEnd } = fixWorkingTimeForUpdate(workingTimeForSubmit, begin, end)
            const convertedBegin = updatedBegin.getTime() / 1000
            const convertedEnd = updatedEnd.getTime() / 1000
            const url = `https://damp-hita-8422.lolipop.io/api/v1/working_times/${workingTimeForSubmit.id}?begin=${convertedBegin}}&end=${convertedEnd}`
            const status = await fetch(url, { method: "PATCH" })
                .then((response) => response.json())
                .then((data) => data.status)
            if (status === "SUCCESS") {
                router.push("/")
                alert("勤怠を修正しました")
            } else {
                alert("修正に失敗しました")
            }
        } catch (e) {
            alert("修正に失敗しました")
        }
    }

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-64 rounded-lg bg-indigo-300">
                <div className='flex justify-center mb-2'>
                    <span className='text-white text-lg font-extrabold'>勤怠修正</span>
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    {workingTimeForEdit.name}
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    {workingTimeForEdit.date}
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    <div>出勤：</div>
                    <input
                        type="time"
                        {...register('begin', {
                            required: true,
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    />
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    <div>退勤：</div>
                    <input
                        type="time"
                        {...register('end', {
                            required: true
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    />
                </div>
                <div>
                    <button type="submit" className='relative h-12 w-full rounded-3xl text-white bg-gradient-to-r from-[#aeeec1] to-[#94e7e9] hover:from-[#eee0ae] hover:to-[#e99494] hover:top-[2px]'>
                        修正する
                    </button>
                </div>
            </form>
        </div>
    )
}