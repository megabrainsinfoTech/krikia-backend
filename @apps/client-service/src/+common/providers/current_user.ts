export const CurrentUserProvider = {
    provide: 'CURRENT_USER_ID',
    useFactory: (request: any) => request.user.id,
    inject: [Request],
};