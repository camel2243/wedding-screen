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
    password: 'camel2243',
  },
  slide: {
    /* The time interval between every pictures in milliseconds */
    intervalMs: 3000,
    /* The pictures url, by default we place pictures at public/images */
    urls: pics,
  },
  game: {
    /* The time interval for client to answering questions */
    intervalMs: 8 * 1000,
    /* An array of questions */
    questions: [
      {
        /* The question content */
        text: '請問新人的交往紀念日是幾月幾日?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          '12月31日',
          '11月/11日',
          '10月/31日',
          '01月/01日',
        ],
        /* The answer MUST be equal to one of the options */
        answer: '11月/11日',
      },
      {
        /* The question content */
        text: '請問新人目前交往了幾年?',
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
