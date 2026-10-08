import prisma from "../PrismaClient.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const userSeeder = async () => {
  const password = await bcrypt.hash("password", 10);

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const username = `${firstName}${lastName[0]}`.toLocaleLowerCase();
    const bio = faker.person.bio();

    await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        name,
        username,
        bio,
        password,
      },
    });
  }

  console.log("Users seeded successfully");
};

export default userSeeder;
