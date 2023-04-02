import { useEffect, useState } from "react";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi2";
import Bar from "../components/Bar";
import { WorkingTime } from "../types/type";
import dateToStr from "../lib/dateToStr";
import ExampleBar from "../components/ExampleBar";
import Link from "next/link";
import getStartAndEndOfDay from "../lib/getStartAndEndOfDay";

export default function Home() {
  // アクセスした時の日時で初期化
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  // データベースから取ってきたdateの日付の勤怠情報を入れる
  const [workingTimes, setWorkingTimes] = useState([])

  // 初回及びdateの中身が変わるたびにデータベースからその日付のデータを取ってくる
  useEffect(() => {
    try {
      // 日時はミリ秒に変換してからパラメータとして付与する
      const { convertedBegin, convertedEnd }= getStartAndEndOfDay(date)
      const url = `https://damp-hita-8422.lolipop.io/api/v1/working_times?begin=${convertedBegin}&end=${convertedEnd}`
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => setWorkingTimes(data.data))
      setLoading(false)
    } catch (e) {
      
    }
  }, [date])

  function handleOnClickLeft() {
    // 参照先を変えないと再レンダリングが起こらないためdateをnewDateに変えてから1日引く
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() - 1)
    setDate(newDate)
  }

  function handleOnClickRight() {
    // 参照先を変えないと再レンダリングが起こらないためdateをnewDateに変えてから1日足す
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() + 1)
    setDate(newDate)
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex m-2 mt-6">
        <button onClick={handleOnClickLeft} className="bg-indigo-300 hover:bg-indigo-500 rounded-l-2xl text-white">
          <HiOutlineChevronDoubleLeft size={20} />
        </button>
        <div className="flex justify-center bg-indigo-300 pl-1 pr-2 w-32">
          {dateToStr(date)}
        </div>
        <button onClick={handleOnClickRight} className="bg-indigo-300 hover:bg-indigo-500 rounded-r-2xl text-white">
          <HiOutlineChevronDoubleRight size={20} />
        </button>
      </div>
      <div className="grow mr-2 ml-2 mb-2 border-2 border-indigo-300 overflow-scroll">
        <ExampleBar />
        {loading ? (
          <div>ローディング中</div>
        ) : (
          workingTimes.map((workingTime: WorkingTime) => {
            return <Bar key={workingTime.id} workingTime={workingTime}/>
          })
        )}
      </div>
      <div className="flex">
        <Link href={`/working-time/create?date=${date.toDateString()}`} className="flex justify-center mr-2 ml-2 mb-6 w-64 border-2 border-indigo-300 rounded-2xl bg-neutral-100 hover:bg-neutral-300">この日の勤怠情報を追加する</Link>
        <Link href="/employee/create" className="flex justify-center mr-2 ml-2 mb-6 w-64 border-2 border-indigo-300 rounded-2xl bg-neutral-100 hover:bg-neutral-300">従業員を新規登録する</Link>
        <Link href="/employee/all" className="flex justify-center mr-2 ml-2 mb-6 w-64 border-2 border-indigo-300 rounded-2xl bg-neutral-100 hover:bg-neutral-300">従業員一覧</Link>
      </div>
    </div>
  )
}

