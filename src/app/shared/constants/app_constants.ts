import { PostType } from '../models/post-types.enum';
import gql from 'graphql-tag';
import { description } from './fragments_constatnts';

export const appConstants = {

    icons : {
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

    fileS3Bucket: 'goalmarket-files',

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
      title: 'Goalmarket',
      description: 'Building Tech Skills, Business Skills & Leadership Skills for  Career Growth',
      twitter_card_large: 'summary_large_image',
      logo_url: 'https://www.goalmarket.io/assets/images/logo_qugbvk_c_scalew_282.png',
      gif_url: 'https://www.goalmarket.io/assets/images/cm.gif'
    },

    imageExtenstions: [
        "ase",
        "art",
        "bmp",
        "blp",
        "cd5",
        "cit",
        "cpt",
        "cr2",
        "cut",
        "dds",
        "dib",
        "djvu",
        "egt",
        "exif",
        "gif",
        "gpl",
        "grf",
        "icns",
        "ico",
        "iff",
        "jng",
        "jpeg",
        "jpg",
        "jfif",
        "jp2",
        "jps",
        "lbm",
        "max",
        "miff",
        "mng",
        "msp",
        "nitf",
        "ota",
        "pbm",
        "pc1",
        "pc2",
        "pc3",
        "pcf",
        "pcx",
        "pdn",
        "pgm",
        "PI1",
        "PI2",
        "PI3",
        "pict",
        "pct",
        "pnm",
        "pns",
        "ppm",
        "psb",
        "psd",
        "pdd",
        "psp",
        "px",
        "pxm",
        "pxr",
        "qfx",
        "raw",
        "rle",
        "sct",
        "sgi",
        "rgb",
        "int",
        "bw",
        "tga",
        "tiff",
        "tif",
        "vtf",
        "xbm",
        "xcf",
        "xpm",
        "3dv",
        "amf",
        "ai",
        "awg",
        "cgm",
        "cdr",
        "cmx",
        "dxf",
        "e2d",
        "egt",
        "eps",
        "fs",
        "gbr",
        "odg",
        "svg",
        "stl",
        "vrml",
        "x3d",
        "sxd",
        "v2d",
        "vnd",
        "wmf",
        "emf",
        "art",
        "xar",
        "png",
        "webp",
        "jxr",
        "hdp",
        "wdp",
        "cur",
        "ecw",
        "iff",
        "lbm",
        "liff",
        "nrrd",
        "pam",
        "pcx",
        "pgf",
        "sgi",
        "rgb",
        "rgba",
        "bw",
        "int",
        "inta",
        "sid",
        "ras",
        "sun",
        "tga"
    ],

    postQuery: gql`
    fragment Post on Post {
      _id
      name
      type
      categories
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
          jobProfile
        }
      }
      purchasedBy {
        name
        _id
        createdAt
        avatar
      }
      slug
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
      salaryRangeFrom
      salaryRangeTo
      cities {
        name
        _id
      }
      jobProfile
  
    }
    ${description}
    `
};
