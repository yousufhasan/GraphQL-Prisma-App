import {Query} from './Query';
import {Mutation} from './Mutation';
import {Subscription} from './Subscription';
import {User} from './User';
import {Post} from './Post';
import {Comment} from './Comment';
import { extractFragmentReplacements } from 'prisma-binding'

export const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
}

export const fragmentReplacements = extractFragmentReplacements(resolvers);