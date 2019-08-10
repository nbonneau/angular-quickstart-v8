export const HTTP_DEFAULT_CONFIG = {
    shared: true,
    retry: {
        attemps: 1,
        delay: 500,
        statuses: [
            502,
            504,
            0
        ]
    },
    timeout: 60000
};

export const AUTH_DEFAULT_CONFIG = {
    authRedirectUrl: '/',
    unauthRedirectUrl: '/login',
    authKey: 'auth_provider',
    tokenKey: 'auth_token',
    tokenType: 'Bearer',
    providers: []
};
