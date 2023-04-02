import { GetServerSideProps } from "next"
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

export default function Create({ employees }: { employees: Employee[] }) {
    return (
        <div className="flex justify-center">
            <div className="ml-2 p-4 w-96 h-screen rounded-lg bg-indigo-300 overflow-scroll">
                <div className='flex justify-center mb-2'>
                    <span className='text-white text-lg font-extrabold'>従業員一覧</span>
                </div>
                {employees.map((employee) => {
                    return <div key={employee.id} className="mb-1 p-1 text-sm rounded-lg border-[#cccccc] bg-neutral-100">{`${employee.employee_number}:${employee.name} ［${employee.employment_status}］ ［${employee.section}］`}</div>
                })}
            </div>
        </div>
    )
}