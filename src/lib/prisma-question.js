import { PrismaClient } from "@prisma/client-question";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis;

const prismaQuestion = globalForPrisma.prismaQuestion ?? prismaClientSingleton();

export default prismaQuestion;

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaQuestion = prismaQuestion;
