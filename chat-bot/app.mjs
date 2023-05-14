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

function getResponse(intent, content) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intent,
        state: "Fulfilled",
      },
      activeContexts: [],
    },
    messages: [
      {
        contentType: "CustomPayload",
        content: content,
      },
    ],
  };
}

async function getUserInfoResponse(intent) {
  const userInfo = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/user-info/"
  );

  const userInfoJson = await userInfo.json();

  console.log("get user info", userInfoJson);

  const response = getResponse(intent, JSON.stringify(userInfoJson));

  return response;
}

async function updateUserInfoResponse(intent, event) {
  const response = getResponse(intent, JSON.stringify(event));

  return response;
}

async function getProductsResponse(intent) {
  const products = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/products/"
  );

  const productsJson = await products.json();

  const response = getResponse(intent, JSON.stringify(productsJson));

  return response;
}

export const lambdaHandler = async (event, context) => {
  const intent = event.sessionState.intent.name;

  switch (intent) {
    case "GetUserInfo":
      return await getUserInfoResponse(intent);
    case "UpdateUserName":
      return await updateUserInfoResponse(intent, event);
    case "GetProducts":
      return await getProductsResponse(intent);
  }
};
