"use strict";
let _ = require('lodash')
let scrape = require('scrape-uci')


// List of ICS courses that I still need to graduate
let needed = [
  'ICS 045J',
  'INF 161',
  'INF 191A',
  'INF 191B',
  'INF 132',

  // 3 courses from this list
  'INF 133',
  'INF 143',
  'INF 153',
  'INF 162',
  'INF 162W',
  'INF 171',

  // 2 project courses
  'INF 125',
  'INF 134',
  'INF 148',
  'INF 163',
  'INF 172',
]

// Request list of courses offered next quarter 
scrape({
  source:'ics', dept:'ALL',
  year:'2016', period:'spring'
}, (err, canTake) => {
  if (err) throw err;
  var doTake = []

  // Generate a list of classes 
  _.each(canTake, c => _.includes(needed, c.title) ? doTake.push(c) : null)

  // We get the list of classes to "register for"
  // but this should really be filtered with respect
  // to their pre-requisites. We have already built
  // everything necessary to do that too! :)
  console.log(doTake);
})
