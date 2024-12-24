import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Context } from '../../context';
import { CONSTANTS } from '../../constants';

export class DatabaseStack extends cdk.Stack {
  public readonly photosBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const context = new Context();

    this.photosBucket = new s3.Bucket(this, 'PhotosBucket', {
      bucketName: context.getFullName(CONSTANTS.phothosBucketName),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
