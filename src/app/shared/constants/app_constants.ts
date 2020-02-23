import { PostType } from '../models/post-types.enum';
import gql from 'graphql-tag';
import { description, comment } from './fragments_constatnts';

export const appConstants = {

  icons: {
    [PostType.Product]: 'lightbulb-dollar',
    [PostType.Interview]: 'user-tie',
    [PostType.Requirement]: 'file-alt',
    [PostType.HelpRequest]: 'question-circle',
    [PostType.Howtodoc]: 'file-exclamation',
    [PostType.Testing]: 'tasks',
    [PostType.Teamskill]: 'users-crown',
    [PostType.Design]: 'marker',
    [PostType.Event]: 'calendar-plus',
    [PostType.Goal]: 'bullseye-arrow',
    [PostType.Dreamjob]: 'briefcase'
  },

  fileS3Bucket: 'codemarket-files',

  promoCodes: {
    FIRSTMONTHFREE: {
      title: 'FIRSTMONTHFREE',
      message: 'First Month Free!',
      applied: false
    },
    CODE50: {
      title: 'CODE50',
      message: 'Promocode Applied',
      applied: false
    }
  },

  SEO: {
    title: 'Codemarket',
    description: 'Building Tech Skills, Business Skills & Leadership Skills for  Career Growth',
    twitter_card_large: 'summary_large_image',
    logo_url: 'https://www.codemarket.io/assets/images/logo_qugbvk_c_scalew_282.png',
    gif_url: 'https://www.codemarket.io/assets/images/cm.gif'
  },

  careerCoachQuestions: {
    gapAnalysis: 'I can do resume gap analysis',
    careerCoachSessions: 'I can take part in weekly 30 mins career coach sessions',
    helpingWithMockInterviews: 'I can take part in helping with mock interviews',
    hiringMentoringSessions: 'I can take part in hiring mentoring sessions'
  },

  businessCoachQuestions: {
    businessCoachSessions: 'Can You Take Part In Weekly 30 Mins Business Coaching?',
    cities: 'In which cities can you provide business coaching?',
    roles: 'What would you like to gain from business coaching? (Dream Job positions)',
    companies: 'What are all companies can you coach?',
    businessAreas: 'In what business areas can you provide business coaching?',
    businessGoals: 'What business goals can you help with your coaching?',
    businessChallenges: 'What business challenges can you give coaching for?',
    sellProducts: 'Do you sell any products?',
    sellServices: 'Do you sell any services?'
  },

  Notification: 'https://notificationsounds.com/soundfiles/4e4b5fbbbb602b6d35bea8460aa8f8e5/file-sounds-1096-light.wav',

  imageExtenstions: [
    'ase',
    'art',
    'bmp',
    'blp',
    'cd5',
    'cit',
    'cpt',
    'cr2',
    'cut',
    'dds',
    'dib',
    'djvu',
    'egt',
    'exif',
    'gif',
    'gpl',
    'grf',
    'icns',
    'ico',
    'iff',
    'jng',
    'jpeg',
    'jpg',
    'jfif',
    'jp2',
    'jps',
    'lbm',
    'max',
    'miff',
    'mng',
    'msp',
    'nitf',
    'ota',
    'pbm',
    'pc1',
    'pc2',
    'pc3',
    'pcf',
    'pcx',
    'pdn',
    'pgm',
    'PI1',
    'PI2',
    'PI3',
    'pict',
    'pct',
    'pnm',
    'pns',
    'ppm',
    'psb',
    'psd',
    'pdd',
    'psp',
    'px',
    'pxm',
    'pxr',
    'qfx',
    'raw',
    'rle',
    'sct',
    'sgi',
    'rgb',
    'int',
    'bw',
    'tga',
    'tiff',
    'tif',
    'vtf',
    'xbm',
    'xcf',
    'xpm',
    '3dv',
    'amf',
    'ai',
    'awg',
    'cgm',
    'cdr',
    'cmx',
    'dxf',
    'e2d',
    'egt',
    'eps',
    'fs',
    'gbr',
    'odg',
    'svg',
    'stl',
    'vrml',
    'x3d',
    'sxd',
    'v2d',
    'vnd',
    'wmf',
    'emf',
    'art',
    'xar',
    'png',
    'webp',
    'jxr',
    'hdp',
    'wdp',
    'cur',
    'ecw',
    'iff',
    'lbm',
    'liff',
    'nrrd',
    'pam',
    'pcx',
    'pgf',
    'sgi',
    'rgb',
    'rgba',
    'bw',
    'int',
    'inta',
    'sid',
    'ras',
    'sun',
    'tga'
  ],

  postQuery: gql`
    fragment Post on Post {
      _id
      name
      type
      categories
      referencePostUrl
      description {
        ...Description
      }
      price
      status
      createdAt
      updatedAt
      tags {
        name
        _id
      }
      comments {
        ...Comment
      }
      support {
        time
        description {
          ...Description
        }
      }
      likeCount
      createdBy {
        _id
        name
        avatar
        currentJobDetails {
          jobProfile {
            name
            _id
            type
          }
        }
      }
      purchasedBy {
        name
        _id
        createdAt
        avatar
      }
      slug
      connectedWithUser {
        _id
        name
        avatar
      }
    

      comments {
        text {
          ...Description
        }
        _id
        type
        referenceId
        parentId
        createdAt
        createdBy {
          _id
          name
          avatar
        }
        blockId
        blockSpecificComment
      }

      dateRange
      address
      eventType
      cover
      usersAttending {
        name
        _id
        avatar
      }
      location {
        longitude
        latitude
        address
      }
      company {
        name
        _id
      }
      companies {
        name
        _id
      }

      salaryCurrency
      salaryRangeFrom
      salaryRangeTo
      cities {
        name
        _id
      }

      gapAnalysis
      careerCoachSessions
      helpingWithMockInterviews
      hiringMentoringSessions

      businessCoachSessions,
      businessAreas {
        name
        _id
        type
      }
      businessGoals {
        name
        _id
        type
      }
      businessChallenges {
        name
        _id
        type
      }
      sellProducts {
        sellProducts
        products {
          name
          _id
          type
        }
      }
      sellServices {
        sellServices
        services {
          name
          _id
          type
        }
      }

      fundingCurrency
      fundingAmount
      fundingBy {
        name
        _id
      }
      fundingTo {
        name
        _id
      }
      fundingDate
      fundingProcess {
        ...Description
      }

      hiringProcess {
        ...Description
      }

      collaborators {
        _id
        name
      }

      jobProfile {
        _id
        name
        type
      }
      timeline
  
    }
    ${description}
    ${comment}
    `
};
