const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A Tour must have less or equal then 40 char'],
      minLength: [10, 'A Tour must have more or equal then 10 char'],
      validate: [validator.isAlpha, 'Tour name must only contains character']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a diffculty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficuilt'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must equal or above 1.0'],
      max: [1, 'Rating must equal or below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tuor must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          //not work on update / only work on new document
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tuor must have a summery']
    },
    discription: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tuor must have a image cover']
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Document Middleware: Runs before .save() and .create() but not on .insertmany()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function(next) {
//   console.log('will save document....');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware:
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`query took ${Date.now() - this.start} ms`);
  next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
