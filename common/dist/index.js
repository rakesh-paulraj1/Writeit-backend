"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogInput = exports.createBlogInput = exports.signininput = exports.signupinput = void 0;
const zod_1 = require("zod");
exports.signupinput = zod_1.z.object({
    name: zod_1.z.string().nonempty('Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
});
exports.signininput = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().nonempty('Password is required'),
});
exports.createBlogInput = zod_1.z.object({
    title: zod_1.z.string().nonempty('Title is required'),
    content: zod_1.z.string().nonempty('Content is required'),
});
exports.updateBlogInput = zod_1.z.object({
    title: zod_1.z.string().nonempty('Title is required'),
    content: zod_1.z.string().nonempty('Content is required'),
    id: zod_1.z.number().int('ID must be an integer'),
});
