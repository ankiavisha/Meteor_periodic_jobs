import config from '../../../../server/config';
import {callSelfStorageAPI} from '../../helpers/method-helper';

import {ErrorLoggers} from '../../cron-error-logger/error-logger';

import moment from 'moment';

const updateFacilityHelper = {
  fetchDetailsFromAPI(data) {
    const {siteCode: SiteCode} = data;
    return new Promise((resolve, reject) => {
      const {ResponseFormat, GetUnitsWithInsuranceURL} = config.selfStorageAPI;   

      callSelfStorageAPI(
      'POST', 
      GetUnitsWithInsuranceURL, 
      {SiteCode, ResponseFormat, Date: moment().format('MM/DD/YYYY')}, 
      (err, res) => {
        if (err) {
          console.log('<=================err======================>',err)
          ErrorLoggers.insert({
            errorLoggerType: 'Self Storage premium update', 
            facilityId: data['_id'],
            name: data['name'],
            createdAt: new Date(),
            reason: err ? err.toString() : 'err while fetching'
          })
          return resolve({error: true});  
        }
        else {
          return resolve({data, apiResponse: res.data});
        }
      })
    });
  }
};

export default updateFacilityHelper;
