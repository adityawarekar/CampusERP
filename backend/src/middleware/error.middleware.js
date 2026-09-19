const errorMiddleware = (err, req, res, next) => {

    console.error(err);

    return res.status(
        err.statusCode || 500
    ).json({
        success: false,
        message:
            err.statusCode
                ? err.message
                : "Internal server error"
    });

};

export default errorMiddleware;