'use client'

import { askQuestion } from "@/util/api"
import { useState } from "react"

const Question = () => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [questionResponse, setQuestionResponse] = useState()

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    const answer = await askQuestion(value)
    setQuestionResponse(answer)
    setValue('')
    setLoading(false)
  }
  return (
    <>
      <form className="flex" onSubmit={handleSubmit}>
        <input disabled={loading} type="text" placeholder="Ask a question" value={value} onChange={onChange} className="border border-black/20 px-4 py-2 text-lg rounded-lg" />
        <button disabled={loading} type="submit" className="bg-blue-300 px-4 py-2 rounded-lg text-lg">Ask</button>
      </form>
      {loading && <p>Loading...</p>}
      {questionResponse && <div>{questionResponse}</div>}
    </>
  )
}

export default Question
