export async function getUserInfo() {
  const userInfo = await fetch(
    "https://il3b62aiu5.execute-api.ap-southeast-2.amazonaws.com/Prod/user-info/"
  );

  return userInfo.json();
}
