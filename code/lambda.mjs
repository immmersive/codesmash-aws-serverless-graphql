import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { operation, arguments: args } = event;

  if (!operation) {
    throw new Error("Operation is required");
  }

  switch (operation) {
    case "getItem": {
      const { tableName, key } = args;

      if (!tableName || !key) {
        throw new Error("Missing required arguments: 'tableName' or 'key'");
      }

      const params = {
        TableName: tableName,
        Key: key,
      };

      try {
        const data = await dynamoDB.get(params).promise();
        console.log("DynamoDB response:", JSON.stringify(data, null, 2));

        if (!data.Item) {
          throw new Error(`Item not found with key: ${JSON.stringify(key)}`);
        }

        return data.Item;
      } catch (error) {
        console.error("Error fetching item:", error);
        throw new Error("Could not fetch data");
      }
    }

    case "createItem": {
      const { tableName, item } = args;

      if (!tableName || !item) {
        throw new Error("Missing required arguments: 'tableName' or 'item'");
      }

      const params = {
        TableName: tableName,
        Item: item,
        ConditionExpression: Object.keys(item)
          .map((key) => `attribute_not_exists(${key})`)
          .join(" AND "),
      };

      try {
        await dynamoDB.put(params).promise();
        console.log("Item created successfully:", params.Item);

        return params.Item;
      } catch (error) {
        console.error("Error creating item:", error);
        throw new Error("Could not create data");
      }
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};
