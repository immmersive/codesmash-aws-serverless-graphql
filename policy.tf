resource "aws_iam_policy" "policy" {
    name            = "${var.app_name}_${terraform.workspace}"
    description     = "${var.app_name}_${terraform.workspace}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement":
    [
        {
            "Action": "*",
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
EOF
}
