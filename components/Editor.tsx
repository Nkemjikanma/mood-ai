"use client"

import { useState } from "react"
import { useAutosave } from "react-autosave"
import { updateEntry } from "@/util/api"

const Editor = ({ entry }) => {
  const [textValue, setTextValue] = useState<string>(entry.content)
  const [analysis, setAnalysis] = useState<any>(entry.analysis)
  const [isSaving, setIsSaving] = useState<boolean>(false) //this is to show a saving indicator

  const { mood, summary, color, subject, negative } = analysis
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' }
  ]

  useAutosave({
    data: textValue, // this is value that is being watched for changes
    onSave: async (_textValue) => {
      if (_textValue === entry.content) return
      setIsSaving(true)
      const data = await updateEntry(entry.id, _textValue)
      setAnalysis(data.analysis)
      setIsSaving(false)
    }
  })

  return (<div className="w-full h-full grid grid-cols-3">
    <div className="col-span-2">
      {isSaving && <div>Saving...</div>}
      <textarea className="w-full h-full p-8 text-xl outline-none" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
    </div>

    <div className="border-l border-black/10">
      <div className="px-6 py-10" style={{ background: color }}>
        <h2 className="text-2xl">Analysis</h2>
      </div>
      <div>
        <ul>
          {
            analysisData.map(({ name, value }) => (
              <li className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10" key={name}>
                <span className="text-lg font-semibold"> {name}</span>
                <span>{value}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  </div>)
}

export default Editor
