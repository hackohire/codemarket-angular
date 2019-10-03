export const plans = [
    {
        id: 'P-61W32221LN4700839LWIPWHA',
        product_id: 'PROD-55E73002WF4721926',
        name: 'Developer Plan',
        status: 'ACTIVE',
        description: 'Career plan',
        shortDescription: 'For small and medium-sized businesses',
        benefits: [
            '1 Developer',
            'Unlimited events',
            'Unlimited Friend Invitations'
        ],
        billing_cycles: [
            {
                pricing_scheme: {
                    version: 1,
                    fixed_price: {
                        currency_code: 'USD',
                        value: '39.99',
                        postfix: 'development/month'
                    },
                    create_time: '2019-09-29T18:42:36Z',
                    update_time: '2019-09-29T18:42:36Z'
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
        create_time: '2019-09-29T18:42:36Z',
        update_time: '2019-09-29T18:42:36Z',
        links: [
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-61W32221LN4700839LWIPWHA',
                rel: 'self',
                method: 'GET'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-61W32221LN4700839LWIPWHA',
                rel: 'edit',
                method: 'PATCH'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-61W32221LN4700839LWIPWHA/deactivate',
                rel: 'self',
                method: 'POST'
            }
        ]
    },
    {
        id: 'P-1M429262C2944183LLWIPYJQ',
        product_id: 'PROD-55E73002WF4721926',
        name: 'Team Plan',
        status: 'ACTIVE',
        description: 'Team plan',
        shortDescription: 'For small and medium-sized businesses',
        benefits: [
            '20 Developers',
            'Unlimited events',
            'Unlimited Friend Invitations'
        ],
        billing_cycles: [
            {
                pricing_scheme: {
                    version: 1,
                    fixed_price: {
                        currency_code: 'USD',
                        value: '35.99',
                        postfix: 'user/month'
                    },
                    create_time: '2019-09-29T18:47:02Z',
                    update_time: '2019-09-29T18:47:02Z'
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
        create_time: '2019-09-29T18:47:02Z',
        update_time: '2019-09-29T18:47:02Z',
        links: [
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-1M429262C2944183LLWIPYJQ',
                rel: 'self',
                method: 'GET'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-1M429262C2944183LLWIPYJQ',
                rel: 'edit',
                method: 'PATCH'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-1M429262C2944183LLWIPYJQ/deactivate',
                rel: 'self',
                method: 'POST'
            }
        ]
    },
    {
        id: 'P-4SJ220119W888622VLWIP2CA',
        product_id: 'PROD-55E73002WF4721926',
        name: 'Corporate Plan',
        status: 'ACTIVE',
        description: 'Company plan',
        shortDescription: 'For small and medium-sized businesses',
        benefits: [
            '>20 Developers',
            'Unlimited events',
            'Unlimited Friend Invitations'
        ],
        billing_cycles: [
            {
                pricing_scheme: {
                    version: 1,
                    fixed_price: {
                        currency_code: 'USD',
                        value: '29.99',
                        postfix: 'user/month',
                    },
                    create_time: '2019-09-29T18:50:48Z',
                    update_time: '2019-09-29T18:50:48Z'
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
        create_time: '2019-09-29T18:50:48Z',
        update_time: '2019-09-29T18:50:48Z',
        links: [
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-4SJ220119W888622VLWIP2CA',
                rel: 'self',
                method: 'GET'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-4SJ220119W888622VLWIP2CA',
                rel: 'edit',
                method: 'PATCH'
            },
            {
                href: 'https://api.sandbox.paypal.com/v1/billing/plans/P-4SJ220119W888622VLWIP2CA/deactivate',
                rel: 'self',
                method: 'POST'
            }
        ]
    }
];
