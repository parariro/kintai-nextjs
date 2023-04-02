import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
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
    employee_number: string;
    name: string;
    employment_status: string;
    section: string;
}

export default function Create({ employees }: { employees: Employee[] }) {
    const router = useRouter()
    const { 
        register, 
        handleSubmit,
        formState: {errors}
    } = useForm<Inputs>({
        defaultValues: { 
            employment_status: "正社員",
            section: "ホール",
        }
    })

    const onSubmit = async (data: Inputs) => {
        const { employee_number, name, employment_status, section } = data
        try {
            const baseUrl = "https://damp-hita-8422.lolipop.io/api/v1/employees?"
            const url = `${baseUrl}employee_number=${employee_number}&name=${name}&employment_status=${employment_status}&section=${section}`
            const status = await fetch(url, { method: "POST" })
                .then((response) => response.json())
                .then((data) => data.status)
            if (status === "SUCCESS") {
                router.push("/")
                alert("登録されました")
            } else {
                alert("登録に失敗しました")
            }
        } catch (e) {
            alert("登録に失敗しました")
        }
    }

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-96 rounded-lg bg-indigo-300">
                <div className='flex justify-center mb-2'>
                    <span className='text-white text-lg font-extrabold'>従業員登録</span>
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    <div>従業員番号：</div>
                    <input
                        placeholder="数字8文字"
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
                        placeholder="スペースなし"
                        type="text"
                        {...register('name', {
                            required: true,
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    />
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    <div>雇用の形態：</div>
                    <select
                        {...register('employment_status', {
                            required: true
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    >
                        <option value="正社員">正社員</option>
                        <option value="アルバイト">アルバイト</option>
                    </select>
                </div>
                <div className='mb-2 flex justify-center items-center'>
                    <div>セクション：</div>
                    <select
                        {...register('section', {
                            required: true
                        })}
                        className="p-1 border rounded-lg outline-none border-[#cccccc]"
                    >
                        <option value="ホール">ホール</option>
                        <option value="キッチン">キッチン</option>
                    </select>
                </div>
                <div>
                    <button type="submit" className='relative h-12 w-full rounded-3xl text-white bg-gradient-to-r from-[#aeeec1] to-[#94e7e9] hover:from-[#eee0ae] hover:to-[#e99494] hover:top-[2px]'>
                        登録する
                    </button>
                </div>
            </form>
            <div className="ml-2 p-4 w-48 h-[284px] rounded-lg bg-indigo-300 overflow-scroll">
                <div className='flex justify-center mb-2'>
                    <span className='text-white text-lg font-extrabold'>既存の従業員</span>
                </div>
                {employees.map((employee) => {
                    return <div key={employee.id} className="mb-1 p-1 rounded-lg border-[#cccccc] bg-neutral-100">{`${employee.employee_number}:${employee.name}`}</div>
                })}
            </div>
        </div>
    )
}