import 'cross-fetch/polyfill'
import {getClient} from './utils/getClient'
import {seedDatabase, userOne, commentOne, commentTwo, postOne} from './utils/seedDatabase';
import { deleteComment, subscribeToComments } from "./utils/operations";
import {prisma} from '../src/prisma';

jest.setTimeout(30000);
beforeEach(seedDatabase);

test('should be able to delete own comment', async () => {
    const authClient = getClient(userOne.jwt);
    const variables = {
        id: commentOne.comment.id
    }
    const {data} = await authClient.mutate({mutation: deleteComment, variables});
    const exists = await prisma.exists.Post({id: data.deleteComment.id});
    expect(exists).toBe(false);
});


test('should not be able to delete other user comment', async () => {
    const authClient = getClient(userOne.jwt);
    const variables = {
        id: commentTwo.comment.id
    }
  await expect(authClient.mutate({mutation: deleteComment, variables})).rejects.toThrow();
  
});

test('should subscribe to comments', async (done)=> {
    const authClient = getClient(userOne.jwt);
    const variables = {
        postId: postOne.post.id
    };
    
    authClient.subscribe({query: subscribeToComments, variables}).subscribe(
        {
            next: (response) => {
                expect(response.data.comment.mutation).toBe('DELETED');
                done();
            }
        }
    );

    prisma.mutation.deleteComment({where: {
        id: commentOne.comment.id
    }});

});

