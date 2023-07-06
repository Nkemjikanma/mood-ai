import Editor from "@/components/Editor"
import { getUserByClerkId } from "@/util/auth"
import { prisma } from "@/util/db"

const getEntry = async (id: string) => {
  const user = await getUserByClerkId()
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id: id,
      }
    },
    include: {
      analysis: true,
    }
  })

  return entry
}
const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id)

  return <div className="w-full h-full">
    <div>
      <Editor entry={entry} />
    </div>


  </div >
}

export default EntryPage
