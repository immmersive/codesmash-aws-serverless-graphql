resource "aws_appsync_graphql_api" "appsync" {
  authentication_type = "API_KEY"
  name                = "${var.app_name}-${terraform.workspace}-appsync"
  schema              = file("./schema.txt")
}

resource "aws_appsync_api_key" "appsync" {
  api_id  = aws_appsync_graphql_api.appsync.id
  expires = timeadd(timestamp(), "8736h")
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

resource "aws_appsync_resolver" "resolvers" {
  for_each = { for r in var.appsync_config.resolvers : "${r.type}_${r.field}_${r.operation}" => r }

  api_id      = aws_appsync_graphql_api.appsync.id
  type        = each.value.type
  field       = each.value.field
  data_source = aws_appsync_datasource.lambda.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "operation": "${each.value.operation}",
    "type": "${each.value.type}",
    "field": "${each.value.field}",
    "arguments": {
      "tableName": "${var.app_name}_${terraform.workspace}",
      "key": $util.toJson($context.arguments)
    }
  }
}
EOF

  response_template = <<EOF
#if ($ctx.result)
    #set($body = $utils.parseJson($ctx.result.body))
    $utils.toJson($body)
#else
    $util.error("No result from Lambda function", "LambdaError")
#end
EOF
}
