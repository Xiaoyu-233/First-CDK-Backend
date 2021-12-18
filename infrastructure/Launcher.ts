import { MyStack } from './MyStack'
import { App } from 'aws-cdk-lib'

const app = new App()
new MyStack(app, 'First-CDK', {
    stackName: 'MyFirstCdkProject'
})