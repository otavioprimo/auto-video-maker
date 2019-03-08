"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts = require("prompts");
start();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield askAndReturnAnswers();
        console.log(content);
    });
}
function askAndReturnAnswers() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const questions = [
                {
                    type: 'text',
                    name: 'searchTerm',
                    message: 'Type a Wikipedia search term:',
                    validate: value => typeof value === 'string' ? value.trim() !== '' : false
                },
                {
                    type: 'select',
                    name: 'prefix',
                    message: 'Choose one option:',
                    choices: [
                        {
                            title: 'Who is',
                            value: 'Who is'
                        },
                        {
                            title: 'What is',
                            value: 'What is'
                        },
                        {
                            title: 'The history of',
                            value: 'The history of'
                        }
                    ],
                    validate: value => typeof value === 'string' ? value.trim() !== '' : false
                }
            ];
            const promptOptions = {
                onCancel: () => reject(new Error('The user has stopped answer'))
            };
            const response = yield prompts(questions, promptOptions);
            resolve(response);
        }));
    });
}
