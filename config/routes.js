module.exports.routes = {

  "/": {
    view: "login",
    locals: {
      layout: "LRLayout"
    }
  },
  
  "/signUp": {
    view: "signUp",
    locals: {
      layout: "LRLayout"
    }
  },

  "/home": {
    controller: "person",
    action: "homeView"
  },

  "/deletePerson": {
    controller: "person",
    action: "deletePerson"
  },

  "/profile/:login": {
    controller: "Person",
    action: "personView",
    skipAssets: true
  },

  "/editProfile": {
    controller: "Person",
    action: "editProfile"
  },

  '/group/:group': {
    controller: 'Community',
    action: 'groupView',
    skipAssets: true
  },

  '/createGroup': {
    controller: 'Community',
    action: 'createGroupView',
    skipAssets: true
  },

  '/editGroup/:group': {
    controller: 'Community',
    action: 'editGroupView',
    skipAssets: true
  },
  
  '/addMembers/:group/:search': {
    controller: 'Community',
    action: 'addMembersView',
    skipAssets: true
  },

  '/addMembers/:group': {
    controller: 'Community',
    action: 'addMembersEmptySearchView',
    skipAssets: true
  },

  '/searchResult/:filter': {
    controller: 'Person',
    action: 'searchResultView',
    skipAssets: true
  },

  '/import': {
    view: "import"
  }

};
