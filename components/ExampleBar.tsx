export default function ExampleBar() {
    return (
        <div className="flex ml-2 mt-2">
            <div className="flex text-xs w-[512px] rounded-lg pt-2 pb-2 mr-1 border-2 border-indigo-300 bg-green-100">
            <span className="flex justify-center w-32 border-r-2 border-indigo-300">従業員番号</span>
                <span className="flex justify-center w-32 border-r-2 border-indigo-300">氏名</span>
                <span className="flex justify-center w-32 border-r-2 border-indigo-300">出勤</span>
                <span className="flex justify-center w-32 border-r-2 border-indigo-300">退勤</span>
                <span className="flex justify-center w-32">労働時間</span>
            </div>
        </div>
    )
}