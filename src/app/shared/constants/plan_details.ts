export const plans = {
  dev: {
    'software_developer': [
      {
        id: 'plan_GEOxM2fHMFLRYj',
        product_id: 'prod_FwdeAeZ0zF98Nj',
        name: 'Dream Job Starter',
        status: 'ACTIVE',
        description: 'Career plan',
       /**  shortDescription: 'Slow Pace',*/
        benefits: [
          'Dream Job Gap Analysis',
          // 'Team IQ',
          'Dream Job Training',
          // 'Business Skills Mentor',
          // 'Leadership Skills Mentoring'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Dream Job Gap Analysis',
            'Dream Job Training'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 29.99,
          postfix: 'per month'
        },
      },
      {
        id: 'plan_GEOzNfYW7nlzP0',
        product_id: 'prod_FwdeAeZ0zF98Nj',
        name: 'Interview Manager',
        status: 'ACTIVE',
        description: 'Team plan',
        // shortDescription: 'For Small Teams',
        benefits: [
          'Dream Job Gap Analysis',
          'Dream Job Training',
          'Interview Manager'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Dream Job Gap Analysis',
            'Dream Job Training',
            'Interview Manager'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 49.99,
          postfix: 'per month'
        },
      },
      {
        id: 'plan_GEOyjrDjrolxtM',
        product_id: 'prod_FwdeAeZ0zF98Nj',
        name: 'Hiring Manager',
        status: 'ACTIVE',
        description: 'Company plan',
        // shortDescription: 'For Large Teams',
        benefits: [
          'Dream Job Gap Analysis',
          'Dream Job Training',
          'Interview Manager',
          'Hiring Manager'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Dream Job Gap Analysis',
          'Dream Job Training',
          'Interview Manager',
          'Hiring Manager'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 99.99,
          postfix: 'per month',
        },
      }
    ],
    'business': [
      {
        id: 'plan_GEP8RvhJzs9nVR',
        product_id: 'prod_GEP8nA3tXkvO5m',
        name: 'Sales Advisor',
        status: 'ACTIVE',
        description: 'Sales Mentor',
        // shortDescription: 'For Individual Developers',
        benefits: [
            'Sales Target Goals',
            'Sales Gap Analysis',
            'Sales Manager'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Sales Target Goals',
            'Sales Gap Analysis',
            'Sales Manager'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 199.99,
          postfix: 'per month'
        },
      },
      {
        id: 'plan_GEP9j4dcbjTOCw',
        product_id: 'prod_GEP8nA3tXkvO5m',
        name: 'Sales Tech Team',
        status: 'ACTIVE',
        description: 'Medium Size Business',
        // shortDescription: 'For Small Teams',
        benefits: [
          'Sales Target Goals',
          'Sales Gap Analysis',
          'Sales Tech Mentor',
          'Sales Tech Team'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Sales Target Goals',
            'Sales Gap Analysis',
            'Sales Tech Mentor',
            'Sales Tech Team'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 999.99,
          postfix: 'per month'
        },
      },
      {
        id: 'plan_GEPAcSDOipQBjo',
        product_id: 'prod_GEP8nA3tXkvO5m',
        name: 'Sales AI Team',
        status: 'ACTIVE',
        description: 'Large Size Business',
        // shortDescription: 'For Large Teams',
        benefits: [
          'Sales Target Goals',
          'Sales Gap Analysis',
          'Sales AI Mentor',
          'Sales AI Team'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Sales Target Goals',
          'Sales Gap Analysis',
          'Sales AI Mentor',
          'Sales AI Team'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 1999.99,
          postfix: 'per month',
        },
      }
    ],
  },

  prod: {
    'software_developer': [
      {
        id: 'plan_GEP1xYks2bVvE5',
        product_id: 'prod_GEP1IoHYJzlADr',
        name: 'Developer Plan',
        status: 'ACTIVE',
        description: 'Career plan',
        shortDescription: 'For Individual Developers',
        benefits: [
          '1 Developer',
          'Team IQ',
          'Mock Interviews',
          'Business Skills Mentor',
          'Leadership Skills Mentoring'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            '1 Developer',
            'Team IQ',
            'Mock Interviews',
            'Business Skills Mentor',
            'Leadership Skills Mentoring'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 99.99,
          postfix: 'development/month'
        },
      },
      {
        id: 'plan_GEP1DdNwI9Zrtb',
        product_id: 'prod_GEP1IoHYJzlADr',
        name: 'Team Plan',
        status: 'ACTIVE',
        description: 'Team plan',
        shortDescription: 'For Small Teams',
        benefits: [
          '200 Developer',
          'Team IQ',
          'Mock Interviews',
          'Business Skills Mentor',
          'Leadership Skills Mentoring'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
          '<= 200 Developer',
          'Team IQ',
          'Mock Interviews',
          'Business Skills Mentor',
          'Leadership Skills Mentoring'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 74.99,
          postfix: 'user/month'
        },
      },
      {
        id: 'plan_GEP1fZWeCmOSac',
        product_id: 'prod_GEP1IoHYJzlADr',
        name: 'Corporate Plan',
        status: 'ACTIVE',
        description: 'Company plan',
        shortDescription: 'For Large Teams',
        benefits: [
          '> 200 Developer',
          'Team IQ',
          'Mock Interviews',
          'Business Skills Mentor',
          'Leadership Skills Mentoring'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            '1 Developer',
          'Team IQ',
          'Mock Interviews',
          'Business Skills Mentor',
          'Leadership Skills Mentoring'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 59.99,
          postfix: 'user/month',
        },
      }
    ],
    'business': [
      {
        id: 'plan_GEPCqSJ3DuEyoF',
        product_id: 'prod_GEPCE9oMF9cq3Z',
        name: 'Small Business',
        status: 'ACTIVE',
        description: 'Small Business',
        shortDescription: 'For Individual Developers',
        benefits: [
            'Unlimited Q & A',
            'Video Conference',
            '1 meetup/month',
            '1 Dedicated Innovation Manager 1 hour/month'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Unlimited Q & A',
            'Video Conference',
            '1 meetup/month',
            '1 Dedicated Innovation Manager 1 hour/month'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 99.99,
          postfix: 'development/month'
        },
      },
      {
        id: 'plan_GEPCtnP80YjXF0',
        product_id: 'prod_GEPCE9oMF9cq3Z',
        name: 'Medium Size Business',
        status: 'ACTIVE',
        description: 'Medium Size Business',
        shortDescription: 'For Small Teams',
        benefits: [
            'Unlimited Q & A',
            'Video Conference',
            '1 meetup/month',
            '2 Dedicated Innovation Manager 2 hours/month'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Unlimited Q & A',
            'Video Conference',
            '1 meetup/month',
            '2 Dedicated Innovation Managers 2 hours/month'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 199.99,
          postfix: 'user/month'
        },
      },
      {
        id: 'plan_GEPCz5LuXgpFVg',
        product_id: 'prod_GEPCE9oMF9cq3Z',
        name: 'Large Size Business',
        status: 'ACTIVE',
        description: 'Large Size Business',
        shortDescription: 'For Large Teams',
        benefits: [
            'Unlimited Q & A',
            'Video Conference',
            '1 meetup/month',
            '3 Dedicated Innovation Managers 3 hours/month'
        ],
        success: {
          message: 'Thanks For Choosing Us',
          successBenefits: [
            'Unlimited Q & A',
            'Video Conference',
            '1 meetup/month',
            '3 Dedicated Innovation Managers 3 hours/month'
          ],
        },
        fixed_price: {
          currency_code: 'USD',
          value: 299.99,
          postfix: 'user/month',
        },
      }
    ],

  }
};
