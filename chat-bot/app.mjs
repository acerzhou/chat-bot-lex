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

async function getPlaceOrderResponse(intent) {
  const orderJson = {
    type: "placeOrder",
  };

  const response = getResponse(intent, JSON.stringify(orderJson));

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

async function getCartResponse(intent, action) {
  const cart = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/cart/"
  );

  const cartJson = await cart.json();

  cartJson.type = action;

  const response = getResponse(intent, JSON.stringify(cartJson));

  return response;
}

async function getPromotionProducts(intent) {
  const promotions = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/promotions/"
  );

  const promotionJson = await promotions.json();

  const products = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/products/"
  );

  const productsJson = await products.json();

  const responseJson = {
    type: "product",
    items: [],
  };

  promotionJson.forEach((promotion) => {
    productsJson.items.forEach((product) => {
      if (promotion.sku === product.sku) {
        product.promotionPrice = promotion.promotionPrice;
        responseJson.items.push(product);
      }
    });
  });

  const response = getResponse(intent, JSON.stringify(responseJson));

  return response;
}

export const lambdaHandler = async (event, context) => {
  const intent = event.sessionState.intent.name;

  switch (intent) {
    case "GetUserInfo":
      return await getUserInfoResponse(intent);
    //case "UpdateUserName":
    // return await updateUserInfoResponse(intent, event);
    case "GetProducts":
      return await getProductsResponse(intent);
    case "ShowMyCart":
      return await getCartResponse(intent, "cart");
    case "Checkout":
      return await getCartResponse(intent, "checkout");
    case "PlanceOrder":
      return await getPlaceOrderResponse(intent);
    case "GetPromotionProduct":
      return await getPromotionProducts(intent);
  }
};
