import prisma from "../PrismaClient.js";
import { faker } from "@faker-js/faker";

const postSeeder = async () => {
  const data = [];

  for (let i = 0; i < 20; i++) {
    const title = faker.lorem.sentence(5);
    const content = faker.lorem.paragraph(5);
    const userId = faker.number.int({ min: 1, max: 10 });

    data.push({ title, content, userId });
  }

  await prisma.post.createMany({
    data,
  });

  console.log("Posts seeded successfully");
};

export default postSeeder;
