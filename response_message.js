var message = function(status, message){
    this.status = status;
    this.message = message;
    
    this.getStatus = function(){
        return this.status;
    }
    
    this.getMessage = function(){
        return this.message;
    }
    
    this.toString = function(){
        return { "status": this.status, "message": this.message }
    }
}

module.exports = message;