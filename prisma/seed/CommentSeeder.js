import prisma from "../PrismaClient.js";
import { faker } from "@faker-js/faker";

const commentSeeder = async () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    const body = faker.lorem.sentence(5);
    const userId = faker.number.int({ min: 1, max: 10 });
    const postId = faker.number.int({ min: 1, max: 20 });

    data.push({ body, userId, postId });
  }

  await prisma.comment.createMany({
    data,
  });

  console.log("Comments seeded successfully");
};

export default commentSeeder;
