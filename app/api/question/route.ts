import { qa } from "@/util/ai"
import { getUserByClerkId } from "@/util/auth"
import { prisma } from "@/util/db"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  const { question } = await request.json()
  const user = await getUserByClerkId()

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user?.id as string,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    }
  })

  const answer = await qa(question, entries)

  return NextResponse.json({ data: answer })
}
