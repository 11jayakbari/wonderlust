const Listing=require("../models/listing") 

module.exports.index=async (req,res)=>{
    const alllistings=await Listing.find({})
    res.render("listings/index.ejs",{alllistings})
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(! listing){
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
  })

module.exports.createListing=async (req,res,next)=>{      //async bcz db change karvanu 6e
   
    const newlisting=new Listing(req.body.listing)
    newlisting.owner=req.user._id;      
    await newlisting.save()
    req.flash("success","new Listing Created!!")
    res.redirect("/listings")
}

module.exports.renderEditForm=async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(! listing){
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing=async(req,res)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id)
    await Listing.findByIdAndUpdate(id,{...req.body.listing})  //deconstruct kari ne indivisual value ma convert
    req.flash("success","Listing Updated!!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async (req,res)=>{
    let { id } = req.params;
    let deleted=await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted!!")
    res.redirect("/listings")
}