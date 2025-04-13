class Todo {
    constructor({ _id, title, description, completed = false, createdAt, updatedAt }) {
      this._id = _id;
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
        title: this.title,
        description: this.description,
        completed: this.completed,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
  
  module.exports = Todo;