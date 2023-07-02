"use client"

import { useState } from "react"
import { useAutosave } from "react-autosave"
import { updateEntry } from "@/util/api"

const Editor = ({ entry }) => {
  const [textValue, setTextValue] = useState<string>(entry.content)
  const [currentEntry, setCurrentEntry] = useState<string>(entry)
  const [isSaving, setIsSaving] = useState<boolean>(false) //this is to show a saving indicator

  useAutosave({
    data: textValue, // this is value that is being watched for changes
    onSave: async (_textValue) => {
      if (_textValue == entry.content) return
      setIsSaving(true)

      const data = await updateEntry(entry.id, _textValue)

      setCurrentEntry(data)
      setIsSaving(false)
    }
  })

  return (<div className="w-full h-full">
    {isSaving && <div>Saving...</div>}
    <textarea className="w-full h-full p-8 text-xl outline-none" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
  </div>)
}

export default Editor
