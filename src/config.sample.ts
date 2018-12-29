import bunyan from 'bunyan';
import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { Omit } from 'utility-types';
import uuid from 'uuid';

/***************************
 * configuration starts here
 ***************************/

/*
 * The pictures location, we place pictures at public/images
 */
const pics = fs.readdirSync(path.resolve(__dirname, '../public/images_min'))
  .filter((f) => f.indexOf('.jpg') !== -1)
  .map((f) => `/images_min/${f}`);

const baseConfig = {
  admin: {
    /* The password of admin page */
    password: 'haapyweddingscreen',
  },
  slide: {
    /* The time interval between every pictures in milliseconds */
    intervalMs: 3000,
    /* The pictures url, by default we place pictures at public/images */
    urls: pics,
  },
  game: {
    /* The time interval for client to answering questions */
    intervalMs: 10 * 1000,
    /* An array of questions */
    questions: [
      {
        /* The question content */
        text: '第一題: 請問新郎與新娘名字是什麼?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          '張景緻 && 李佩寧',
          '張緊緻 && 李珮寧',
          '張景智 && 李珮寧',
          '張景智 && 李佩寧',
        ],
        /* The answer MUST be equal to one of the options */
        answer: '張景智 && 李珮寧',
      },
      {
        /* The question content */
        text: '第二題: 請問景智與珮寧在什麼時期在一起的?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          '國小',
          '國中',
          '高中',
          '大學',
        ],
        /* The answer MUST be equal to one of the options */
        answer: '國中',
      },
      {
        /* The question content */
        text: '第三題: 請問景智和珮寧的交往紀念日是幾月幾日?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          '12月31日',
          '11月11日',
          '10月31日',
          '01月01日',
        ],
        /* The answer MUST be equal to one of the options */
        answer: '11月11日',
      },
      {
        /* The question content */
        text: '第四題: 請問景智和珮寧目前交往了幾年?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          '5年',
          '8年',
          '10年',
          '11年',
        ],
        /* The answer MUST be equal to one of the options */
        answer: '11年',
      },
      {
        /* The question content */
        text: '最後一題: 請問景智與珮寧蜜月去了哪裡?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          '義大利',
          '馬爾地夫',
          '澎湖',
          '還沒出發',
        ],
        /* The answer MUST be equal to one of the options */
        answer: '澎湖',
      },
    ],
  },
  /* The logger options for bunyan logger, see {} */
  log: {
    name: 'logger',
    level: bunyan.DEBUG,
    src: true,
    // streams: [
    //   {
    //     type: 'rotating-file',
    //     path: '/var/log/foo.log',
    //     period: '1d',   // daily rotation
    //     count: 3,        // keep 3 back copies
    //   },
    // ],
  },
};
/***************************
 * configuration ends here
 ***************************/

export const config = lodash.merge(baseConfig, {
  slide: {
    oneRoundMs: baseConfig.slide.intervalMs * baseConfig.slide.urls.length,
  },
  game: {
    questions: baseConfig.game.questions.map((q) => {
      const options = q.options.map((o) => ({ id: uuid.v1(), text: o }));
      const answer = options.find((o) => o.text === q.answer)!;
      const omitted: Omit<typeof q, 'options' | 'answer'> = lodash.omit(q, ['options', 'answer']);

      return Object.assign(
        omitted,
        {
          answer,
          options,
          id: uuid.v1(),
        });
    }),
  },
});
