"use strict";
const Promise = require('bluebird')
const _ = require('lodash')
const scrape = require('scrape-uci')

// List of ICS courses that I still need to graduate
let needed = [
  'ICS 45J',
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

function format(collection, find, replace) {
  return _.map(collection, c => {
    c.id = c.id.replace(find, replace)
    delete c.prerequisite // dont care
    return c
  })
}

// Request list of courses offered next quarter via course listing
// covers ics and informatics departments
function scrapeCourseListing() {
  return new Promise(function(resolve, reject) {
    scrape({
      source:'ics',
      year:'2016', period:'spring'
    }, (err, canTake) => {
      if (err) throw err;
      // Remove leading zeros, e.g. STATS 007 becomes STATS 7
      resolve(format(canTake, / 0+/, ' '))
    })
  });
}

// If we're close enough to the next quarter, can use websoc too
function scrapeWebSOC() {
  function scrapeInformatics() {
    return new Promise(function(resolve, reject) {
      scrape({
        source:'websoc', dept:'in4matx',
        year:'2016', period:'spring'
      }, (err, canTake) => {
        if (err) throw err;
        resolve(format(canTake, "In4matx", "INF "))
      })
    });
  }
  function scrapeICS() {
    return new Promise(function(resolve, reject) {
      scrape({
        source:'websoc', dept:'i&c sci',
        year:'2016', period:'spring'
      }, (err, canTake) => {
        if (err) throw err;
        resolve(format(canTake, /^I/, "ICS "))
      })
    });
  }
  return Promise.all([
    scrapeInformatics(),
    scrapeICS()
  ]).spread((inf, ics) => inf.concat(ics))
}

function take(needed) {
  return function(canTake) {
    var doTake = []
    _.each(canTake, c => _.includes(needed, c.id) ? doTake.push(c) : null)
    return doTake;
  }
}

// if websoc has not published next quarter, use this
//scrapeWebSOC().then(take(needed)).then(results => console.log(results))

// if websoc has published next quarter, use this
scrapeCourseListing().then(take(needed)).then(results => console.log(results))
