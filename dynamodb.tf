resource "aws_dynamodb_table" "dynamodb" {
    hash_key         = "${var.partition_key}"
    range_key        = "${var.sort_key}"
    name             = "${var.app_name}_${terraform.workspace}"
    stream_enabled   = true
    stream_view_type = "NEW_AND_OLD_IMAGES"
    billing_mode     = "PAY_PER_REQUEST"

    point_in_time_recovery {
        enabled = true
    }

    dynamic "attribute" {
        for_each = var.columns
        content {
            name = attribute.value.name
            type = attribute.value.type
        }
    }

    dynamic "global_secondary_index" {
        for_each = var.indexes
        content {
            name = global_secondary_index.value.name
            hash_key = global_secondary_index.value.hash_key
            range_key = can(global_secondary_index.value.range_key) ? global_secondary_index.value.range_key : null
            projection_type = "ALL"
        }
    }
}
