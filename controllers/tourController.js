const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // results: tours.lenght(),
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
  console.log(req.body);
};

exports.updateTour = async (req, res) => {};

exports.deleteTour = async (req, res) => {};

exports.getTourStats = async (req, res) => {};

exports.getMonthlyPlan = async (req, res) => {};
