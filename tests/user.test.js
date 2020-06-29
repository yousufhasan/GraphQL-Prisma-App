import 'cross-fetch/polyfill'
import {prisma} from '../src/prisma';
import {getClient} from './utils/getClient'
import {seedDatabase, userOne} from './utils/seedDatabase';
import {createUser, getUsers, login, getProfile} from './utils/operations';

const client = getClient();
jest.setTimeout(30000);
beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Andrew",
            email: "andrew@example.com",
            password: "MyPass123"
        }
    };
    const response = await client.mutate({
        mutation: createUser,
        variables
    });

    const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
    expect(exists).toBe(true);
})

test('Should expose public author profiles', async () => {
   
    const response = await client.query({ query: getUsers });

    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Jen');
})

test('Should not login with bad credentials', async () => {
    const variables = {
        email: "jen@example.com",
        password: "red098!@#$"
    }
    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow()
})

test('Should not signup user with invalid password', async () => {
    const variables = {
        data: {
            name: "Andrew",
            email: "andrew@example.com",
            password: "pass"
        }
    };
    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow();
});

test('should fetch userProfile', async () =>{
    const authClient = getClient(userOne.jwt);

   const response = await authClient.query({query: getProfile});
   expect(response.data.me.id).toBe(userOne.user.id);
   expect(response.data.me.name).toBe(userOne.user.name);
   expect(response.data.me.email).toBe(userOne.user.email);
})