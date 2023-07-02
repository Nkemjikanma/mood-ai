import { getUserByClerkId } from "@/util/auth"
import { prisma } from "@/util/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkId()

  console.log(user)

  const entry = await prisma.journalEntry.create({
    data: {
      userId: user?.id as string,
      content: "Write about your day here!"
    },
  })

  revalidatePath("/journal")

  return NextResponse.json({ data: entry })
}
