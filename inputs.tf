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
    schema = object({
      types = list(object({
        name   = string
        fields = list(string)
      }))
    })
    resolvers = list(object({
      type       = string
      field      = string
      datasource = string
    }))
    datasources = list(object({
      name = string
      type = string
    }))
  })
}
