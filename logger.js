function log(req,res,next) {
    console.log('Process..');
    next();
}

module.exports = log;

