import auth from "./auth.js";
import verifyUser from "./jwt.middleware.js";

const middleware = {
  VerifyUser: verifyUser,
  Auth: auth,
};

export default middleware;
