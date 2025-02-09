import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Context } from '../../context';
import { CONSTANTS } from '../../constants';
import * as path from 'path';
import * as logs from 'aws-cdk-lib/aws-logs';

const lambdasPath = path.join(__dirname, '../../src/lambdas');

export class ComputeStack extends cdk.Stack {
  public readonly countLambda: lambda.IFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const context = new Context();

    const textsBucketName = context.getFullName(CONSTANTS.textsBucketName);

    this.countLambda = new lambdanodejs.NodejsFunction(this, 'count', {
      functionName: context.getFullName('count'),
      entry: path.join(lambdasPath, 'count', 'index.ts'),
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(3),
      environment: {
        BUCKET_NAME: textsBucketName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:GetObject',
            's3:DeleteObject'
          ],
          resources: [
            `arn:aws:s3:::${textsBucketName}/input/*`
          ]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:PutObject',
          ],
          resources: [
            `arn:aws:s3:::${textsBucketName}/output/*`
          ]
        })
      ],
      logRetention: logs.RetentionDays.ONE_DAY
    });
  }
}
