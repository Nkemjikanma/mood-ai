import EntryCard from "@/components/EntryCard";
import NewEntryCard from "@/components/NewEntryCard";
import { getUserByClerkId } from "@/util/auth";
import { prisma } from "@/util/db";
import { Fragment } from "react";

const getEntries = async () => {
  const user = await getUserByClerkId()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return entries
}


const JournalPage = async () => {
  const entries = await getEntries()

  console.log('entries', entries)

  return <div className='p-10 bg-zinc-300/10 h-full' >
    <h1 className="text-3xl mb-5 font-bold">Journal</h1>
    <div className="grid grid-cols-3 gap-4">
      <NewEntryCard />
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  </div>
}

export default JournalPage