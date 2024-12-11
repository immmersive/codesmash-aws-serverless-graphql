output "dynamodb_id" {
    value = aws_dynamodb_table.dynamodb.id
}

output "aws_lambda_function" {
    value = aws_lambda_function.lambda.function_name
}

output "appsync_name" {
  value = aws_appsync_graphql_api.appsync.name
}

output "appsync_id" {
  value = aws_appsync_graphql_api.appsync.id
}

output "appsync_url" {
  value = aws_appsync_graphql_api.appsync.uris
}
