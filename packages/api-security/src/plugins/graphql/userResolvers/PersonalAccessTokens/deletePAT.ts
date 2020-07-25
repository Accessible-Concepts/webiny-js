import { NotFoundResponse } from "@webiny/graphql";
import { ErrorResponse } from "@webiny/commodo-graphql";
import { hasScope } from "@webiny/api-security/utils";

export default async (root, args, context) => {
    const identity = context.security.getIdentity();
    if (!identity) {
        return new NotFoundResponse("Current user not found!");
    }

    const { SecurityPersonalAccessToken } = context.models;
    const currentUserId = identity.id;

    try {
        const pat = await SecurityPersonalAccessToken.findById(args.id);
        if (!pat) {
            return new NotFoundResponse("Personal Access Token not found!");
        }

        const patUser = await pat.user;
        if (patUser.id !== currentUserId) {
            // TODO: Won't work because on all solutions, fix this.
            const canDeleteToken = hasScope("security:user:crud", identity.scopes);
            if (!canDeleteToken) {
                return new ErrorResponse({
                    message:
                        "Cannot delete user's personal access token - insufficient permissions."
                });
            }
        }
        await pat.delete();
        return { data: true };
    } catch (e) {
        return new ErrorResponse({
            code: e.code,
            message: e.message,
            data: e.data || null
        });
    }
};
