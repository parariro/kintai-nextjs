import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { makeWorkingTimeForCreate } from "../../lib/convertWorkingTime"
import dateToStr from "../../lib/dateToStr"
import { Employee } from "../../types/type"

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const url = "https://damp-hita-8422.lolipop.io/api/v1/employees"
        const employees = await fetch(url, { method: "GET" })
            .then((response) => response.json())
            .then((data) => data.data)
        return {
            props: {
                employees: employees
            }
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
    id: number;
    employee_number: string;
    name: string;
    begin: string;
    end: string;
}

export default function Create({ employees }: { employees: Employee[] }) {
    const router = useRouter()
    const dateText = typeof router.query.date === "string" ? router.query.date : "NOTSTRING"
    const date = new Date(dateText)
    const convertedDate = dateToStr(date)

    const { 
        register, 
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm<Inputs>({
        defaultValues: { 
            begin: "12:00",
            end: "12:00",
        }
    })

    const onSubmit = async (data: Inputs) => {
        const { id, begin, end} = data
        try {
            if (dateText === "NOTSTRING") {
                throw new Error('終了します')
            }
            const { convertedBegin, convertedEnd } = makeWorkingTimeForCreate(dateText, begin, end)
            const beginInMilliseconds = convertedBegin.getTime() / 1000
            const endInMilliseconds = convertedEnd.getTime() / 1000
            const url = `https://damp-hita-8422.lolipop.io/api/v1/working_times?id=${id}&begin=${beginInMilliseconds}&end=${endInMilliseconds}`
            const status = await fetch(url, { method: "POST" })
                .then((response) => response.json())
                .then((data) => data.status)
            if (status === "SUCCESS") {
                router.push("/")
                alert("追加されました")
            } else {
                alert("追加に失敗しました")
            }
        } catch (e) {
            alert("追加に失敗しました。トップページから再度アクセスしてください。")
        }
    }

    function handleOnClick(id: number, employee_number: string, name: string) {
        setValue("id", id)
        setValue("employee_number", employee_number)
        setValue("name", name)
    }

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-96 rounded-lg bg-indigo-300">
                <div className='flex justify-center mb-2'>
                    <span className='text-white text-lg font-extrabold'>勤怠情報追加</span>
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    {convertedDate}
                </div>
                <input
                    type="hidden"
                    {...register('id', {
                        required: true,
                    })}
                />
                <div className='mb-2 flex justify-center items-center'>
                    <div>従業員番号：</div>
                    <input
                        type="text"
                        {...register('employee_number', {
                            required: true,
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    />
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    <div>従業員氏名：</div>
                    <input
                        type="text"
                        {...register('name', {
                            required: true,
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    />
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
                        追加する
                    </button>
                </div>
            </form>
            <div className="ml-2 p-4 w-48 h-[316px] rounded-lg bg-indigo-300 overflow-scroll">
                <div className='flex justify-center mb-2'>
                    <span className='text-white text-lg font-extrabold'>以下から選択</span>
                </div>
                {employees.map((employee) => {
                    return <button key={employee.id} onClick={() => handleOnClick(employee.id, employee.employee_number, employee.name)} className="mb-1 p-1 rounded-lg border-[#cccccc] bg-neutral-100 hover:bg-neutral-300">{`${employee.employee_number}:${employee.name}`}</button>
                })}
            </div>
        </div>
    )
}