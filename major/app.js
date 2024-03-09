// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config()
// }

const express=require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const path=require("path")
const methodoverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const sessionOption={
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true ,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}

// app.get("/",(req,res)=>{
//     res.send("root")
// })

app.use(session(sessionOption))
app.use(flash())


//passport mate session jaruri..so use first
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next()
})

//initialize user 
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"krish2454@gmail.com",
//         username:"delta",
//     })
//     let registeredUser=await User.register(fakeUser,"krish@2454")        //register mathod:password
//     res.send(registeredUser)
// })

// mongo
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main()
    .then((res)=>{
    console.log("connection succesfull")
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}


// listings route
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)


// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"Elegant Marble villa by the lake",
//         price:1200,
//         location:"Udaipur, Rajasthan",
//         country:"india",
//     })
//     await sampleListing.save()      //jya then no use thai tya async ni jarur nai
//     console.log("sample was saved")
//     res.send("successful")
// })

// mw
app.all("*",(req,res,next)=>{           //all incoming req sathe match karvanu
    next(new ExpressError(404,"page not found"))
})   

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err      //extra j 6e anathi j handle thai 6eS
    res.status(statusCode).render("error.ejs",{message})
})

app.listen(3000,()=>{
    console.log("server is listening to port 3000")
})