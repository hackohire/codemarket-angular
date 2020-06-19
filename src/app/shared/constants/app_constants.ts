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
    [PostType.Event]: 'calendar-plus',
    [PostType.Goal]: 'bullseye-arrow',
    [PostType.Dreamjob]: 'briefcase',
    [PostType.Job]: 'briefcase',
    [PostType.Bug]: 'bug',
    [PostType.Challenge]: 'puzzle-piece',
    [PostType.Class]: 'briefcase',
    [PostType.Service]: 'briefcase',
    [PostType.CompetitiveAdvantage]: 'briefcase',
    [PostType.Assignment]: 'sticky-note',
    [PostType.Question]: 'sticky-note',
    [PostType.Note]: 'sticky-note',
    [PostType.Business]: 'sticky-note',
    [PostType.Blog]: 'blog',
    [PostType.Mentor]: 'briefcase',
    [PostType.Survey]: 'briefcase',
  },

  fileS3Bucket: 'manav-files',

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

  videoChat: {
    callerTimeout: 25000,
    receiverTimout: 27000,
    callingTune: 'https://notificationsounds.com/soundfiles/f0e52b27a7a5d6a1a87373dffa53dbe5/file-sounds-1121-overzealous.wav'
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
      referencePostUrl
      price
      status
      createdAt
      updatedAt
      descriptionHTML
      tags {
        name
        _id
      }
      comments {
        ...Comments
      }
      commentCount
      users {
        _id
        name
        avatar
      }
      createdBy {
        _id
        name
        slug
        email
        avatar
        currentJobDetails {
          jobProfile {
            name
            _id
            type
          }
        }
      }
      slug
      comments {
        _id
        type
        referenceId
        parentId
        createdAt
        createdBy {
          _id
          name
          avatar
          slug
        }
        blockId
        blockSpecificComment
      }
      cover
      companies {
        name
        _id
      }
      cities {
        name
        _id
      }

      connectedPosts {
        name
        slug
        _id
      }

      collaborators {
        _id
        name
        avatar
        slug
      }

      clients {
        _id
        name
        slug
      }

      phone
      email
      birthDate
      address
      website

      activities {
        action
        activityDate
        by {
          _id
          name
        }
        commentId
        postId
        message
      }

      booking
      
      appointment_date
      cancelReason
      duration
      job
      mentor
      formStructureJSON
    }
    ${comment}
    `,

  postTypesArray: [
    { name: PostType.Assignment, label: 'Assignment' },
    { name: PostType.Appointment, label: 'Appointment' },
    { name: PostType.Blog, label: 'Blog' },
    { name: PostType.Bug, label: 'Bug' },
    { name: PostType.Business, label: 'Business' },
    { name: PostType.Challenge, label: 'Challenge' },
    { name: PostType.Class, label: 'Class' },
    { name: PostType.CompetitiveAdvantage, label: 'Competitive Advantage' },
    { name: PostType.Contact, label: 'Contact' },
    { name: PostType.Dreamjob, label: 'Dream Job' },
    { name: PostType.Event, label: 'Event' },
    { name: PostType.Goal, label: 'Goal' },
    { name: PostType.Howtodoc, label: 'How-To-Doc' },
    { name: PostType.Interview, label: 'Interview' },
    {
      name: PostType.Job,
      label: 'Job',
      titlePlaceholder: 'Enter Job Title',
      descriptionPlaceholder: 'Enter Job Description',
      hideCollaborators: true,
      hideClients: true,
      hideCompany: true,
      showJobProfile: true,
      hideTags: true
    },
    {
      name: PostType.Mentor,
      label: 'Mentor',
      titlePlaceholder: 'Enter Mentorship Title',
      descriptionPlaceholder: 'Enter Details about your mentorship session',
      hideCollaborators: true,
      hideCompany: true,
      hideClients: true,
      hideTags: true
    },
    { name: PostType.Note, label: 'Notes' },
    { name: PostType.Product, label: 'Product' },
    { name: PostType.Question, label: 'Questions' },
    { name: PostType.Requirement, label: 'Requirement' },
    { name: PostType.Service, label: 'Service' },
    { name: PostType.Testing, label: 'Testing' },
    { name: PostType.Forms, label: 'Forms' },
    { name: PostType.Survey, label: 'Survey' },
  ],
};
