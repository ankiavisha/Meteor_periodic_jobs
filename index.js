import Jobs from './crons/index';

const jobs = {
  start() {
    Object.keys(Jobs).forEach(function(job) {
      Jobs[job].start();
    })    
  } 
};

export default jobs;
