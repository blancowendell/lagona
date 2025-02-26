const MessageStatus = {
    SUCCESS: "success",
    ERROR: "error",
    DUPLICATE: "duplicate",
    NOTEXIST: "notexist",
    DUPENTRY: "dupentry",
    EXIST: "exist",
    NOENTRY: "noentry",
    EXISTEMAIL: "Email Already Exist",
    EXISTMOBILE: "Mobile Number Already Exist",
    EXISTMERCHANT: "Merchant Already Exist",
    EXISTRIDER: "Rider Already Exist",
    NOTEXISTEMAIL: "Youre Email is not Exist in our Database",
    NOTEXISTCUSTOMER: "Customer is not Exist in our Database",
    NOTEXISTLOADSTATION: "Load Station is not Exist in our Database",

  };
  
  function JsonSuccess() {
    return {
      msg: MessageStatus.SUCCESS,
    };
  }
  
  function JsonDataResponse(data) {
    //JsonDataResponse
    return {
      msg: MessageStatus.SUCCESS,
      data: data,
    };
  }
  
  function JsonWarningResponse(message, data) {
    //JsonWarningResponse
    return {
      msg: message,
      data: data,
    };
  }
  
  function JsonErrorResponse(error) {
    //JsonErrorResponse
    return {
      msg: error,
    };
  }
  
  module.exports = {
    MessageStatus,
    JsonDataResponse,
    JsonWarningResponse,
    JsonErrorResponse,
    JsonSuccess,
  };
  