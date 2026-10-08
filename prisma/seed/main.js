import prisma from "../PrismaClient.js";
import userSeeder from "./UserSeeder.js";
import postSeeder from "./PostSeeder.js";

const main = async () => {
  await userSeeder();
  await postSeeder();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
