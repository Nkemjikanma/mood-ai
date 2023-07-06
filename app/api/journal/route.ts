import { analyse } from "@/util/ai"
import { getUserByClerkId } from "@/util/auth"
import { prisma } from "@/util/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkId()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user?.id as string,
      content: "Write about your day here!"
    },
  })

  // send the input to the analysis api
  const analysis = await analyse(entry.content)

  // update the entry with the analysis
  await prisma.analysis.create({
    data: {
      entryId: entry.id,
      ...analysis,
    }
  })
  revalidatePath("/journal")

  return NextResponse.json({ data: entry })
}
