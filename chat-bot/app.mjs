/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

async function getUserInfo() {
  const userInfo = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/user-info/"
  );

  return userInfo.json();
}

export const lambdaHandler = async (event, context) => {
  const userInfo = await getUserInfo();

  const response = {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: "GetUserInfo",
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "CustomPayload",
        content: JSON.stringify(userInfo),
      },
    ],
  };

  return response;
};
