import { ApiResponse } from "./ApiResponse.js"

const asyncHandler = (resquestHandler) =>{
    return  (req,res) => {
          Promise.resolve(resquestHandler(req,res))
          .catch((err)=>{return new ApiResponse(500,{error:err},"An unexpected error occurred, Please try again !!")})
      }
  }
  
  export {asyncHandler}