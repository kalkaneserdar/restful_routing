var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
expressSanitizer= require("express-sanitizer"),
methodOverride  = require("method-override"),
mongoose        = require("mongoose");

//DB CONFIGURATION
mongoose.connect("mongodb://localhost/restful_routing", {useMongoClient: true});

//APP CONFIGURATION
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE SCHEMA/MODEL DEFINITION
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blogModel = mongoose.model("blog", blogSchema); // Whenever required to create an instance of this model: blogModel.create({obj def}, function(){// exception handling});

//ROUTES
//HOME ROUTE
app.get("/", function(req, res){
    
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    
   blogModel.find({}, function(err, responseData){
       
        if(err){
            
            console.log("SOMETHING WENT WRONG WHILE ADDING A NEW POST TO THE DB!");
            console.log(err);
        }
        else {
            
            console.log("---THIS IS THE LIST OF BLOGS RETRIEVED FROM THE DB:");
            console.log(responseData);
            res.render("index", {blogs: responseData});
        }
   });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    
    var blogObj =  {
        title: req.body.title,
        image: req.body.image,
        body: req.sanitize(req.body.body)
    };

    blogModel.create(blogObj, function(err, responseData){
        if(err){
            console.log("SOMETHING WENT WRONG WHILE ADDING A NEW POST TO THE DB!");
            console.log(err);
        }
        else {
            console.log("---THIS IS THE OBJECT WRITTEN TO THE DATABASE:");
            console.log(responseData);
        }
    });
    
    res.redirect("/blogs");
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    
    var blogId = req.params.id;
    
    blogModel.findById({"_id": blogId}, function(err, responseData){
        
        if(err){
            
            console.log("SOMETHING WENT WRONG WHILE SEARCHING FOR A POST IN DB: SEARCH OPERATION FAILED!");
            console.log(err);
        }
        else{
            
            console.log("---THIS IS THE OBJECT RETRIEVED FROM THE DB - SEARCH OPERATION:");
            console.log(responseData);
            res.render("show", {blog: responseData});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    
   var blogId = req.params.id;
   
   blogModel.findById({"_id": blogId}, function(err, responseData){
       
       if(err){
           
           console.log("SOMETHING WENT WRONG WHILE SEARCHING FOR A POST IN DB: EDIT OPERATION FAILED!");
           console.log(err);
       }
       else {
           
           console.log("---THIS IS THE OBJECT RETRIEVED FROM THE DB - EDIT OPERATION:");
           console.log(responseData);
           res.render("edit", {blog: responseData});
       }
   });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    
    var blogObj = {
        title: req.body.title,
        image: req.body.image,
        body: req.sanitize(req.body.body)
    };
    
    // blogModel.findByIdAndUpdate(req.params.id, {$set: {title: req.body.title}}, function(err, responseData){
    blogModel.findByIdAndUpdate(req.params.id, blogObj, function(err, responseData){
        
        if(err){
            
            console.log("SOMETHING WENT WRONG WHILE UPDATING A POST IN DB: UPDATE OPERATION FAILED!");
            console.log(err);
        }
        else {
            console.log("---THIS IS THE OBJECT UPDATED IN THE DATABASE:");
            console.log(responseData);
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    
    blogModel.findByIdAndRemove(req.params.id, function(err, responseData){
        
        if(err){
            
            console.log("SOMETHING WENT WRONG WHILE DELETING A POST IN DB: DELETE OPERATION FAILED!");
            console.log(err);
        } 
        else {
            console.log("---THIS IS THE OBJECT DELETED IN THE DATABASE:");
            console.log(responseData);
            res.redirect("/blogs/");
        }
    });
});

//SERVER CONFIG
app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("RestfulRouting app has started...");
});