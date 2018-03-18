import {Facilities} from '../../facilities/facilities';
import _ from 'lodash';
import moment from 'moment';

import updateFacilityHelper from '../method-helpers/update-facility-helper';

class UpdateSelfStorageHelper {
  constructor() {
    console.log('<======UpdateSelfStorageHelper======>');
  }

  setPromisesResponse(promisesResponse) {
    if (!promisesResponse || !promisesResponse.length) return;
    let erroContainFacilities = [];
    promisesResponse.forEach((res) => {
      const {data, apiResponse, error} = res;
      if (error) return;
      const {monthlyPremiums, totalPolicies} = this.getRequiredParams(apiResponse);
      Facilities.update(
        {_id: data['_id']},
        {'$set': 
          {
            'siteInformationFields.monthlyPremium': monthlyPremiums, 
            'siteInformationFields.totalPolicies': totalPolicies
          }
        }
      )
    })
  }

  getRequiredParams(response) {
    const filteredUnitNumber = _.groupBy(response, 'UnitNumber');
    let totalPolicies = 0, monthlyPremiums = 0;
    Object.keys(filteredUnitNumber).forEach((key) => {
      const arrKeyWise = filteredUnitNumber[key];
      if (arrKeyWise.length == 1) {
        if (!isNaN(arrKeyWise[0].MonthlyFee)) {
          monthlyPremiums = monthlyPremiums + parseFloat(arrKeyWise[0].MonthlyFee)
        }  
        totalPolicies = totalPolicies + 1;
      } else {
        let obj = {};
        arrKeyWise.forEach((data) => {
          const {CoverageAmount, CoverageDescription} = data;
          const uniqStr = `${CoverageAmount} ${CoverageDescription}`;
          if (!obj[uniqStr]) {
            obj[uniqStr] = data;  
            totalPolicies = totalPolicies + 1;
            if (!isNaN(arrKeyWise[0].MonthlyFee)) {
              monthlyPremiums = monthlyPremiums + parseFloat(arrKeyWise[0].MonthlyFee)  
            }
          }
        })
      }
    });  
    return {monthlyPremiums, totalPolicies}
  }

  updateSelfStorageFacilities() {
    const query = {'facilitySettingsFields.managementSoftware': 'SelfStorage'};
    const facilities = Facilities.find(query).fetch();
    const promises = [];
    facilities.forEach((facility, index) => {
      const facilityData = {
        _id: facility['_id'],
        name: facility.siteInformationFields.fullLegalName,
        siteCode: facility.siteInformationFields.locationNumber
      };
      promises.push(() => updateFacilityHelper.fetchDetailsFromAPI(facilityData));  
    })
    const resolvePromises = Meteor.wrapAsync(function(promises, callback) {
      Promise.all(promises.map((promise) => promise()))
        .then((res) => callback(false, {'response': res}))
        .catch((err) => console.log('err while handling the promises'))
    })
    const promiseRes = resolvePromises(promises);
    this.setPromisesResponse(promiseRes['response'])
  }

  perform() {
    try {
      this.updateSelfStorageFacilities();  
    } catch(e) {
      console.error(`Error while performing periodic job self storage; details: ${e}`);
    }
    
  }

}  

export default UpdateSelfStorageHelper;
