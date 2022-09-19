const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')
const mongoose = require('mongoose')

// =====================Authentication =======================

const authentication = function (req, res, next) {
    try {
      let token = req.headers["x-api-key"]
      if (!token){ 
      return res.status(400).send({ status: false, msg: "token is required" })
      }else{
        const validToken = jwt.decode(token)
        if(validToken){
          jwt.verify(token, process.env.SECRET_KET)   
        }
        req.decodedToken = validToken;
      }
      
    next()
    }
  catch (err) {
      console.log("This is the error:", err.message)
      res.status(500).send({status:false, msg: "Error", error: err.message })
    }
  };



  // ========================Authorization========================

  const authorizations = async function (req, res, next) {
    try {
      const blogId = req.params.blogId;
      if(!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).send({msg:"blog_id is not valid"})
      const blog = await blogModel.findById(blogId);
      console.log(blog)

      const token = req.headers["x-api-key"];
      const decodedToken = jwt.verify(token,"project-1")
      if(blog.authorId==decodedToken.authorId){
        next()
      }else{
        return res.status(403).send({status:false,message:"Authorisation failded"})
      }
      
    } catch (err) {
      console.log('This is the error :', err.message);
      res.status(500).send({ msg: 'Error', error: err.message });
    }
  };

  


// Destructuring 
module.exports = { authentication, authorizations } 
 