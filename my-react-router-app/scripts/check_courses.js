import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const courses = await prisma.course.findMany({
    include: {
      studiengang: true
    }
  })
  console.log(JSON.stringify(courses, null, 2))
}
main()
