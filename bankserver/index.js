//server creation
//1 import express
const express=require('express')
//import dataservice
const dataService =require('./service/dataService')
//import jwt
const jwt=require('jsonwebtoken')
//import cors
const cors=require('cors')
//2 create app using the express
const app = express();
//give command to share data via cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json from req body
app.use(express.json());
//create a port number
app.listen(3000,()=>{
    console.log('listening on port 3000');
})
//application specific middleware
const middleware=(req,res,next)=>{
    console.log('application specific middleware');
    next()
}
app.use(middleware)
//router specific middleware
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers['x-token'];
    console.log('router specific middleware');
    const data=jwt.verify(token,'superkey2202');
    console.log(data);
    next();
    }
    catch{
        //422 unprocessable errors
        res.status(422).json({
            statusCode:422,
            status:false,
            messsage:'please login'
        })
    }
}
//4 resolving http request
//GET METHORD-to get a data

app.get('/',(req,res)=>{
    res.send("GET METHORD")
})
//POST METHORD-to create data

app.post('/',(req,res)=>{
    res.send("post METHORD")
})
//Put METHORD-to update a data completely

app.put('/',(req,res)=>{
    res.send("post METHORD")
})
//delete METHORD-to delete a data
app.delete('/',(req,res)=>{
    res.send("post METHORD")
})
//Patch METHORD-to update a data partially
app.patch('/',(req,res)=>{
    res.send("post METHORD")
})

//API calls or request
//login
//register
//deposit
//withdraw
//transaction

//resolving register request
app.post('/register',(req,res)=>{
    console.log(req.body);
    dataService.register(req.body.acno,req.body.username,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
       })
    // if(result){
    //     res.send('successfully registerd')
    // }
    // else{
    //     res.send('user already registed')
    // }
});

//resolving login request
app.post('/login',(req,res)=>{
    console.log(req.body);
    dataService.login(req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);

    })
});

//resolving deposit request
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    dataService.deposit(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result);

    })
});
//resolving withdraw request
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    dataService.withdraw(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result);

    })
});
//resolving transaction request
app.post('/transaction',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    dataService.getTransaction(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result);

    })
});

app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})