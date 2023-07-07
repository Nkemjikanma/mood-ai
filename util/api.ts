const createURL = (path: string) => {
  return window.location.origin + path
}

export const createNewEntry = async () => {
  const res = await fetch(
    new Request(
      createURL("/api/journal"), {
      method: "POST",
    })
  )
  console.log(res)
  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error("Failed to create entry")
  }
}


export const updateEntry = async (id, content) => {

  const res = await fetch(new Request(createURL(`/api/journal/${id}`), {
    method: "PATCH",
    body: JSON.stringify({ content })
  }))

  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error("Failed to update entry")
  }
}

export const askQuestion = async (question) => {
  const res = await fetch(
    new Request(
      createURL("/api/question"), {
      method: "POST",
      body: JSON.stringify({ question })
    })
  )
  console.log(res)
  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error("Failed to send question")
  }
}
