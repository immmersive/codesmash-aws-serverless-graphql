resource "aws_lambda_function" "lambda" {
    filename            = "lambda_code.zip"
    function_name       = "${var.app_name}_${terraform.workspace}"
    role                = aws_iam_role.role.arn
    handler             = "lambda.handler"
    memory_size         = "128"
    timeout             = "60"

    source_code_hash    = "${filebase64sha256("lambda_code.zip")}"

    runtime             = "nodejs18.x"

    environment {
        variables = {
            region = var.region
            database = aws_dynamodb_table.dynamodb.id
        }
    }

    layers = [
      "arn:aws:lambda:us-east-1:339713098943:layer:aws-sdk-layer:1"
    ]
}