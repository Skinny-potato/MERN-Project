class Apifeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
        //query in url means anything after "?"
        //for ex  http://localhost:4000/products?keyword=seriouspunch 
    }
    search() {
        // console.log(this.queryStr.keyword);
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        } : {};

        // console.log(keyword);
        this.query = this.query.find({ ...keyword })

        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr }//as getting this.quryStr will only retrive its reference by which the changes will be shown to its actual value, so the rest operator is used ie "..."

        // console.log(queryCopy);
        //removing some fields from the category 
        const removeFields = ["keyword", "limit", "page"] //this fields are to be removed for the filtering 
        removeFields.forEach((key) => delete queryCopy[key])

        //filter for the price and rating -->these values are given in the basis of the range 
        let queryStr = JSON.stringify(queryCopy);
        // |
        // |  conveting object to sting and then back to obeject 
        // |
        // V    
        // console.log(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr)) // the string is converted back to object here using parse
        return this;
    }
    pagination(resultperpage) {
        const currentPage = Number(this.queryStr.page) || 1
        // console.log(this.queryStr.page);
        const skip = resultperpage * (currentPage - 1)
        this.query = this.query.limit(resultperpage).skip(skip);
        return this;
    }

}

module.exports = Apifeatures