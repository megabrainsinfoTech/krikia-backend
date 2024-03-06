const { Op, QueryTypes } = require("sequelize");
const {
  Property,
  sequelize,
  PropertyPricingPlan,
  PropertyPricingOption,
} = require("../../models");
const AppError = require("../errorHandle");
const { StatusCodes } = require("http-status-codes");

class ApiFeature {
  constructor(Model, Query) {
    this.model = Model;
    this.query = Query;
    this.includes = [];
    this.options = {};
  }

  include(associations) {
    this.includes.push(...associations);
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["page", "limit", "fields", "sort"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.q) {
      this.options = {
        ...this.options,
        where: {
          [Op.or]: [
            {
              name: {
                [Op.substring]: queryObj.q,
              },
            },
            {
              propertyType: {
                [Op.substring]: queryObj.q,
              },
            },
            {
              state: {
                [Op.substring]: queryObj.q,
              },
            },
            {
              city: {
                [Op.substring]: queryObj.q,
              },
            },
          ],
        },
      };
    }

    if (queryObj.title) {
      this.options.where = {
        ...this.options.where,
        propertyTitle: {
          [Op.in]: Array.isArray(queryObj.title)
            ? queryObj.title
            : [queryObj.title],
        },
      };
    }

    if (queryObj.category) {
      this.options.where = {
        ...this.options.where,
        propertyType: {
          [Op.in]: Array.isArray(queryObj.category)
            ? queryObj.category
            : [queryObj.category],
        },
      };
    }

    if (queryObj.brand) {
      this.options.where = {
        ...this.options.where,
        ["$business.brandName$"]: {
          [Op.in]: Array.isArray(queryObj.brand)
            ? queryObj.brand
            : [queryObj.brand],
        },
      };
    }
    // Handle Price Filter

    if (queryObj.price_lt) {
      this.options.where = {
        ...this.options.where,
        [Op.or]: [
          {
            "$plans.price$": {
              [Op.lt]: queryObj.price_lt,
            },
          },
          {
            "$plans.options.price$": {
              [Op.lt]: queryObj.price_lt,
            },
          },
        ],
      };
    }
    if (queryObj.price_lte) {
      this.options.where = {
        ...this.options.where,
        [Op.or]: [
          {
            "$plans.price$": {
              [Op.lte]: queryObj.price_lte,
            },
          },
          {
            "$plans.options.price$": {
              [Op.lte]: queryObj.price_lte,
            },
          },
        ],
      };
    }
    if (queryObj.price_gt) {
      this.options.where = {
        ...this.options.where,
        [Op.or]: [
          {
            "$plans.price$": {
              [Op.gt]: queryObj.price_gt,
            },
          },
          {
            "$plans.options.price$": {
              [Op.gt]: queryObj.price_gt,
            },
          },
        ],
      };
    }
    if (queryObj.price_gte) {
      this.options.where = {
        ...this.options.where,
        [Op.or]: [
          {
            "$plans.price$": {
              [Op.gte]: queryObj.price_gte,
            },
          },
          {
            "$plans.options.price$": {
              [Op.gte]: queryObj.price_gte,
            },
          },
        ],
      };
    }
    if (queryObj.price_eq) {
      this.options.where = {
        ...this.options.where,
        [Op.or]: [
          {
            ["$plans.price$"]: {
              [Op.eq]: queryObj.price_eq,
            },
          },
          {
            ["$plans.options.price$"]: {
              [Op.eq]: queryObj.price_eq,
            },
          },
        ],
      };
    }

    // This is  for Multiple Selected Option
    if (queryObj.price_gte && queryObj.price_lte) {
      this.options.where = {
        ...this.options.where,
        [Op.or]: [
          {
            ["$plans.price$"]: {
              [Op.between]: [queryObj.price_gte, queryObj.price_lte],
            },
          },
          {
            ["$plans.options.price$"]: {
              [Op.between]: [queryObj.price_gte, queryObj.price_lte],
            },
          },
        ],
      };
    }
    if (queryObj.sold !== undefined) {
      this.options.where = {
        ...this.options.where,
        soldOut: JSON.parse(queryObj.sold),
      };
    }

    // if (queryObj.rating) {
    //   this.options.where = {
    //     ...this.options.where,averrr
    //   };
    //   this.options = {
    //     ...this.options,
    //     attributes: {
    //       include: [
    //         [sequelize.fn("AVG", sequelize.col("reviews.id")), "averrr"],
    //       ],
    //     },
    //   };
    // }

    this.options.attributes = {
      exclude: [
        "fees",
        "balance",
        "freqAskedQues",
        "calendarId",
        "calendarAddress",
        "approvedBy",
        "verifiedBy",
        "assetOwner",
        "phoneNumber",
        "earning",
        "landmarks",
        "amenities",
        "documents",
      ],
    };
    return this;
  }

  paginate() {
    const PROPERTY_PER_PAGE = 12;
    const PAGE_NUMBER = this.query.page || 0;
    this.options = {
      ...this.options,
      offset: Number(PAGE_NUMBER),
      limit: Number(PROPERTY_PER_PAGE),
    };
    return this;
  }

  sort() {
    this.options = {
      ...this.options,
    };
    if (this.query.sort) {
      const { sort } = this.query;

      if (sort === "newest") {
        this.options.order = [["createdAt", "DESC"]];
      } else if (sort === "top-selling") {
        this.options.order = [["unitSales", "DESC"]];
      }
      if (sort === "price-asc") {
        this.options.order = [
          [
            { model: PropertyPricingPlan, as: "plans" },
            "price",
            "ASC", // Sort by 'price' in ascending order
          ],
          [
            { model: PropertyPricingPlan, as: "plans" },
            { model: PropertyPricingOption, as: "options" },
            "price",
            "ASC", // Sort by 'price' in ascending order for options
          ],
        ];
      } else if (sort === "price-dec") {
        this.options.order = [
          [
            { model: PropertyPricingPlan, as: "plans" },
            "price",
            "DESC", // Sort by 'price' in ascending order
          ],
          [
            { model: PropertyPricingPlan, as: "plans" },
            { model: PropertyPricingOption, as: "options" },
            "price",
            "DESC", // Sort by 'price' in ascending order for options
          ],
        ];
      }
    }

    return this;
  }

  execute() {
    this.options.include = this.includes;
    return this.model.findAll(this.options);
  }
}

module.exports = ApiFeature;
