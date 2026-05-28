import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://MohamedFouad:Mo123456789Mo@socialmedia.qcbcxou.mongodb.net/Chat_Application",
    );
    console.log("DataBase Connected Successfully ✅");
  } catch (error) {
    console.log("DataBase Failed To Connect ❌");
  }
};
