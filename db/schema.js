exports.app={
//  "/type/project": {
//    "_id": "/type/project",
//    "type": "/type/type",
//    "name": "Project",
//    "properties": {
//      "name": {
//        "name": "Name",
//        "unique": true,
//        "type": "string",
//        "required": true
//      },
//      "tasks": {
//        "name": "Tasks",
//        "unique": false,
//        "sync": true,
//        "type": ["/type/task"]
//      }
//    },
//    "indexes": {
//      "key": ["creator", "name"],
//      "creator": ["creator"]
//    }
//  },

  "/type/story": {
    "_id": "/type/story",
    "type": "/type/type",
    "name": "Story",
    "properties": {
      "name": {
        "name": "Story Name",
        "unique": true,
        "type": "string"
      },
      "author": {
        "name": "Author",
        "unique": true,
        "type": "string"
      },
      "language": {
        "name": "Language",
        "unique": true,
        "type": "string"
      },
      "date": {
        "name": "Date",
        "unique": true,
        "type": "date"
      }
    },
    "indexes": {
      "project": ["name"]
    }
  }
};

//todo(anton) tags should be associated with the story