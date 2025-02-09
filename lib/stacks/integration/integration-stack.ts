import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface IntegrationStackProps extends cdk.StackProps {
  textsBucket: s3.IBucket;
  countLambda: lambda.IFunction;
}

export class IntegrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IntegrationStackProps) {
    super(scope, id, props);

    const { textsBucket, countLambda } = props;

    textsBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(countLambda),
      { prefix: "input/" }
    );
  }
}
