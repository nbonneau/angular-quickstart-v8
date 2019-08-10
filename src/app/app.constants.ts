export const HTTP_DEFAULT_CONFIG = {
    wait: true,
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
