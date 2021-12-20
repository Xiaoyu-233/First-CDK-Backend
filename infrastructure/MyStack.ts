import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { join } from 'path'
import { GenericTable } from './GenericTable'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

export class MyStack extends Stack{

    private api = new RestApi(this, 'helloAPI')
    private firstTable = new GenericTable(
        'MyFirstTable',
        'tableId',
        this
    )

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        // Lambda function written in JS
        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        })

        // Lambda function written in TS and compiled by CDK Node Lambda
        const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
            entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
            handler: 'handler'
        })
        const s3ListPolicy = new PolicyStatement()
        s3ListPolicy.addActions('s3:ListAllMyBuckets')
        s3ListPolicy.addResources('*')
        helloLambdaNodeJs.addToRolePolicy(s3ListPolicy)
        

        // Hello API Lambda integration:
        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs)
        const helloLambdaResource = this.api.root.addResource('hello')
        helloLambdaResource.addMethod('GET', helloLambdaIntegration)
    }

}