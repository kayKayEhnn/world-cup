const axios = require("axios").default;
const matchesToStats = require("./matchesToStats");
const filterMatches = require("./filterMatches");

axios.defaults.headers["X-Auth-Token"] = process.env.FOOTBALL_API_KEY;

const MATCHES_URL = "http://api.football-data.org/v2/competitions/2000/matches";
const COMPETITION_MATCHES = "COMPETITION_MATCHES";

const cacheChecker = (key, onAvailable, onMissing) => {
  return function(cache) {
    return new Promise((resolve, reject) => {
      cache.get(key, (er, data) => {
        if (data) {
          resolve(onAvailable(JSON.parse(data)));
        } else {
          onMissing().then(data => {
            resolve(onAvailable(data));

            // API calls used to be cached for 30s but are now infinitely
            // stored since data is effectively static.
            cache.set(COMPETITION_MATCHES, JSON.stringify(data));
          });
        }
      });
    });
  };
};

const onError = err => {
  console.log("Football API error, trying again", err);
  return axios
    .get(MATCHES_URL)
    .then(res => res.data)
    .catch(onError);
};

const getMatches = () =>
  axios
    .get(MATCHES_URL)
    .then(res => res.data)
    .catch(onError);

exports.getTeamStatistics = cacheChecker(
  COMPETITION_MATCHES,
  matchesToStats,
  getMatches
);

exports.getTeamMatches = teamName =>
  cacheChecker(
    COMPETITION_MATCHES,
    data => {
      let matches = filterMatches(teamName, data);
      let stats = matchesToStats(data)[teamName];
      return { matches, stats };
    },
    getMatches
  );

exports.getMatch = matchId =>
  cacheChecker(
    COMPETITION_MATCHES,
    data => {
      let match = data.matches.find(m => m.id === matchId);
      return match;
    },
    getMatches
  );
