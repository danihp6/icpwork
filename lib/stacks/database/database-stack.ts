import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Context } from '../../context';
import { CONSTANTS } from '../../constants';

export class DatabaseStack extends cdk.Stack {
  public readonly textsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const context = new Context();

    this.textsBucket = new s3.Bucket(this, 'bucket', {
      bucketName: context.getFullName(CONSTANTS.textsBucketName),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
