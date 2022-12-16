//import jwt
const jwt =require('jsonwebtoken')
//import db.js
const db=require('./db.js')


userdetails = {
    1000: { acno: 1000, username: 'sharfi', password: 1000, balance: 1000, transaction: [] },
    1001: { acno: 1000, username: 'sunu', password: 1001, balance: 1000, transaction: [] },
    1002: { acno: 1000, username: 'shani', password: 1002, balance: 1000, transaction: [] }
  }

const register=(acno, username, password)=> {
  return db.User.findOne({acno})//port 27017,backendport 3000
  .then(user=>{
    if(user){
      return{
        statusCode:401,
        Status:false,
        message:'user already registered'
      }
    }
    else{
      const newUser=new db.User({
        acno,
        password,
        username,
        balance:0,
        transaction:[]
      })
      newUser.save()//to storedata in mongodb
      return{
        statusCode:200,
        Status:true,
        message:'register success'
      }
    }
  })
    
    // if (acno in userdetails) {
    //   return{
    //     statusCode:401,
    //     Status:false,
    //     message:'user already registered'
    //   }
    // } else {
    //   userdetails[acno] = {
    //     acno,
    //     username,
    //     password,
    //     balance: 0,
    //     transaction: []
    //   }
    //   console.log(userdetails);
    //   return{
    //     statusCode:200,
    //     Status:true,
    //     message:'register success'
    //   }
    // }
}

  const login=(acno, pswd)=> {
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        currentUser = user.username;
        currentAcno = acno;
       //token generation
       const token=jwt.sign({currentAcno:acno},'superkey2202')
        return {
          statusCode:200,
          Status:true,
          message:'login successfully',
          currentAcno,
          currentUser,
          token
        }
      } else {
        return{
          statusCode:401,
          Status:false,
          message:' incorrect password or username'
        }
      }
    })

    if (acno in userdetails) {
      if (pswd == userdetails[acno].password) {
        currentUser = userdetails[acno]['username']
        currentAcno = acno
       //token generation
       const token=jwt.sign({currentAcno:acno},'superkey2202')
        return {
          statusCode:200,
          Status:true,
          message:'login success',
          currentAcno,
          currentUser,
          token
        }
      } else {
        return{
          statusCode:401,
          Status:false,
          message:'password error'
        }
      }
    }
    else {
      return {
        statusCode:401,
        Status:false,
        message:'user invalid'
      }
    }
  }


  const deposit=(acno, pswd, amt) =>{
    var amount = parseInt(amt);
    return db.User.findOne({acno,password:pswd})
    .then(User=>{
      if(User){
        User.balance+= amount;
        User.transaction.push({
          type: 'credit',
          amount
        })
        User.save()
        //console.log(userdetails);

        return{
          statusCode:200,
          status:true,
          message:`${amount} is credited and balance is ${User.balance}`
        }
        //
      } else {
        return {
          statusCode:401,
          Status:false,
          message:'invalid password'
        }
      }
    }
    )

    var amount = parseInt(amt);
    if (acno in userdetails) {
      if (pswd == userdetails[acno]['password']) {
        userdetails[acno]['balance'] += amount;
        userdetails[acno]['transaction'].push({
          type: 'credit',
          amount
        })
        console.log(userdetails);

        return{
          statusCode:200,
          status:true,
          message:`${amount} is credited and balance is ${ userdetails[acno]['balance']}`
        }
        //
      } else {
        return {
          statusCode:401,
          Status:false,
          message:'invalid password'
        }
      }
    }
    else {
      return {
        statusCode:401,
        Status:false,
        message:'invalid user details'
      }
    }
  }


  const withdraw=(acno, pswd, amt)=> {
    var amount = parseInt(amt);
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        if (user.balance > amount) {
        user.balance-= amount;
        user.transaction.push({
          type: 'debit',
          amount
        })
        user.save()
        return{
          statusCode:200,
          status:true,
          message:(`${amount} is debited and balance is ${ user.balance}`)
        }
      }
      else{
        
        return {
          statusCode:401,
          Status:false,
          message:'insufficient amount'
        } 
      }
      }
      
      else{
        return {
          statusCode:401,
          Status:false,
          message:'invalid password'
        }
      }
    })

    var amount = parseInt(amt);
    if (acno in userdetails) {
      if (pswd == userdetails[acno]['password']) {
        if (userdetails[acno]['balance'] > amount) {
          userdetails[acno]['balance'] -= amount;
          userdetails[acno]['transaction'].push({
            type: 'debit',
            amount
          })
          console.log(userdetails);

          return{
            statusCode:200,
            status:true,
            message:(`${amount} is debited and balance is ${ userdetails[acno]['balance']}`)
          }
          // userdetails[acno]['balance']
        }
        else{
          return {
            statusCode:401,
            Status:false,
            message:'insufficient amount'
          }
          
        }
      } 
      else {
        return {
          statusCode:401,
          Status:false,
          message:'invalid password'
        }
      }
    }
    else {
      return {
        statusCode:401,
        Status:false,
        message:'invalid user details'
      }
    }

  }

  const getTransaction=(acno)=> {
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return{
          statusCode:200,
          status:true,
          transaction:user.transaction
        } 
      }else{
        return {
          statusCode:401,
          Status:false,
          message:'transfer error'
        }
      }
    })

    return{
      statusCode:200,
      status:true,
      transaction:userdetails[acno]['transaction']
    } 
    //userdetails[acno]['transaction'];
  }
//delete account
const deleteAcc=(acno)=>{
return db.User.deleteOne({acno})
.then(user=>{
  if(user){
    return{
      statusCode:200,
      status: true,
      message:'account deleted'

    }
  }else{
    return{
      statusCode:401,
      status: false,
      message:'account not fount'
  }}
})
}



  module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,deleteAcc
  }