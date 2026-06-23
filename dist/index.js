#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TASKS_FILE = path_1.default.join(process.cwd(), "tasks.json");
class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
    }
    loadTasks() {
        if (!fs_1.default.existsSync(TASKS_FILE))
            return (this.tasks = []);
        const raw = fs_1.default.readFileSync(TASKS_FILE, "utf-8");
        return (this.tasks = JSON.parse(raw));
    }
    saveTasks(tasks) {
        fs_1.default.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    }
    nextId() {
        return this.tasks.length === 0
            ? 1
            : Math.max(...this.tasks.map((t) => t.id)) + 1;
    }
    now() {
        return new Date().toISOString();
    }
    add(description) {
        const task = {
            id: this.nextId(),
            description,
            status: "todo",
            createdAt: this.now(),
            updatedAt: this.now(),
        };
        this.tasks.push(task);
        this.saveTasks(this.tasks);
        console.log(`Task added successfully (ID: ${task.id})`);
    }
    delete(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) {
            console.log(`Task with ID ${id} not found`);
            return;
        }
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.saveTasks(this.tasks);
        console.log(`Task deleted successfully (ID: ${id})`);
    }
    update(id, description) {
        const findTask = this.tasks.find((t) => t.id === id);
        if (!findTask) {
            console.log(`Task with ID ${id} not found`);
            return;
        }
        findTask.description = description;
        findTask.updatedAt = this.now();
        this.saveTasks(this.tasks);
        console.log(`Task updated successfully (ID: ${id})`);
    }
    mark(id, status) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) {
            console.log(`Task with ID ${id} not found`);
            return;
        }
        task.status = status;
        task.updatedAt = this.now();
        this.saveTasks(this.tasks);
        console.log(`Task marked as ${status} (ID: ${id})`);
    }
    list(status) {
        const tasksToDisplay = status
            ? this.tasks.filter((t) => t.status === status)
            : this.tasks;
        tasksToDisplay.forEach((task) => {
            console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
        });
    }
    appendTask(description) {
        const task = {
            id: this.nextId(),
            description,
            status: "todo",
            createdAt: this.now(),
            updatedAt: this.now(),
        };
        if (!fs_1.default.existsSync(TASKS_FILE)) {
            fs_1.default.writeFileSync(TASKS_FILE, JSON.stringify([task], null, 2));
            return;
        }
        const raw = fs_1.default.readFileSync(TASKS_FILE, "utf-8").trimEnd();
        const withoutClosing = raw.slice(0, raw.lastIndexOf("]"));
        const isEmpty = withoutClosing.trim().endsWith("[");
        const newEntry = JSON.stringify(task, null, 2);
        const result = isEmpty
            ? `${withoutClosing}${newEntry}]`
            : `${withoutClosing},\n${newEntry}]`;
        this.saveTasks(JSON.parse(result));
        console.log(`Task added successfully (ID: ${task.id})`);
    }
}
const manager = new TaskManager();
const [, , command, ...args] = process.argv;
switch (command) {
    case "add":
        // manager.add(args[0] || "No description provided");
        manager.appendTask(args[0] || "No decription provided");
        break;
    case "delete":
        const id = parseInt(args[0]);
        if (isNaN(id)) {
            console.log("Please provide a valid task ID");
            break;
        }
        manager.delete(id);
        break;
    case "update":
        manager.update(Number(args[0]), args[1]);
        break;
    case "mark-in-progress":
        manager.mark(Number(args[0]), "in-progress");
        break;
    case "mark-done":
        manager.mark(Number(args[0]), "done");
        break;
    case "list":
        const validStatuses = ["todo", "in-progress", "done"];
        if (args[0] && !validStatuses.includes(args[0])) {
            console.log(`Error: invalid status "${args[0]}"`);
            console.log(`Valid values: ${validStatuses.join(", ")}`);
            break;
        }
        manager.list(args[0]);
        break;
    default:
        console.log(`Unknown command: ${command}`);
}
//# sourceMappingURL=index.js.map