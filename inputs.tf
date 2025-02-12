variable "app_name" {
    default     = ""
}

variable "region" {
    default     = ""
}

variable "bucket" {
    default     = ""
}

variable "partition_key" {
    default     = ""
}

variable "sort_key" {
    type    = string
    default = null
}

variable "columns" {
    type        = list(object({
        name        = string
        type        = string
    }))
    default     = []
}

variable "indexes" {
    type        = list(object({
        name        = string
        hash_key    = string
        range_key   = optional(string)
    }))
    default     = []
}

variable "appsync_config" {
  type = object({
    resolvers = list(object({
      type        = string
      field       = string
      operation   = string
      datasource  = string
    }))
  })

  default = {
    resolvers = [
      { type = "Query", field = "getUniversity", operation = "getItem", datasource = "lambda" },
      { type = "Mutation", field = "createUniversity", operation = "createItem", datasource = "lambda" }
    ]
  }
}
