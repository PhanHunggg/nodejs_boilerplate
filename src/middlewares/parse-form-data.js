const parseFormData = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            try {
                req.body[key] = JSON.parse(req.body[key]); // Chuyển JSON string thành object
            } catch (e) {
                // Nếu không phải JSON, giữ nguyên
            }
        });
    }
    next();
};

module.exports = parseFormData;
