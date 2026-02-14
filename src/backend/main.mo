import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Persistent data stores
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User-facing type for project summaries
  type ProjectSummary = {
    id : Text;
    projectName : Text;
    lastModified : Int;
  };

  var nextProjectId = 0;

  // Project data structure
  type Project = {
    id : Text;
    ownerId : Principal;
    projectName : Text;
    garmentType : Text;
    baseColor : Text;
    elements : [DesignElement];
    lastModified : Time.Time;
  };

  type DesignElement = {
    type_ : Text; // e.g. "shape", "text", "logo"
    posX : Int;
    posY : Int;
    color : Text;
    size : Int;
    content : Text; // Extra data (e.g. text content, logo reference)
  };

  // Projects are stored in a persistent project store
  let projects = Map.empty<Text, Project>();

  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      switch (project1.lastModified < project2.lastModified) {
        case (true) {
          #less;
        };
        case (false) {
          switch (project1.lastModified == project2.lastModified) {
            case (true) { #equal };
            case (false) { #greater };
          };
        };
      };
    };
  };

  // Core CRUD for projects
  public shared ({ caller }) func createProject(projectName : Text, garmentType : Text, baseColor : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save projects");
    };

    let projectId = "p" # nextProjectId.toText();
    nextProjectId += 1;

    let project : Project = {
      id = projectId;
      ownerId = caller;
      projectName;
      garmentType;
      baseColor;
      lastModified = Time.now();
      elements = [];
    };

    projects.add(projectId, project);
    projectId;
  };

  public query ({ caller }) func getProject(projectId : Text) : async ?Project {
    let project = projects.get(projectId);
    
    switch (project) {
      case (null) {
        null;
      };
      case (?p) {
        // Only the owner or admins can view a project
        if (caller != p.ownerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only owner or admins can view this project");
        };
        ?p;
      };
    };
  };

  public shared ({ caller }) func updateProject(projectId : Text, updatedProject : Project) : async () {
    let existingProject = projects.get(projectId);

    switch (existingProject) {
      case (null) {
        Runtime.trap("This project does not exist (" # projectId # ")");
      };
      case (?project) {
        if (caller != project.ownerId) {
          Runtime.trap("Unauthorized: Only owner can update project");
        };
        projects.add(projectId, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    let existingProject = projects.get(projectId);

    switch (existingProject) {
      case (null) {
        Runtime.trap("This project does not exist (" # projectId # ")");
      };
      case (?project) {
        if (caller != project.ownerId) {
          Runtime.trap("Unauthorized: Only owner can delete project");
        };
        projects.remove(projectId);
      };
    };
  };

  // Get a list of project summaries for a user
  public query ({ caller }) func getUserProjects(user : Principal) : async [ProjectSummary] {
    // Only the user themselves or admins can list their projects
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };

    projects.values().toArray().filter(
      func(project) {
        project.ownerId == user;
      }
    ).map(
      func(p) {
        {
          id = p.id;
          projectName = p.projectName;
          lastModified = p.lastModified;
        };
      }
    );
  };
};
