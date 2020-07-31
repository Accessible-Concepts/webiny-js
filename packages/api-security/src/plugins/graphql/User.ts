import { resolveGet, resolveList } from "@webiny/commodo-graphql";
import { hasScope } from "@webiny/api-security";
import resolveLoginUsingIdToken from "./userResolvers/loginUsingIdToken";
import resolveGetCurrentUser from "./userResolvers/getCurrentUser";
import resolveUpdateCurrentSecurityUser from "./userResolvers/updateCurrentUser";
import resolveCreateUser from "./userResolvers/createUser";
import resolveUpdateUser from "./userResolvers/updateUser";
import resolveDeleteUser from "./userResolvers/deleteUser";
import resolveCreatePAT from "./userResolvers/PersonalAccessTokens/createPAT";
import resolveUpdatePAT from "./userResolvers/PersonalAccessTokens/updatePAT";
import resolveDeletePAT from "./userResolvers/PersonalAccessTokens/deletePAT";

const userFetcher = ctx => ctx.models.SecurityUser;

export default {
    typeDefs: /* GraphQL */ `
        # Personal Access Token type
        type PersonalAccessToken {
            id: ID
            user: SecurityUser
            name: String
            token: String
            createdOn: DateTime
        }

        input PersonalAccessTokenInput {
            name: String
        }

        type PersonalAccessTokenCreationData {
            pat: PersonalAccessToken
            # The full token - you only receive it once!
            token: String
        }

        type PersonalAccessTokenCreationResponse {
            data: PersonalAccessTokenCreationData
            error: SecurityUserError
        }

        type PersonalAccessTokenResponse {
            data: PersonalAccessToken
            error: SecurityUserError
        }

        type SecurityUserLogin {
            token: String
            expiresOn: Int
            user: SecurityUser
        }

        type SecurityUserAccess {
            scopes: [String]
            roles: [String]
        }

        type SecurityUser @key(fields: "id") {
            id: ID
            email: String
            firstName: String
            lastName: String
            fullName: String
            gravatar: String
            avatar: File
            enabled: Boolean
            groups: [SecurityGroup]
            roles: [SecurityRole]
            scopes: [String]
            access: SecurityUserAccess
            personalAccessTokens: [PersonalAccessToken]
            createdOn: DateTime
        }

        # Contains user settings by specific key, ex: search-filters.
        type SecurityUserSettings {
            key: String
            data: JSON
        }

        # This input type is used by administrators to update other user's accounts
        input SecurityUserInput {
            email: String
            firstName: String
            lastName: String
            avatar: RefInput
            enabled: Boolean
            groups: [ID]
            roles: [ID]
        }

        # This input type is used by the user who is updating his own account
        input SecurityCurrentUserInput {
            email: String
            firstName: String
            lastName: String
            avatar: RefInput
        }

        type SecurityUserResponse {
            data: SecurityUser
            error: SecurityUserError
        }

        input SecurityUserSearchInput {
            query: String
            fields: [String]
            operator: String
        }

        type SecurityUserError {
            code: String
            message: String
            data: JSON
        }

        type SecurityUserDeleteResponse {
            data: Boolean
            error: SecurityUserError
        }

        type SecurityUserListResponse {
            data: [SecurityUser]
            meta: SecurityListMeta
            error: SecurityUserError
        }

        type SecurityUserLoginResponse {
            data: SecurityUserLogin
            error: SecurityUserError
        }

        extend type SecurityQuery {
            "Get current user"
            getCurrentUser: SecurityUserResponse

            "Get a single user by id or specific search criteria"
            getUser(id: ID, where: JSON, sort: String): SecurityUserResponse

            "Get a list of users"
            listUsers(
                where: JSON
                sort: JSON
                search: SecurityUserSearchInput
                limit: Int
                after: String
                before: String
            ): SecurityUserListResponse
        }

        extend type SecurityMutation {
            "Login user using ID token obtained from a 3rd party authentication provider"
            loginUsingIdToken(idToken: String!): SecurityUserLoginResponse

            "Update current user"
            updateCurrentUser(data: SecurityCurrentUserInput!): SecurityUserResponse

            createUser(data: SecurityUserInput!): SecurityUserResponse

            updateUser(id: ID!, data: SecurityUserInput!): SecurityUserResponse

            deleteUser(id: ID!): SecurityUserDeleteResponse

            createPAT(name: String!, userId: ID): PersonalAccessTokenCreationResponse
            updatePAT(id: ID!, data: PersonalAccessTokenInput!): PersonalAccessTokenResponse
            deletePAT(id: ID!): SecurityUserDeleteResponse
        }
    `,
    resolvers: {
        PersonalAccessToken: {
            token: pat => {
                return pat.token.substr(-4);
            }
        },
        SecurityUser: {
            __resolveReference(reference, context) {
                return userFetcher(context).findById(reference.id);
            },
            avatar({ avatar }) {
                return avatar ? { __typename: "File", id: avatar } : null;
            }
        },
        SecurityQuery: {
            getCurrentUser: resolveGetCurrentUser,
            getUser: hasScope("security:user:crud")(resolveGet(userFetcher)),
            listUsers: hasScope("security:user:crud")(resolveList(userFetcher))
        },
        SecurityMutation: {
            loginUsingIdToken: resolveLoginUsingIdToken(userFetcher),
            updateCurrentUser: resolveUpdateCurrentSecurityUser,
            createUser: hasScope("security:user:crud")(resolveCreateUser(userFetcher)),
            updateUser: hasScope("security:user:crud")(resolveUpdateUser(userFetcher)),
            deleteUser: hasScope("security:user:crud")(resolveDeleteUser(userFetcher)),
            createPAT: hasScope("security:user:crud")(resolveCreatePAT),
            updatePAT: hasScope("security:user:crud")(resolveUpdatePAT),
            deletePAT: hasScope("security:user:crud")(resolveDeletePAT)
        }
    }
};
