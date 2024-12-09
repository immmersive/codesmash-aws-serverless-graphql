import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const field = event.fieldName;

  if (field === "getUniversity") {
    const studentId = event.arguments?.studentId || event.studentId;
    const universityId = event.arguments?.universityId || event.universityId;

    const params = {
      TableName: "uniapi002_default",
      Key: {
        universityId,
        studentId
      },
    };

    try {
      const data = await dynamoDB.get(params).promise();
      console.log("DynamoDB response:", JSON.stringify(data, null, 2));

      if (!data.Item) {
        throw new Error(`University with ID "${universityId}" and Student ID "${studentId}" not found`);
      }

      return {
        universityId: data.Item.universityId,
        uniName: data.Item.uniName,
        studentId: data.Item.studentId
      };
    } catch (error) {
      console.error("Error fetching university:", error);
      throw new Error("Could not fetch university data");
    }
  }

  if (field === "createUniversity") {
    const studentId = event.arguments?.studentId || event.studentId;
    const universityId = event.arguments?.universityId || event.universityId;
    const uniName = event.arguments?.uniName || event.uniName;

    const params = {
      TableName: "uniapi002_default",
      Item: {
        universityId,
        studentId,
        uniName
      },
      ConditionExpression: "attribute_not_exists(universityId) AND attribute_not_exists(studentId)"
    };

    try {
      await dynamoDB.put(params).promise();
      console.log("University created successfully:", params.Item);

      return params.Item;
    } catch (error) {
      console.error("Error creating university:", error);
      throw new Error("Could not create university data");
    }
  }

  throw new Error(`Unknown field: ${field}`);
};
