import 'cross-fetch/polyfill'
import {seedDatabase, userOne, postOne, postTwo} from './utils/seedDatabase'
import {getClient} from './utils/getClient'
import {prisma} from '../src/prisma';
import {getPosts, myPosts, updatePost, createPost, deletePost, subscribeToPosts} from './utils/operations';

const client = getClient();
jest.setTimeout(30000);
beforeEach(seedDatabase);



test('Should expose published posts', async () => {
    const response = await client.query({ query: getPosts });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test('Should be able to get my Posts', async ()=> {
    const authClient = getClient(userOne.jwt);
  
    const response = await authClient.query({query: myPosts});
    expect(response.data.myPosts.length).toBe(2);
    expect(response.data.myPosts[0].published).toBe(true);
    expect(response.data.myPosts[1].published).toBe(false);
});

test('should be able to update own Post', async () => {
    const authClient = getClient(userOne.jwt);
    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    }

     const {data} = await authClient.mutate({mutation: updatePost, variables});
     expect(data.updatePost.published).toBe(false);
});

test('should be able to create a new post', async () => {
    const authClient = getClient(userOne.jwt);
    const variables = {
        data: {
            title: "This is test post",
            body:"This is test post",
            published:true
        }
    };
   
      const {data} = await authClient.mutate({mutation: createPost, variables});
      const exists = await prisma.exists.Post({id: data.createPost.id});
      expect(exists).toBe(true);

});

test('should be able to delete a post', async () => {
    const authClient = getClient(userOne.jwt);
    const variables = {
        id: postTwo.post.id
    }
    const {data} = await authClient.mutate({mutation: deletePost, variables});
    const exists = await prisma.exists.Post({id: data.deletePost.id});
    expect(exists).toBe(false);
});

test('should subscribe to posts', async (done) => {
    const authClient = getClient(userOne.jwt);
    authClient.subscribe({query: subscribeToPosts}).subscribe(
        {
            next: (response) => {
                expect(response.data.post.mutation).toBe('DELETED');
                done();
            }
        }
    );

    await prisma.mutation.deletePost({where: {
        id: postOne.post.id
    }});
});