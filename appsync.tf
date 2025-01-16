resource "aws_appsync_graphql_api" "appsync" {
  authentication_type = "API_KEY"
  name                = "${var.app_name}_${terraform.workspace}_appsync"

  schema = <<EOF
    type University {
      universityId: ID!
      studentId: ID!
      uniName: String!
    }

    type Query {
      getUniversity(universityId: ID!, studentId: ID!): University
    }

    type Mutation {
      createUniversity(universityId: ID!, studentId: ID!, uniName: String!): University
    }

    type Subscription {
      addedUni: University
        @aws_subscribe(mutations: ["createUniversity"])
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
  EOF
}

resource "aws_appsync_api_key" "appsync" {
  api_id  = aws_appsync_graphql_api.appsync.id
  expires = "2024-12-23T04:00:00Z"
}

resource "aws_appsync_datasource" "lambda" {
  api_id           = aws_appsync_graphql_api.appsync.id
  name             = "${var.app_name}_${terraform.workspace}_resolver"
  service_role_arn = aws_iam_role.role.arn
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.lambda.arn
  }
}

resource "aws_appsync_resolver" "resolver" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = "Query"
  field       = "getUniversity"
  data_source = aws_appsync_datasource.lambda.name

  request_template = <<EOF
  {
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
      "operation": "getItem",
      "arguments": {
        "tableName": "${var.app_name}_${terraform.workspace}",
        "key": $util.toJson($context.arguments)
      }
    }
  }
  EOF

  response_template = <<EOF
    #if ($ctx.result)
      $utils.toJson($ctx.result)
    #else
      $utils.appendError("No data received from Lambda", "MappingTemplate")
    #end
  EOF
}

resource "aws_appsync_resolver" "resolver_mut" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = "Mutation"
  field       = "createUniversity"
  data_source = aws_appsync_datasource.lambda.name

  request_template = <<EOF
  {
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
      "operation": "createItem",
      "arguments": {
        "tableName": "${var.app_name}_${terraform.workspace}",
        "item": $util.toJson($context.arguments)
      }
    }
  }
  EOF

  response_template = <<EOF
    #if ($ctx.result)
      $utils.toJson($ctx.result)
    #else
      $utils.appendError("No data received from Lambda", "MappingTemplate")
    #end
  EOF
}
