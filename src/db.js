
const users= [
    {id: '1', name: 'yousuf',email: 'yousuf@gmail.com', age: 25},
    {id: '2', name: 'Hussain', email: 'hussain@gmail.com', age: 3}
]

const posts= [
    {id: '1', title: 'Post 1',body: 'Test Post', published: true, author: '1'},
    {id: '2', title: 'Post 2', body: 'Test Post', published: true, author: '1'}
]

const comments = [
    {id: '1', text: 'This is comment 1', author: '1', post: '1'},
    {id: '2', text: 'This is comment 2', author: '1', post: '1'},
    {id: '3', text: 'This is comment 3', author: '1', post: '2'},
    {id: '4', text: 'This is comment 4', author: '2', post: '2'},
    {id: '5', text: 'This is comment 5', author: '2', post: '2'},
]

export const db = {
    users,
    posts,
    comments
}