import {CronJob} from 'cron';
import SiteLinkConfig from '../../../../server/config';

import Jobs from '../jobs';
import DeleteS3Files from '../job-helpers/delete-files-s3-helper';

/***
  * Run job at 6AM
  * Timezone - America/Los_Angeles SiteLinkConfig.timeZone
  * India - 'Asia/Calcutta'
  * CronTime - '59 59 05 * * *' 
***/  

const deleteFilesFromS3Job = new CronJob({
  cronTime: '59 59 05 * * *', 
  onTick: Meteor.bindEnvironment(function() {
    console.log('<==============periodic job delete files===============>')
    const deleteS3FilesInstanc = new DeleteS3Files;
    deleteS3FilesInstanc.perform();
    deleteFilesFromS3Job.stop();
  }),
  onComplete: function () {
    console.log('<======complete periodic job delete files=====>');
    Jobs.upsert({eventName: 'DeleteS3Files'}, {$set: {lastOccurence: new Date()}});
  },
  start: false,
  timeZone: SiteLinkConfig.timeZone
});

export default deleteFilesFromS3Job;

