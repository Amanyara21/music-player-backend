const mongoose = require("mongoose")

const MongoConnection =async()=>{
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/musicplayer");
      console.log('connected');
    } catch (error) {
      handleError(error);
    }

}

module.exports= MongoConnection


