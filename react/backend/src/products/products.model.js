// const { Schema, model, Types } = require("mongoose");
// const User = require("../users/user.model"); // Adjust if needed

// const productSchema = new Schema(
//   {
//     title: { type: String, required: true }, // for all categories
//     category: {
//       // Required for all products , enum should be shown the should select from that
//       type: String,
//       required: true,
//       enum: [
//         "fashion",
//         "electronics",
//         "digital",
//         "others",
//         "pre-owned",
//         "lost",
//         "found",
//       ],
//     },
//     description: {
//       // Required for all products
//       type: String,
//     },
//     imageURL: {
//       //       "fashion", required
//       // "electronics", required
//       // "digital", required
//       // "others", required
//       // "pre-owned", required
//       // "lost", optional if not will show default image
//       // "found", optional if not will show default image
//       type: String,
//     },
//     price: {
//       type: Number,
//       //       "fashion", required
//       // "electronics", required
//       // "digital", required
//       // "others", required
//       // "pre-owned", required
//       // "lost", not required, should be disabled in frontend
//       // "found", not required, should be disabled in frontend
//     },
//     perWhich: {
//       type: String,
//       //       "fashion", required
//       // "electronics", required
//       // "digital", required
//       // "others", required
//       // "pre-owned", required
//       // "lost", not required, should be disabled in frontend
//       // "found", not required, should be disabled in frontend
//     },
//     features: { type: [String]
//                     //       "fashion", required
//         // "electronics", required
//         // "digital", required
//         // "others", required
//         // "pre-owned", required
//         // "lost", not required, should be disabled in frontend
//         // "found", not required, should be disabled in frontend

//     },
//     availableSizes: { type: [String],

//       //      "fashion", required
//       // "electronics", not required, should be disabled in frontend
//       // "digital", not required, should be disabled in frontend
//       // "others", not required, should be disabled in frontend
//       // "pre-owned", not required, should be disabled in frontend
//       // "lost", not required, should be disabled in frontend
//       // "found", not required, should be disabled in frontend
//     },
//     bids: {
//       //  only for "pre-owned" category
//       //  should be an array of objects with user ID and bidding price
//       //  should be disabled for other categories
//       type: [
//         {
//           user: { type: String, required: true },
//           biddingPrice: { type: Number, required: true },
//         },
//       ],
//     },
//     endsIn: { type: String }, // For "pre-owned" category, e.g., "2d 3h 15m 30s", disabled for every other categories
//     expiresAt: { type: Date }, // Calculated from endsIn or provided

//     location: { type: String }, // requried for lost and found categories, disabled for others
//     postedBy: {
//       // Required for all products, should be auto-filled from user ID
//       // not shown in the frontend
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     contact: {
//       // Required for all products, should be auto-filled from user model
//       // not shown in the frontend
//       type: String, // auto-filled from User model
//     },
//   },
//   { timestamps: true }
// );

// // 🔁 Auto-fill `contact` from user model
// productSchema.pre("validate", async function (next) {
//   if (!this.contact && this.postedBy) {
//     try {
//       const user = await User.findById(this.postedBy);
//       if (user) {
//         this.contact = user.contactNumber || "";
//       }
//     } catch (err) {
//       console.error("Failed to auto-fill contact from user:", err);
//     }
//   }

//   // Auto-calculate expiresAt from endsIn
//   if (this.category === "pre-owned" && !this.expiresAt && this.endsIn) {
//     const match = this.endsIn.match(
//       /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/
//     );
//     if (match) {
//       const [, d = 0, h = 0, m = 0, s = 0] = match.map(Number);
//       const totalMs = d * 86400000 + h * 3600000 + m * 60000 + s * 1000;

//       this.expiresAt = new Date(Date.now() + totalMs);
//     }
//   }

//   next();
// });

// // ✅ Virtual field to check auction expiry
// productSchema.virtual("isAuctionExpired").get(function () {
//   if (!this.expiresAt) return false;
//   return new Date() > this.expiresAt;
// });

// const Product = model("Product", productSchema);
// module.exports = Product;

const { Schema, model, Types } = require("mongoose");
const User = require("../users/user.model"); // Adjust if needed

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "fashion",
        "electronics",
        "digital",
        "others",
        "pre-owned",
        "lost",
        "found",
      ],
    },
    description: { type: String },

    imageURL: {
      type: String,
      required: function () {
        return !["lost", "found"].includes(this.category);
      },
    },

    price: {
      type: Number,
      required: function () {
        return !["lost", "found"].includes(this.category);
      },
    },

    perWhich: {
      type: String,
      required: function () {
        return !["lost", "found"].includes(this.category);
      },
    },

    features: {
      type: [String],
      required: function () {
        return !["lost", "found"].includes(this.category);
      },
    },

    availableSizes: {
      type: [String],
      required: function () {
        return this.category === "fashion";
      },
    },

    bids: {
      type: [
        {
          user: { type: String, required: true },
          biddingPrice: { type: Number, required: true },
        },
      ],
      default: [],
      validate: {
        validator: function () {
          return this.category === "pre-owned" || this.bids.length === 0;
        },
        message: "Bids allowed only for pre-owned category",
      },
    },

    endsIn: {
      type: String,
      required: function () {
        return this.category === "pre-owned";
      },
    },

    expiresAt: {
      type: Date,
    },

    location: {
      type: String,
      required: function () {
        return ["lost", "found"].includes(this.category);
      },
    },

    postedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    contact: {
      type: String,
    },

    winningBid: {
      user: { type: String },
      biddingPrice: { type: Number },
    },
  },
  { timestamps: true }
);

// Auto-fill `contact` from user model
productSchema.pre("validate", async function (next) {
  if (!this.contact && this.postedBy) {
    try {
      const user = await User.findById(this.postedBy);
      if (user) {
        this.contact = user.contactNumber || "";
      }
    } catch (err) {
      console.error("Failed to auto-fill contact from user:", err);
    }
  }

  // Auto-calculate expiresAt from endsIn
  if (this.category === "pre-owned" && this.endsIn && !this.expiresAt) {
    const match = this.endsIn.match(
      /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/
    );
    if (match) {
      const [, d = 0, h = 0, m = 0, s = 0] = match.map(Number);
      const totalMs = d * 86400000 + h * 3600000 + m * 60000 + s * 1000;
      this.expiresAt = new Date(Date.now() + totalMs);
    }
  }

  next();
});

// Virtual to check if auction expired
productSchema.virtual("isAuctionExpired").get(function () {
  return this.expiresAt && new Date() > this.expiresAt;
});

const Product = model("Product", productSchema);
module.exports = Product;
