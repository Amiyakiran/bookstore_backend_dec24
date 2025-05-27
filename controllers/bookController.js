const books = require("../model/bookModel");
const stripe = require('stripe')('sk_test_51RPc3kFV25RbWaaJTJqFuGbLFn0M8ozoj9HtjQz0PIyTZFwcfcgNKK5XE9HduJVgeVhyp8zRxYEV2vNemPzxveOj00nBxnSvXf')

//to add books
exports.addBookController = async (req, res) => {

    console.log('inside addBookController');

    // console.log(req.body);
    // console.log(req.files); 

    const { title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category } = req.body

    console.log(title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category)

    uploadedImg = []
    req.files.map((item) => uploadedImg.push(item.filename))
    console.log(uploadedImg);
    //res.status(200).json('request received')
    const email = req.payload
    console.log(email);


    try {
        const existingBook = await books.findOne({ title, userMail: email })

        if (existingBook) {
            res.status(401).json('You have already added the book')
        }
        else {
            const newBook = new books({
                title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, userMail: email
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}


//to get home books

exports.getHomeBookController = async (req, res) => {
    try {

        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllBookController = async (req, res) => {

    //console.log(req.query);
    const searchkey = req.query.search
    const email = req.payload

    try {

        const query = {
            title: {
                $regex: searchkey, $options: "i"
            },
            userMail: { $ne: email }
        }
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}


//to get a particular book

exports.getABookController = async (req, res) => {

    const { id } = req.params
    console.log(id);


    try {
        const abook = await books.findOne({ _id: id })
        res.status(200).json(abook)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books added by user
exports.getAllUserBookController = async (req, res) => {

    const email = req.payload
    console.log(email);

    try {

        const allUserBook = await books.find({ userMail: email })
        res.status(200).json(allUserBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books brought by user
exports.getAllUserBroughtBookController = async (req, res) => {

    const email = req.payload
    console.log(email);

    try {

        const allUserBroughtBook = await books.find({ brought: email })
        res.status(200).json(allUserBroughtBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to delete a user book
exports.deleteAUserBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('delete successfull')
    } catch (error) {
        res.status(500).json(error)
    }

}

//payment controller
exports.makepaymentController = async(req, res) => {
    console.log('inside make payment');
    
    const { booksDetails } = req.body
    console.log(booksDetails);
    
    const email = req.payload
    console.log(email);
    

    try {

        const existingBook = await books.findByIdAndUpdate({ _id: booksDetails._id }, {
            title: booksDetails.title,
            author: booksDetails.author,
            noofpages: booksDetails.noofpages,
            imageurl: booksDetails.imageurl,
            price: booksDetails.price,
            dprice: booksDetails.dprice,
            abstract: booksDetails.abstract,
            publisher: booksDetails.publisher,
            language: booksDetails.language,
            isbn: booksDetails.isbn,
            category: booksDetails.category,
            status: 'sold',
            userMail: booksDetails.userMail,
            brought: email
        },{new:true})
        console.log(existingBook);
        


        const line_item = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: booksDetails.title,
                    description: `${booksDetails.author} | ${booksDetails.publisher}`,
                    images: [booksDetails.imageurl],
                    metadata: {
                        title: booksDetails.title,
                        author: booksDetails.author,
                        noofpages: booksDetails.noofpages,
                        imageurl: booksDetails.imageurl,
                        price: `${booksDetails.price}`,
                        dprice: `${booksDetails.dprice}`,
                        abstract: booksDetails.abstract.slice(0,20),
                        publisher: booksDetails.publisher,
                        language: booksDetails.language,
                        isbn: booksDetails.isbn,
                        category: booksDetails.category,
                  
                        status: 'sold',
                        userMail: booksDetails.userMail,
                        brought: email
                    }
                },
                unit_amount:Math.round(booksDetails.dprice*100)//amount-unit-in cents convert to dollar and round it to nearest value
            } ,
            quantity:1
        }]
        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            //purchased using cards
            payment_method_types: ["card"],
            //details of products that is purchasing
            line_items: line_item,
            //make payment
            mode: "payment",
            //if the payment is successfull - the url to be shown
            success_url: 'http://localhost:5173/payment-success',
            //if the payment is failed - the url to be shown
            cancel_url: 'http://localhost:5173/payment-error'
        });

        console.log(session);

        res.status(200).json({ sessionId: session.id})

    } catch (error) {

        res.status(500).json(error)
    }
}

//----------------------------------------------------------------------------------------
//--------------------------------Admin---------------------------------------------------

//to get all books

exports.getAllBookAdminController = async (req, res) => {
    try {

        const allExistingBooks = await books.find()
        res.status(200).json(allExistingBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

//aprrove books
exports.approveBookController = async (req, res) => {

    const { _id, title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImg, status, userMail, brought } = req.body

    console.log(title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImg, status, userMail, brought);


    try {

        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImg, status: 'approved', userMail, brought }, { new: true })

        // await existingBook.save()
        res.status(200).json(existingBook)

    } catch (error) {
        res.status(500).json(error)
    }
}