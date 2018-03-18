import AWS from 'aws-sdk';
import s3 from 's3';

class DeleteS3Files {
  constructor() {
    console.log('<======Initialize the AWS======>');
    AWS.config.update({
      accessKeyId: Meteor.settings.AWSAccessKey,
      secretAccessKey: Meteor.settings.AWSSecretKey
    });
  }

  deleteBucketFiles() {
    const bucketInstance = new AWS.S3();
    const params = {
      Bucket: Meteor.settings.BucketName
    };
    this.emptyBucket(params, bucketInstance, (err, res) => {
      if (err) console.log('Check if you have sufficient permissions : ' + err); 
      else console.log('File deleted successfully');
    })
  }

  emptyBucket(params, bucketInstance, callback) {
    bucketInstance.listObjects(params, (err, data) => {
      if (err) return callback(err);
      if (data.Contents.length == 0) callback();
      params.Delete = {Objects:[]};
      data.Contents.forEach((content, index) => {
        if (content.Key.includes(Meteor.settings.BucketPath)) {
          params.Delete.Objects.push({Key: content.Key});  
        }
      });
      bucketInstance.deleteObjects(params, (err, data) => {
        if (err) return callback(err);
        else callback();
      });
    });
  }

  perform() {
    console.log('Deletion bucket job started - Running the job');
    this.deleteBucketFiles();
    console.log('Deletion bucket job Done');
    return true;
  }

};

export default DeleteS3Files;
