
var request = require("request");
var Teradata = require('node-teradata');

/**
 * List Posts
 */
exports.list = function(req, res) {

     var config = {
          url: 'jdbc:teradata://10.21.2.46/LOGMECH=LDAP',
          username: 'iracine',
          password: 'copa1995!',
          driver: './jars/',
          minPoolSize: 1,
          maxPoolSize: 1,
          keepalive: {
               interval: 60000,
               query: 'SELECT 1',
               enabled: true
          }
     };

     var sql = "SELECT O.DTD, O.EQUIVALENT_DT, O.DEP_DT, O.LEG AS OD, O.FLT_NUM, O.REM_SEATS, O.PAX_CNT, O.BID_PRICE, MIN(O.OD_FARE_AMT) OFFERED_FARE  FROM(  SELECT(A.DEP_DT - DATE) DTD, A.DEP_DT, A.ORIG_CD || A.DEST_CD AS LEG, A.FLT_NUM, A.AVAIL_SEAT_CNT AS REM_SEATS, A.BID_PRICE_AMT AS BID_PRICE, F.OD_FARE_AMT, CASE WHEN B.PAX_CNT IS NULL THEN 0 ELSE B.PAX_CNT END PAX_CNT, CASE WHEN A.BID_PRICE_AMT > F.OD_FARE_AMT AND F.COS_CD = 'Y' THEN F.OD_FARE_AMT ELSE A.BID_PRICE_AMT END FAKE_BID_PRICE, B.FARE_AMT, B.AVG_DTD, D2.EQUIVALENT EQUIVALENT_DT  FROM PRM_DEPT.VA_PRM_RM_FLT_LEG_BID_PRICE A  LEFT JOIN(       SELECT DEP_DT, FLT_NUM, (ORIG_CD || DEST_CD) LEG, SUM(PAX_CNT) PAX_CNT, AVERAGE(RM_FARE_AMT) FARE_AMT, AVERAGE(DEP_DT - CREATION_DTZ) AVG_DTD FROM PRM_DEPT.VA_PNR_BOOKING_W_REVENUE WHERE CABIN_CD = 'Y'      AND CARRIER_CD = 'CM'      AND DEP_DT = '2019-10-07'      AND FLT_NUM = 453 GROUP BY DEP_DT, FLT_NUM, ORIG_CD, DEST_CD ) B ON A.DEP_DT = B.DEP_DT AND A.FLT_NUM = B.FLT_NUM AND A.ORIG_CD || A.DEST_CD = B.LEG  INNER JOIN DP_VDWH.RM_OD_FARE F ON F.OD_ORIG_CD = A.ORIG_CD AND F.OD_DEST_CD = A.DEST_CD AND F.OD_FARE_AMT GE FAKE_BID_PRICE AND A.DEP_DT LE F.DISC_DT AND A.DEP_DT GT F.EFF_DT  INNER JOIN PRM_DEPT.PRM_TEMP_SIGNIFICANT_CLASSES K ON F.COS_CD = K.COS_CD  INNER JOIN PRM_DEPT.PRM_DTD_CONVERSIONS D2 ON D2.DTD = A.DEP_DT - DATE  WHERE A.DEP_DT = '2019-10-07' AND A.FLT_NUM = 453 AND A.CABIN_CD = 'Y'  AND F.OD_ORIG_CD = 'EZE' AND F.OD_DEST_CD = 'PTY'  AND F.V_END_DTM > DATE  AND F.COS_CD NOT IN('C', 'J', 'D', 'R') ) O  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8 ORDER BY O.REM_SEATS"
     ;

     console.log(config);

     var teradata = new Teradata(config);

     return teradata.read(sql)
          .then(function(response) {
               var min_remaining_seats = response.reduce((max, flight) => flight.REM_SEATS > max ? flight.REM_SEATS : max, response[0].REM_SEATS);
               console.log(min_remaining_seats);

               res.apiResponse({
                    min_remaining_seats: min_remaining_seats
               });
          });
};


/*
     var options = {
          method: 'GET',
          url: 'https://api.copa.com/flights/v1.0/inventory/453/2019-08-07/CM/EZE/PTY',
          headers: {
               'Copa-Channel-ID': 'Kiosk',
               'Copa-Consumer-ID': 'mobile app',
               'Copa-Transaction-ID': '123e4567-e89b-12d3-a456-426655440000',
               'Ocp-Apim-Subscription-Key': '2d1a5d7de4764e4eae62a0bd1d5f0f95'
          }
     };
     //perform call
     request(options, function(error, response, body) {
          if (error) throw new Error(error);
          console.log(response.body.FlightDetails);
          res.apiResponse({
               flights: response
          });
     });


};

*/
