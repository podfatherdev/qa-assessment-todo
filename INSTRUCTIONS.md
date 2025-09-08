# BugDo – a buggy Todo app

Welcome! Our junior engineer has created this simple Todo app, which allows users to create and manage tasks. Below are the requirements and acceptance criteria for the application. When you have read through these, please test the app yourself and review it for any issues.

You can use the button in the top right, **Open Preview in new tab**, to preview the app without this editor in the way. When doing this, you may need to allow popups for this specific url in your browser. Subsequently, you should be able to open, close and refresh as many tabs as you like. Just be sure to keep this Stackblitz page open.

### Requirements

* Two different users can log in and manage their own tasks
  * **Note:** The login screen is a convenience allowing you to simulate logging in as either user. In the real world, this application would have a username/password login form.
* A Regular User can:
  * See only the tasks assigned to them
  * Create a new task using the input field at the top of the list
  * Edit an existing task
    * Using the edit button which shows on hover
    * By double-clicking the task text
  * Delete a task using the delete button which shows on hover
  * Toggle a task as completed/incomplete using the checkbox
  * See when a task was created or last updated
* The todos list view also allows:
  * Filtering tasks by status (All, Active, Completed)
  * Deleting all the user's completed tasks with the "Clear completed" button
* An Admin User can, additionally:
  * See, edit and delete tasks assigned to all users
  * Reassign a task, by clicking on the colour-coded user badge
  * Complete **only their own tasks**. If they want to complete another user's task, they must first reassign it to themselves.
* An Admin User also has access to the Admin Panel, where they can:
  * See the list of all users
  * Rename users
  * Update a user's role, eg. promote a Regular User to Admin
