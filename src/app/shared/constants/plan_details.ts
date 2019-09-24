export const plans = [
    {
        id: 'P-6L545048NJ143234WLWER2CI',
        product_id: 'PROD-55E73002WF4721926',
        name: 'Unlimited Plan',
        status: 'ACTIVE',
        description: 'Unlimited plan',
        billing_cycles: [
            {
                pricing_scheme: {
                    version: 1,
                    fixed_price: {
                        currency_code: 'USD',
                        value: '145.0'
                    },
                    create_time: '2019-09-23T19:29:13Z',
                    update_time: '2019-09-23T19:29:13Z'
                },
                frequency: {
                    interval_unit: 'MONTH',
                    interval_count: 1
                },
                tenure_type: 'REGULAR',
                sequence: 1,
                total_cycles: 6
            }
        ],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                currency_code: 'USD',
                value: '0.0'
            },
            setup_fee_failure_action: 'CONTINUE',
            payment_failure_threshold: 3
        },
        taxes: {
            percentage: '10.0',
            inclusive: false
        },
        quantity_supported: false,
        create_time: '2019-09-23T19:29:13Z',
        update_time: '2019-09-23T19:29:13Z',
        links: [
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-6L545048NJ143234WLWER2CI',
                rel: 'self',
                method: 'GET'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-6L545048NJ143234WLWER2CI',
                rel: 'edit',
                method: 'PATCH'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-6L545048NJ143234WLWER2CI/deactivate',
                rel: 'self',
                method: 'POST'
            }
        ]
    },
    {
        id: 'P-6WS74521Y1808750PLWENKCQ',
        product_id: 'PROD-55E73002WF4721926',
        name: 'Ambition Plan',
        status: 'ACTIVE',
        description: 'Ambition plan',
        billing_cycles: [
            {
                pricing_scheme: {
                    version: 1,
                    fixed_price: {
                        currency_code: 'USD',
                        value: '99.0'
                    },
                    create_time: '2019-09-23T14:22:02Z',
                    update_time: '2019-09-23T14:22:02Z'
                },
                frequency: {
                    interval_unit: 'MONTH',
                    interval_count: 1
                },
                tenure_type: 'REGULAR',
                sequence: 1,
                total_cycles: 6
            }
        ],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                currency_code: 'USD',
                value: '0.0'
            },
            setup_fee_failure_action: 'CONTINUE',
            payment_failure_threshold: 3
        },
        taxes: {
            percentage: '10.0',
            inclusive: false
        },
        quantity_supported: false,
        create_time: '2019-09-23T14:22:02Z',
        update_time: '2019-09-23T14:22:02Z',
        links: [
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-6WS74521Y1808750PLWENKCQ',
                rel: 'self',
                method: 'GET'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-6WS74521Y1808750PLWENKCQ',
                rel: 'edit',
                method: 'PATCH'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-6WS74521Y1808750PLWENKCQ/deactivate',
                rel: 'self',
                method: 'POST'
            }
        ]
    }
];
