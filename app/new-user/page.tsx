import { prisma } from '@/util/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const creteNewUser = async () => {
  const user = await currentUser()

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string
    }
  })
  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
      }
    })
  }

  redirect('/journal')

}
const NewUser = async () => {
  await creteNewUser()
  return (
    <div>
      ...loading
    </div>
  )
}

export default NewUser
