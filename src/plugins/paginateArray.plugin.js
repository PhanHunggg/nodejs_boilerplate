/* eslint-disable no-param-reassign */

const paginateArray = (schema) => {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    schema.statics.paginateArray = async function (filter, options, equals, lte) {
        // where is array include two elements, first ele is name of key (line:46), second element is value(line:46)

        let sort = '';
        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'asc' ? '' : '-') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }
        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;

        let countPromise;
        let docsPromise
        if (!equals && !lte) {
            docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit)
            countPromise = this.countDocuments(filter).exec();
        }
        else {
            if (equals) {
                docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).where(equals[0]).equals(equals[1])
                countPromise = this.countDocuments(filter).where(equals[0]).equals(equals[1]).exec();
            }
            if (lte) {
                docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).where(lte[0]).lte(lte[1])
                countPromise = this.countDocuments(filter).where(lte[0]).lte(lte[1])
            }
        }

        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
                docsPromise = docsPromise.populate(
                    populateOption
                        .split('.')
                        .reverse()
                        .reduce((a, b) => ({ path: b, populate: a }))
                );
            });
        }

        docsPromise = docsPromise.exec();

        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            };
            return Promise.resolve(result);
        });
    };
};

module.exports = paginateArray;
