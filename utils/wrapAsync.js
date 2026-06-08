// better way to yse try and catch
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }

}
/// jaha jaha try catch likh rahe the erro handle ke liye a bas 
// vaha iss function ko jis name se expot kiya hai vo like bas async se pahle