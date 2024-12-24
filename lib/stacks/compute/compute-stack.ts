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
  public readonly filterLambda: lambda.IFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const context = new Context();

    const photosBucketName = context.getFullName(CONSTANTS.phothosBucketName);

    this.filterLambda = new lambdanodejs.NodejsFunction(this, 'filter', {
      functionName: context.getFullName('filter'),
      entry: path.join(lambdasPath, 'filter', 'index.ts'),
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(3),
      initialPolicy: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:GetObject',
            's3:PutObject',
            's3:DeleteObject'
          ],
          resources: [
            `arn:aws:s3:::${photosBucketName}/*`
          ]
        })
      ],
      logRetention: logs.RetentionDays.ONE_DAY
    });
  }
}
