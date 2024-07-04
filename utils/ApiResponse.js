class ApiResponse  {
    constructor(
        statusCode , 
        message = "Success" ,
        data,
        success = true
        
    ){
        this.statusCode = statusCode < 400
        this.message = message
        this.data = data
    }
}

module.exports = {ApiResponse}