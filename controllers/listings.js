const Listing = require("../models/listing.js")



//our first listing route

module.exports.index = async(req,res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  };

  //add in new route

  module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
 };

 //show route 

 module.exports.showListing = async(req,res)=>{
  let {id} = req.params;
 const listing = await Listing.findById(id)
 //populate nested
 .populate({
  path :"reviews",
   populate : {
      path : "author",
   },
  })
 .populate("owner");
 if(!listing){
  req.flash("error","page not found")
  res.redirect("/listings");

 }
 console.log(listing);
 res.render("listings/show.ejs",{listing})
};

//create route

module.exports.createListing =  async(req,res,next)=>{

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,"..",filename);

    
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = {url,filename};
  await newlisting.save();
  req.flash("success","new listing created")
  res.redirect("/listings");
  
};
//edit route

module.exports.renderEditForm = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
      req.flash("error","page not found")
      res.redirect("/listings");
  
     }
     let originalImg = listing.image.url;
     originalImg = originalImg.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs",{listing,originalImg});
};

//update route

module.exports.updateListing = async(req,res)=>{
        
  let {id} =req.params;
  // deconstructing the body and 
 let listing = await  Listing.findByIdAndUpdate(id,{ ...req.body.listing});


 if(typeof req.file != "undefined"){
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image = {url,filename};
await listing.save();
}

 req.flash("success","listing updated")

 res.redirect(`/listings/${id}`);
};

//delete route

module.exports.destroyListing = async(req,res)=>{
  let {id} = req.params;
 let deletedListing =  await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 req.flash("success","listing is deleted")

 res.redirect("/listings")
}