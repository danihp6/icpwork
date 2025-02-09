#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ComputeStack, DatabaseStack, IntegrationStack } from '../lib/stacks';
import { Context } from '../lib/context';

const app = new cdk.App();
const context = new Context();

const computeStack = new ComputeStack(app, context.getFullName('ComputeStack'));
const databaseStack = new DatabaseStack(app, context.getFullName('DatabaseStack'));
new IntegrationStack(app, context.getFullName('IntegrationStack'), {
  textsBucket: databaseStack.textsBucket,
  countLambda: computeStack.countLambda
});