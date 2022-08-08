import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    // await prisma.$connect()

    // const allUsers = await prisma.user.findMany()

    // console.log(allUsers)

    // await prisma.user.create({
    //     data: {
    //         name: "Rich",
    //         email: "hello@prisma.com",
    //         posts: {
    //             create: {
    //                 title: "First post",
    //                 body: "lots of really interesting stuff",
    //                 slug: "my-first-post",
    //             },
    //         },
    //     },
    // });

    // const allUsers = await prisma.user.findMany({
    //     include: {
    //         posts: true,
    //     },
    // });

    // console.dir(allUsers, { depth: null });

    await prisma.post.update({
        where: {
            slug: "my-first-post",
        },
        data: {
            comments: {
                createMany: {
                    data: [
                        {
                            comment: "Great post",
                        },
                        {
                            comment: "Can't wait to read more!",
                        },
                    ],
                },
            },
        },
    });

    const posts = await prisma.post.findMany({
        include: {
            comments: true,
        }
    })

    console.dir(posts, { depth: Infinity })
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
