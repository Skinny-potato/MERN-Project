const Product = require("../Models/productModels")
const Errorhandler = require("../Utils/errorhandler")
const catchasynerrors = require("../middleware/catchasynerrors");
const ApiFeatures = require("../Utils/apifeatures");
const catchAsynErrors = require("../middleware/catchasynerrors");
const cloudinary = require("cloudinary");





// create product ---admin
exports.createProduct = catchasynerrors(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    });
});

//get all product -- admin
exports.getAdminProducts = catchasynerrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});


// get all products 
exports.getAllProducts = catchasynerrors(async (req, res) => {

    const resultPerPage = 8
    const productsCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
    let products = await apiFeature.query.clone();

    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage)
    // const products = await Product.find();  as find() is already used in the apifeatures constuctor we will use the same constructor values
    products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});


//get product details

exports.getProductDetails = catchasynerrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new Errorhandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product,

    });
});


//update product --> admin
exports.updateProduct = catchasynerrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here -- to remove or no to remove the image if there are no images 
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete product
exports.deleteProduct = catchasynerrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new Errorhandler("Product not found", 404))
    }
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.remove()
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });

});


//Create New Review or update the previous review 
exports.createProductreview = catchAsynErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating), (rev.comment = comment);
            }
        });
    }
    else {
        product.reviews.push(review);
        product.numberofreviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Reviewed successfully"
    })
});

//Get all Reviews of a product
exports.getProductReviews = catchAsynErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new Errorhandler("product not found"), 404);
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//Delete Review
exports.deleteReview = catchAsynErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new Errorhandler("product not found"), 404);
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numberofreviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numberofreviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    });
});