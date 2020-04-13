import {Prisma} from 'prisma-binding';
import {fragmentReplacements} from './resolvers';

export const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'thisismysupersecrettext',
    fragmentReplacements
});
/*
prisma.query.users(null, 
    '{id name email posts { id title}}'
).then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
});

prisma.query.comments(null, 
    '{id text author {id name}}'
).then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
});


const updatePostForUser = async (postId, data) => {
    const exists = await prisma.exists.Post({
        id: postId
    });
    if(!exists){
        throw new Error("Post not found");
    }
   const post = await prisma.mutation.updatePost({
        data: {...data},
        where: {
            id: postId
        }
    },
    '{author { id name email posts {id title body} }}' 
    );

    return post.author;
}

const createPostForUser = async (authorId, data) => {
    const exists = await prisma.exists.User({
        id: authorId
    });
    if(!exists){
        throw new Error("User not found");
    }
   const post = await prisma.mutation.createPost({
      data: {
          ...data, 
          author: {
              connect: {
                  id: authorId
              }
          }  
    }
  },
  '{ author{id name email posts {id title body}}'
);
return post.author;
};
/*
createPostForUser('ck8fuk1me003r075511kn9xsp', {
    title: ' This is test from method',
    body: 'test',
    published: true
}).then(user => {
    console.log(JSON.stringify(user, undefined, 2));
}).catch(e => {
    console.log(e.message);
});

updatePostForUser('ck8fw39v70dfdfdfd32szdu77', {
    title: " post title updated from nodejs",
    body: " post body updated nodejs",
    published: true
}).then(user => {
    console.log(JSON.stringify(user, undefined, 2));
}).catch(e => {
    console.log(e.message);
});
*/