export const plans = [
    {
        id: 'plan_FutwAg74pxt8rs',
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
    },
    {
        id: 'plan_FvCWnZ7AJc8zVs',
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
    },
    {
        id: 'plan_FvCXuKSpsLGdTA',
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
    }
];
