import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type Category = {
    #politics;
    #viral;
    #trending;
    #social;
  };

  public type ArticleId = Nat;

  // Regular record for internal state management
  type InternalNewsArticle = {
    id : ArticleId;
    title : Text;
    summary : Text;
    category : Category;
    timestamp : Int;
    source : Text;
    creator : Principal;
    shareCount : Nat; // Make this field immutable
  };

  // Immutable snapshot type for external interactions
  public type NewsArticle = {
    id : ArticleId;
    title : Text;
    summary : Text;
    category : Category;
    timestamp : Int;
    source : Text;
    creator : Principal;
    shareCount : Nat; // Immutable field for external consumption
  };

  public type UserProfile = {
    name : Text;
  };

  // Explicit comparison function for NewsArticle using category
  module NewsArticle {
    public func compareByCategory(a : NewsArticle, b : NewsArticle) : Order.Order {
      switch (Text.compare(a.title, b.title)) {
        case (#equal) { Text.compare(a.summary, b.summary) };
        case (order) { order };
      };
    };
  };

  var nextId = 1;

  let articles = Map.empty<ArticleId, InternalNewsArticle>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Consts
  let pageSize = 10;

  // Utility function to convert InternalNewsArticle to immutable NewsArticle
  func toSnapshot(internal : InternalNewsArticle) : NewsArticle {
    {
      id = internal.id;
      title = internal.title;
      summary = internal.summary;
      category = internal.category;
      timestamp = internal.timestamp;
      source = internal.source;
      creator = internal.creator;
      shareCount = internal.shareCount;
    };
  };

  // User profile management
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

  // Create news article - requires user permission
  public shared ({ caller }) func createNewsArticle(title : Text, summary : Text, category : Category, source : Text) : async ArticleId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create articles");
    };

    let article : InternalNewsArticle = {
      id = nextId;
      title;
      summary;
      category;
      timestamp = Time.now();
      source;
      creator = caller;
      shareCount = 0;
    };

    articles.add(nextId, article);
    nextId += 1;
    article.id;
  };

  // Get article by id - public access
  public query func getNewsArticle(id : ArticleId) : async NewsArticle {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?internalArticle) { toSnapshot(internalArticle) };
    };
  };

  // Update article - requires user permission and ownership or admin
  public shared ({ caller }) func updateNewsArticle(id : ArticleId, title : Text, summary : Text, category : Category, source : Text) : async NewsArticle {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update articles");
    };

    let internalArticle = switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };

    // Only the creator or an admin can update the article
    if (internalArticle.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the article creator or admins can update this article");
    };

    let updatedArticle : InternalNewsArticle = {
      id = internalArticle.id;
      title;
      summary;
      category;
      timestamp = internalArticle.timestamp;
      source;
      creator = internalArticle.creator;
      shareCount = internalArticle.shareCount;
    };

    articles.add(id, updatedArticle);
    toSnapshot(updatedArticle); // Return a snapshot of the updated article
  };

  // Delete article - admin only
  public shared ({ caller }) func deleteNewsArticle(id : ArticleId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };

    switch (articles.containsKey(id)) {
      case (false) { Runtime.trap("Article not found") };
      case (true) {};
    };
    articles.remove(id);
  };

  // Get paginated articles - public access
  public query func getPaginatedArticles(page : Nat) : async [NewsArticle] {
    let startIdx = page * pageSize;
    let iter = articles.values();
    let list = List.empty<InternalNewsArticle>();
    var i = 0;
    for (article in iter) {
      if (i >= startIdx and i < startIdx + pageSize) {
        list.add(article);
      };
      i += 1;
    };
    list.toArray().map(toSnapshot); // Convert to immutable snapshots
  };

  // Get filtered articles - public access
  public query func getArticlesByCategory(category : Category) : async [NewsArticle] {
    articles.values().toArray().filter(
      func(article) {
        article.category == category;
      }
    ).map(toSnapshot); // Convert to immutable snapshots
  };

  // Share article - public access (anyone can share)
  public shared func shareNewsArticle(id : ArticleId) : async () {
    let internalArticle = switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
     case (?article) { article };
    };

    let updatedArticle : InternalNewsArticle = {
      id = internalArticle.id;
      title = internalArticle.title;
      summary = internalArticle.summary;
      category = internalArticle.category;
      timestamp = internalArticle.timestamp;
      source = internalArticle.source;
      creator = internalArticle.creator;
      shareCount = internalArticle.shareCount + 1;
    };

    articles.add(id, updatedArticle);
  };
};
