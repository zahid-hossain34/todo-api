class Todo {
    constructor({ _id, userId, title, description, completed = false, createdAt, updatedAt }) {
      if (!userId) throw new Error("User ID is required");
      this._id = _id;
      this.userId = userId;
      this.title = title;
      this.description = description;
      this.completed = completed;
      this.createdAt = createdAt || new Date().toISOString();
      this.updatedAt = updatedAt;
    }
  
    markAsCompleted() {
      this.completed = true;
      this.updatedAt = new Date().toISOString();
    }
  
    update({ title, description, completed }) {
      if (title) this.title = title;
      if (description) this.description = description;
      if (completed !== undefined) this.completed = completed;
      this.updatedAt = new Date().toISOString();
    }
  
    toJSON() {
      return {
        _id: this._id,
        userId: this.userId,
        title: this.title,
        description: this.description,
        completed: this.completed,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
  
  module.exports = Todo;