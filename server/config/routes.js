const controllers = require("../controllers/");
const auth = require("./auth");

module.exports = app => {
  const onlyAuthenticated = auth.enforceAuthStatus(true);
  const onlyAdmins = auth.isInRole("admin");

  app.get("/api/users/:userEmail", controllers.users.getByEmail);
  app.post("/api/users", controllers.users.registerPost);
  app.post("/api/users/_login", controllers.users.loginPost);
  app.post("/api/users/_logout", onlyAuthenticated, controllers.users.logout);
  app.put(
    "/api/users/:userId/teams",
    onlyAuthenticated,
    controllers.users.setFavouriteTeams
  );

  app.get("/api/teams", controllers.teams.getTeams);
  app.get("/api/teams/:teamName", controllers.teams.getTeamMatches);
  app.get("/api/matches/:matchId", controllers.teams.getMatchById);

  app.get("/api/users", onlyAdmins, controllers.users.getAllUsers);
  app.put("/api/users/:userId", onlyAdmins, controllers.users.editUser);
  app.delete("/api/users/:userId", onlyAdmins, controllers.users.deleteUser);

  app.get("/*", controllers.home.index);
};
