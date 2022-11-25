module.exports = (res, error_code, msg, data = null) => {
    res.json({
        error_code,
        msg,
        data
    })
}