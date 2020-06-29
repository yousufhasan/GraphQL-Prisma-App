import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import {prisma} from '../../src/prisma'

export const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('Red098!@#$')
    },
    user: undefined,
    jwt: undefined
};

export const userTwo = {
    input: {
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678')
    },
    user: undefined,
    jwt: undefined
};

export const postOne = {
    input: {
        title: 'My published post',
        body: '',
        published: true,
    },
    post: undefined
};

export const postTwo = {
    input: {
        title: 'My draft post',
        body: '',
        published: false,
    },
    post: undefined
};

export const commentOne = {
    input: {
        text: 'My Test Comment on published post by user 1'
    },
   comment: undefined 
};

export const commentTwo = {
    input: {
        text: 'My Test Comment 2 on published post by user 2'
    },
   comment: undefined 
};

export const seedDatabase = async () => {
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.AUTH_SECRET);

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });
    userTwo.jwt = jwt.sign({userId: userTwo.user.id}, process.env.AUTH_SECRET);

    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });

    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    });

    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    });
}