import bcrypt from 'bcryptjs';
import {getUserId} from '../utils/getUserId';
import {generateToken} from '../utils/generateToken';
import {hashPassword} from '../utils/hashPassword';

export const Mutation = {
    login: async (parent, args, {prisma}, info) => {
            const user = await prisma.query.user({
                where: {
                    email: args.email
                }
            });
            if(!user){
                throw new Error('Invalid Username or password');
            }
            const isMatch = await bcrypt.compare(args.password, user.password);
            if(!isMatch){
                throw new Error('Invalid Username or password');
            }
            return {
                token: generateToken(user.id),
                user
            }
    },
    createUser: async (parent, args, {prisma}, info) => {
       const password = await hashPassword(args.data.password);
       const user = await prisma.mutation.createUser({
            data: {
               ...args.data,
               password
            }
        });
        return {
            token: generateToken(user.id),
            user
        }
    },
    deleteUser: async (parent, args, {prisma, request}, info) => {
       const userId = getUserId(request);
       return prisma.mutation.deleteUser({where: {
           id: userId
       }}, info);
    },
    updateUser: async (parent, args, {prisma, request}, info) => {
        const userId = getUserId(request);
        if(typeof args.data.password === 'string'){
            args.data.password = await hashPassword(args.data.password);
        }
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info);
    },
    createPost: (parent, args, {prisma, request}, info) => {
        const userId= getUserId(request);
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info);
    },
    deletePost: async (parent, args, {prisma, request}, info) => {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        if(!postExists){
            throw new Error('Invalid delete operation');
        }
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info);
    },
    updatePost: async (parent,args, {prisma, request}, info) => {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        if(!postExists){
            throw new Error('Invalid update operation');
        }
        const postPublished = await prisma.exists.Post({
                id: args.id,
                published: true
        });
        if(postPublished && !args.data.published){
             prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },
    createComment: async (parent, args, {prisma, request}, info) => {
        const postPublished = await prisma.exists.Post({
                id: args.data.post,
                published: true
        });
        if(!postPublished){
            throw new Error('unable to find published post');
        }
        const userId = getUserId(request);
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info);
    },
    deleteComment: async (parent, args, {prisma, request}, info) => {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if(!commentExists){
            throw new Error('Invalid delete operation');
        }
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info);
    },
    updateComment: async (parent, args, {prisma, request}, info) => {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if(!commentExists){
            throw new Error('Invalid update operation');
        }
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    }
};