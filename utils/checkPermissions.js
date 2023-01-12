import { UnAuthenticatedError } from "../errors/index.js";
function checkPermissions(requestUser, userId) {
  if (requestUser.userId == userId.toString()) return;
  return UnAuthenticatedError("error occured");
}

export default checkPermissions;
