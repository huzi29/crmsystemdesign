import auth from "./auth.routes.js";
import booking from "./booking.routes.js";
import enquiry from "./enquiry.routes.js";
import interactions from "./interaction.routes.js";
import leads from "./lead.routes.js";


const Router = {
  AuthRouter: auth,
  LeadRouter: leads,
  InteractionRouter: interactions,
  EnquiryRouter: enquiry,
  BookingRouter:booking,
  
};

export default Router;
