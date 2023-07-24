"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Issue = require("../../model/Issue");
exports.filterIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    const arr = [];
    for (let [key, value] of Object.entries(data)) {
        if (value !== "") {
            arr.push([key, value.toLowerCase()]);
        }
    }
    const filterObj = Object.fromEntries(arr);
    console.log(filterObj);
    const filteredData = yield Issue.find(filterObj);
    console.log(filteredData);
    res.status(200).json({
        filteredData
    });
});
