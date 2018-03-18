import {CronJob} from 'cron';
import SiteLinkConfig from '../../../../server/config';

import Jobs from '../jobs';
import UpdateSelfStorageFacilities from '../job-helpers/update-facility-helper';

/***
  * Run job at 4AM
  * Timezone - America/Los_Angeles SiteLinkConfig.timeZone
  * India - 'Asia/Calcutta'
  * CronTime - '59 59 3 * * *' 
***/  

const updateSelfStorageFacilityJob = new CronJob({
  cronTime: '59 59 03 * * *', 
  onTick: Meteor.bindEnvironment(function() {
    console.log('<==============start periodic job update self storage facility===============>')
    const UpdateSelfStorageFacilityInstanc = new UpdateSelfStorageFacilities;
    UpdateSelfStorageFacilityInstanc.perform();
    updateSelfStorageFacilityJob.stop();
  }),
  onComplete: function () {
    console.log('<=====complete periodic job update self storage facility=====>');
    Jobs.upsert({eventName: 'Update Self Storage Facility details'}, {$set: {lastOccurence: new Date()}});
  },
  start: false,
  timeZone: SiteLinkConfig.timeZone
});

export default updateSelfStorageFacilityJob;

