module.exports = (req, res, next) => {
    const {limit = 5, skip = 0 } = req.query;

    const pageLimit = parseInt(limit);
    const pageSkip = pageLimit * parseInt(skip);


    req.paginationLangs = {
        limit: pageLimit,
        skip: pageSkip
    };

    next();
}