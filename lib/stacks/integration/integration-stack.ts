import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface IntegrationStackProps extends cdk.StackProps {
  photosBucket: s3.IBucket;
  filterLambda: lambda.IFunction;
}

export class IntegrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IntegrationStackProps) {
    super(scope, id, props);

    const { photosBucket, filterLambda } = props;

    photosBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(filterLambda),
      { prefix: "input/" }
    );
  }
}
