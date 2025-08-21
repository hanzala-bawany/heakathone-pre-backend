import { successHandler } from "../utills/resHandler.js";


export const testGetDatController = (req,res) =>{
    try{
        console.log(req,"---> req");
        // console.log(req.headers.authorization,"-----> token");
        successHandler(res,200,`test data return successfully`, {title : "test data" , quantity : 222} )
    }
    catch(err){
        console.log(err);
    }
}