"use strict";
let _ = require('lodash')
let scrape = require('scrape-uci')


// List of ICS courses that I still need to graduate
let needed = [
  'INF 113',
  'INF 131',
  'INF 151',
  'INF 161',
  'INF 191A',
  'INF 191B',
  'INF 132',
  'INF 133',
  'INF 143',
  'INF 162W',
  'INF 148',
  'INF 163',
  'INF 134',
  'INF 125',
  'INF 141',
]

// Request list of courses offered next quarter 
scrape({
  source:'ics', dept:'INF',
  year:'2016', period:'spring'
}, (err, canTake) => {
  if (err) throw err;
  var doTake = []

  // Generate a list of classes 
  _.each(canTake, function(course) {
    if (_.includes(needed, course.title))
      doTake.push(course)
  })

  // We get the list of classes to "register for"
  // but this should really be filtered with respect
  // to their pre-requisites. We have already built
  // everything necessary to do that too! :)
  console.log(doTake);
})
