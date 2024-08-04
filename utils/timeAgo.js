const moment = require('moment');

const timeAgo = (date)=> {
    
    return moment(date).fromNow();

}

module.exports = {
   timeAgo
}