locals {
  appsync_config = jsondecode(jsonencode({
    schema = {
      types = [
        { name = "University", fields = ["universityId: ID!", "studentId: ID!", "uniName: String!"] },
        { name = "Query", fields = ["getUniversity(universityId: ID!, studentId: ID!): University"] },
        { name = "Mutation", fields = ["createUniversity(universityId: ID!, studentId: ID!, uniName: String!): University"] }
      ]
    }
    resolvers = [
      {
        type = "Query",
        field = "getUniversity",
        datasource = "lambda"
      },
      {
        type = "Mutation",
        field = "createUniversity",
        datasource = "lambda"
      }
    ]
    datasources = [
      {
        name = "lambda",
        type = "AWS_LAMBDA"
      }
    ]
  }))

  schema_sdl = join("\n\n", [
    for t in local.appsync_config.schema.types :
    "type ${t.name} {\n  ${join("\n  ", t.fields)}\n}"
  ])

  schema_sdl_with_root = <<EOF
${local.schema_sdl}

schema {
  query: Query
  mutation: Mutation
}
EOF
}



resource "aws_appsync_graphql_api" "appsync" {
  authentication_type = "API_KEY"
  name                = "${var.app_name}-${terraform.workspace}-appsync"

schema = local.schema_sdl_with_root
}

resource "aws_appsync_api_key" "appsync" {
  api_id  = aws_appsync_graphql_api.appsync.id
  expires = "2024-12-23T04:00:00Z"
}

resource "aws_appsync_datasource" "lambda" {
  api_id           = aws_appsync_graphql_api.appsync.id
  name             = "${var.app_name}_${terraform.workspace}_resolver"
  type             = "AWS_LAMBDA"
  service_role_arn = aws_iam_role.role.arn

  lambda_config {
    function_arn = aws_lambda_function.lambda.arn
  }
}

resource "aws_appsync_resolver" "query_resolver" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = local.appsync_config.resolvers[0].type
  field       = local.appsync_config.resolvers[0].field
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

resource "aws_appsync_resolver" "mutation_resolver" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = local.appsync_config.resolvers[1].type
  field       = local.appsync_config.resolvers[1].field
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
endif
EOF
}
