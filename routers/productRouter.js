const express = require("express");
const router = express.Router();
const Products = require("../db/models/Products");
const cloudinary = require("../cloudinary/config");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { productsSchema } = require("../types/types");
const upload = require("../middlewares/multer");

//An router for admin creating products
router.post("/createProduct", authMiddleware, adminMiddleware, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 2 },
    { name: "image3", maxCount: 3 },
    { name: "image4", maxCount: 4 },
    { name: "image5", maxCount: 5 }
]), async (req, res) => {
    try {

        const parsedData = productsSchema.safeParse(req.body);
        console.log(parsedData.data)
        console.log("Hello world" + parsedData.prices)
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];
        if (!parsedData.success) {
            return res.status(403).json({
                msg: "Invalid types"
            })
        }
        /* console.log(
       typeof authMiddleware,
       typeof adminMiddleware,
       typeof upload
     );*/
        const { title, description, category, subcategory, prices, bestSeller, size } = parsedData.data;
        console.log(image1, image2, image3, image4, image5)
        //We are separating which image is given and which image files are undefined so thats why we have written above logic also
        const images = [image1, image2, image3, image4, image5].filter(image => image !== undefined)
        const uploadedImage = [];
        for (file of images) {
            console.log(file.path);
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "products"
            })
            //Isme yeh lerha ki konsi file lega cloudinary aur server k andar konse folder m daalega yeh
            uploadedImage.push(result.secure_url);
        }
        const newProduct = await Products.create({
            title: title,
            description: description,
            category: category,
            subcategory: subcategory,
            prices: prices,
            bestSeller: Boolean(bestSeller === true ? true : false),
            size: size,
            images: uploadedImage
        })

        console.log(newProduct);
        res.json({
            msg: "New product is launched"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Interrnal server error"
        })
    }
})

/*We have created an public API for fetching all the products because hum chahte hain ki 
chahe user ho ya nahi ho ya chahe admin ho getAllproducts ya saare products ko hum publicly
kabhi bhi fetch kar skte hain though we can create frontend pagination but for 
scalable applications we will use back-end pagination*/
router.get("/getAllProducts", async (req, res) => {
    try {
        const page =  1;
        const limit =10;
        const skip = (page - 1) * limit;

        const category = req.query.category;
        const subcategory = req.query.subcategory;
        const search = req.query.search;
        const sort=req.query.sort;
        /*
       const filteredProducts=Products.filter((element)=>{
           return element.title.toLowerCase().includes(search.toLowerCase());
       })
           Logically this is correct but since we are directly querying inside the db
           or we want to directly query inside the database so we will do as follows*/

        const filter = {};
        const sortOptions={};
        if (search) {
            filter.title={$regex:search, $options:"i"} //name that starts with or ends with or contains string as search have
        }
        if (category) {
            filter.category = category;
        }
        if (subcategory) {
            filter.subcategory = subcategory;
        }
       if(sort==="sort_asc")
       {
        sortOptions.prices=1;
       }
       if(sort==="sort_desc"){
        sortOptions.prices=-1;
       }
        const getProducts = await Products.find(filter).sort(sortOptions).skip(skip).limit(limit);
        /*See the skip and limit methods in mongodb also for payment app i used
        mongodb transactions of sessions for atomicity of the payments
        Also sort method first sort all the matching objects of filter then it skips skip elements 
        and then it limits limit no of elements*/
        const total = await Products.countDocuments(filter);
        if (getProducts.length === 0) {
            return res.json({
                msg: "No products found",
                products: []
            })
        }
        return res.json({
            msg: "Products found",
            products: getProducts,
            totalPage: Math.ceil(total / limit),
            page: page
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

//Now what if admin wants to delete that product or remove that product by using some productId
router.delete("/removeProduct/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteProduct = await Products.findByIdAndDelete(productId);
        res.json({
            msg: "Product is deleted from the database",
            deletedProduct: deleteProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

//I want to fetch a single product
router.get("/getProduct/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const isProduct = await Products.findById(productId);
        if (!isProduct) {
            return res.status(404).json({
                msg: "No any products found"
            })
        }
        res.json({
            msg: "Products found successfully",
            product: isProduct
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})


module.exports = router;