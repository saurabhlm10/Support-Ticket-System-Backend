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
exports.quickSearchIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.params;
    if (!searchTerm) {
        return res.status(401).json({
            success: false,
            message: 'searchTerm Is Missing'
        });
    }
    try {
        const searchResults = yield Issue.find({ $or: [{ tokenId: new RegExp(searchTerm, 'i') }, { studentEmail: new RegExp(searchTerm, 'i') }, { studentPhone: new RegExp(searchTerm, 'i') }] });
        const openIssues = searchResults.filter(item => item.status === 'pending');
        const requestedIssues = searchResults.filter(item => item.status === 'not-assigned');
        const closedIssues = searchResults.filter(item => item.status === 'resolved');
        res.status(200).json({
            success: true,
            message: 'Fetched Search Results successfully',
            openIssues,
            requestedIssues,
            closedIssues
        });
        // res.status(200).json({
        //     success: true,
        //     message: 'Fetched Search Results successfully',
        //     searchResults
        // })
    }
    catch (error) {
        console.log(error);
    }
});
