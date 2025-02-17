import refreshToken from "./RefreshToken.model.js";
import UserModel from "./User.models.js";
import LeadModel from "./Lead.model.js";
import InteractionModel from "./Interaction.model.js";
import EnquiryModel from "./Enquiry.model.js";
import BookingModel from "./Booking.model.js";

const db = {
  UserModel: UserModel,
  RefreshTokenModel: refreshToken,
  LeadModel: LeadModel,
  InteractionModel: InteractionModel,
  EnquiryModel: EnquiryModel,
  BookingModel: BookingModel
};

export default db;
