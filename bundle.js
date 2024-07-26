/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

eval("var entries = [];\nvar tsvURL = \"ehouse.tsv\";\nvar groupTemplate = document.querySelector(\"#groupTemplate\");\nvar groupUpTemplate = document.querySelector(\"#groupUpTemplate\");\nvar NUM_FRESHMEN = 32;\nvar currentTrees = [];\nvar Branch = /** @class */ (function () {\n    function Branch(lvl, element, entries) {\n        this.lvl = lvl;\n        this.element = element;\n        this.entries = entries;\n    }\n    Branch.prototype.hasFreshman = function () {\n        for (var i = 0; i < this.entries.length; i++) {\n            if (this.entries[i].isFreshman) {\n                // this.element.children[0].children[0].textContent += \" \" + this.entries[i].name;\n                return true;\n            }\n        }\n        return false;\n    };\n    return Branch;\n}());\nvar Tree = /** @class */ (function () {\n    function Tree(root, rootBranch) {\n        if (rootBranch === void 0) { rootBranch = null; }\n        this.entries = [root];\n        this.root = root;\n        this.rootBranch = rootBranch;\n    }\n    Tree.prototype.addEntry = function (entry) {\n        this.entries.push(entry);\n    };\n    Tree.prototype.setRootBranch = function (branch) {\n        this.rootBranch = branch;\n    };\n    return Tree;\n}());\nfunction getEntry(name) {\n    for (var i = 0; i < entries.length; i++) {\n        if (entries[i].name == name || entries[i].nickname == name) {\n            return entries[i];\n        }\n    }\n    return null;\n}\nfunction onNameClick(element, entry) {\n    var group = element.parentElement.parentElement;\n    if (group.classList.contains(\"collapsed\")) {\n        element.parentElement.parentElement.classList.remove(\"collapsed\");\n    }\n    else {\n        element.parentElement.parentElement.classList.add(\"collapsed\");\n    }\n    var rootGroup = group;\n    while (rootGroup.parentElement.classList.contains(\"horiGrouping\")) {\n        rootGroup = rootGroup.parentElement.parentElement;\n    }\n    console.log(rootGroup);\n    recalculatePositionsLocal(rootGroup);\n}\nfunction createBranch(person, parent, tree, collapseAdopted, removeNonFreshmen) {\n    if (collapseAdopted === void 0) { collapseAdopted = true; }\n    if (removeNonFreshmen === void 0) { removeNonFreshmen = false; }\n    var treeHasPerson = tree.entries.includes(person);\n    if (!treeHasPerson) {\n        tree.addEntry(person);\n    }\n    var newGrouping = groupTemplate.content.cloneNode(true).firstChild;\n    newGrouping.childNodes[1].childNodes[1].textContent = person.name;\n    if (person.mentees.length + person.adoptedMentees.length == 0) {\n        newGrouping.childNodes[1].classList.add(\"leaf\");\n        return new Branch(0, newGrouping, [person]);\n    }\n    else {\n        if ((collapseAdopted && person.mentors.length > 0 && person.adopters.includes(parent)) ||\n            (removeNonFreshmen && treeHasPerson && tree.root != person)) {\n            newGrouping.classList.add(\"collapsed\");\n        }\n        newGrouping.childNodes[1].childNodes[1].onclick = function (e) {\n            onNameClick(newGrouping.childNodes[1].childNodes[1], person);\n        };\n        var maxLvl = 0;\n        var sillies = [person];\n        var bottom = newGrouping.childNodes[1].childNodes[5];\n        var index = 0;\n        var adoptedStartIndex = void 0;\n        for (var i = 0; i < person.mentees.length; i++) {\n            var branch = createBranch(person.mentees[i], person, tree, collapseAdopted, removeNonFreshmen);\n            if (!removeNonFreshmen || branch.hasFreshman()) {\n                if (branch.lvl > maxLvl) {\n                    maxLvl = branch.lvl;\n                }\n                for (var j = 0; j < branch.entries.length; j++) {\n                    if (!sillies.includes(branch.entries[j])) {\n                        sillies.push(branch.entries[j]);\n                    }\n                }\n                newGrouping.childNodes[3].appendChild(branch.element);\n                index++;\n            }\n        }\n        adoptedStartIndex = index;\n        for (var i = 0; i < person.adoptedMentees.length; i++) {\n            var branch = createBranch(person.adoptedMentees[i], person, tree, collapseAdopted, removeNonFreshmen);\n            if (!removeNonFreshmen || branch.hasFreshman()) {\n                if (branch.lvl > maxLvl) {\n                    maxLvl = branch.lvl;\n                }\n                for (var j = 0; j < branch.entries.length; j++) {\n                    if (!sillies.includes(branch.entries[j])) {\n                        sillies.push(branch.entries[j]);\n                    }\n                }\n                if (index == 0) {\n                    newGrouping.childNodes[1].childNodes[5].classList.add(\"dottedLeft\");\n                }\n                newGrouping.childNodes[3].appendChild(branch.element);\n                index++;\n            }\n        }\n        if (index == 1) {\n            newGrouping.childNodes[1].classList.add(\"singleton\");\n            if (adoptedStartIndex == 0) {\n                // (newGrouping.children[0].children[1].children[0] as HTMLDivElement).classList.add(\"dottedRight\");\n                // (newGrouping.children[0].children[1].children[1] as HTMLDivElement).classList.add(\"dottedLeft\");\n                newGrouping.children[0].children[2].classList.add(\"dottedRight\");\n            }\n        }\n        else if (index > adoptedStartIndex) {\n            newGrouping.childNodes[1].childNodes[5].classList.add(\"dottedRight\");\n        }\n        for (var i = 1; i < index - 1; i++) {\n            var line = document.createElement(\"div\");\n            line.classList.add(\"midLine\");\n            if (i >= adoptedStartIndex) {\n                line.classList.add(\"dottedLeft\");\n            }\n            bottom.appendChild(line);\n        }\n        return new Branch(maxLvl + 1, newGrouping, sillies);\n    }\n}\n// function createUpBranch(person: Entry, parent: Entry, tree: Tree): Branch {\n//     let newGrouping = groupTemplate.content.cloneNode(true).firstChild as HTMLDivElement;\n//     newGrouping.childNodes[1].childNodes[1].textContent = person.name;\n//     if(person.mentees.length + person.adoptedMentees.length == 0) {\n//         (newGrouping.childNodes[1] as HTMLDivElement).classList.add(\"leaf\");\n//         return {lvl: 0, element: newGrouping};\n//     } else {\n//         if(person.mentors.length > 0 && person.adopters.includes(parent)) {\n//             newGrouping.classList.add(\"collapsed\");\n//         }\n//         (newGrouping.childNodes[1].childNodes[1] as HTMLDivElement).onclick = (e: MouseEvent) => {\n//             onNameClick(newGrouping.childNodes[1].childNodes[1] as HTMLDivElement, person);\n//         };\n//         if(person.mentees.length + person.adoptedMentees.length == 1) {\n//             (newGrouping.childNodes[1] as HTMLDivElement).classList.add(\"singleton\");\n//         }\n//         let maxLvl = 0;\n//         let bottom = newGrouping.childNodes[1].childNodes[5];\n//         let index = 0;\n//         let adoptedStartIndex: number;\n//         for(let i = 0; i < person.mentees.length; i++) {\n//             let branch = createBranch(person.mentees[i], person, tree);\n//             if(branch.lvl > maxLvl) {\n//                 maxLvl = branch.lvl;\n//             }\n//             newGrouping.childNodes[3].appendChild(branch.element);\n//             index++;\n//         }\n//         adoptedStartIndex = index;\n//         for(let i = 0; i < person.adoptedMentees.length; i++) {\n//             let branch = createBranch(person.adoptedMentees[i], person, tree);\n//             if(branch.lvl > maxLvl) {\n//                 maxLvl = branch.lvl;\n//             }\n//             if(index == 0) {\n//                 (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add(\"dottedLeft\");\n//             } else if(index == person.mentees.length + person.adoptedMentees.length - 1) {\n//                 (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add(\"dottedRight\");\n//             }\n//             newGrouping.childNodes[3].appendChild(branch.element);\n//             index++;\n//         }\n//         for(let i = 1; i < index - 1; i++) {\n//             let line = document.createElement(\"div\") as HTMLDivElement;\n//             line.classList.add(\"midLine\");\n//             if(i >= adoptedStartIndex) {\n//                 line.classList.add(\"dottedLeft\");\n//             }\n//             bottom.appendChild(line);\n//         }\n//         return {lvl: maxLvl + 1, element: newGrouping};\n//     }\n// }\n// all entries should already be added by the time this is run\nfunction setMentees(lines) {\n    for (var i = lines.length - 1; i > 0; i--) { //does not use first line since it is column names\n        var vals = lines[i].split(\"\\t\");\n        var adopterStrings = vals[5].split(\",\");\n        var mentorStrings = vals[4].split(\",\");\n        var adopters = [];\n        for (var j = 0; j < adopterStrings.length; j++) {\n            var n = getEntry(adopterStrings[j].trim());\n            if (n) {\n                adopters.push(n);\n            }\n            else if (adopterStrings[j].trim().length > 0) {\n                console.log(\"Entry not found for \" + adopterStrings[j].trim());\n            }\n        }\n        var mentors = [];\n        for (var j = 0; j < mentorStrings.length; j++) {\n            var n = getEntry(mentorStrings[j].trim());\n            if (n) {\n                mentors.push(n);\n            }\n            else if (mentorStrings[j].trim().length > 0) {\n                console.log(\"Entry not found for \" + mentorStrings[j].trim());\n            }\n        }\n        var menteeEntry = getEntry(vals[3].trim());\n        if (!menteeEntry) {\n            console.log(\"WEE WOO WEE WOO \" + vals[3] + \" NOT FOUND\");\n        }\n        for (var j = 0; j < mentors.length; j++) {\n            mentors[j].mentees.push(menteeEntry);\n            menteeEntry.mentors.push(mentors[j]);\n        }\n        for (var j = 0; j < adopters.length; j++) {\n            adopters[j].adoptedMentees.push(menteeEntry);\n            menteeEntry.adopters.push(adopters[j]);\n        }\n    }\n}\nfunction recalculatePositions() {\n    var items = document.querySelectorAll(\".grouping:not(.collapsed):not(.up) > .branchContainer:not(.leaf)\");\n    for (var i = items.length - 1; i >= 0; i--) {\n        var siblingHori = items[i].parentElement.childNodes[3];\n        if (items[i].classList.contains(\"singleton\")) {\n            var bottom1 = siblingHori.childNodes[1].childNodes[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2) - (boxItem.x + boxItem.width / 2)) + \"px)\";\n        }\n        else {\n            var bottom1 = siblingHori.childNodes[1].childNodes[1];\n            var bottom2 = siblingHori.childNodes[siblingHori.childNodes.length - 1].childNodes[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var box2 = bottom2.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            items[i].style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + \"px\";\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + \"px)\";\n        }\n        for (var j = 2; j < siblingHori.childNodes.length - 1; j++) {\n            var line = items[i].childNodes[5].childNodes[j - 2];\n            var box = siblingHori.childNodes[j].childNodes[1].getBoundingClientRect();\n            var boxLine = line.getBoundingClientRect();\n            line.style.transform = \"translateX(\" + ((box.x + box.width / 2) - (boxLine.x + boxLine.width / 2)) + \"px)\";\n        }\n    }\n    items = document.querySelectorAll(\".grouping.up:not(.collapsed) > .branchContainer:not(.leaf)\");\n    for (var i = items.length - 1; i >= 0; i--) {\n        var siblingHori = items[i].parentElement.children[0];\n        if (items[i].classList.contains(\"singleton\")) {\n            var bottom1 = siblingHori.children[0].children[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2) - (boxItem.x + boxItem.width / 2)) + \"px)\";\n        }\n        else {\n            var bottom1 = siblingHori.children[0].children[1];\n            var bottom2 = siblingHori.children[siblingHori.children.length - 1].children[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var box2 = bottom2.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            console.log(((box2.x + box2.width / 2) - (box1.x + box1.width / 2)));\n            console.log(bottom2);\n            items[i].style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + \"px\";\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + \"px)\";\n            console.log(items[i]);\n        }\n        for (var j = 1; j < siblingHori.children.length - 1; j++) {\n            var line = items[i].childNodes[5].childNodes[j - 1];\n            var box = siblingHori.children[j].childNodes[1].getBoundingClientRect();\n            var boxLine = line.getBoundingClientRect();\n            line.style.transform = \"translateX(\" + ((box.x + box.width / 2) - (boxLine.x + boxLine.width / 2)) + \"px)\";\n        }\n    }\n}\nfunction recalculatePositionsLocal(top) {\n    var itemsClear = top.querySelectorAll(\":scope.grouping > .branchContainer:not(.leaf), :scope .grouping > .branchContainer:not(.leaf)\");\n    var lines = top.querySelectorAll(\":scope .midLine\");\n    for (var i = 0; i < itemsClear.length; i++) {\n        itemsClear[i].style.width = \"\";\n        itemsClear[i].style.transform = \"\";\n    }\n    for (var i = 0; i < lines.length; i++) {\n        lines[i].style.transform = \"\";\n    }\n    var items = top.querySelectorAll(\":scope.grouping:not(.collapsed) > .branchContainer:not(.leaf), :scope .grouping:not(.collapsed) > .branchContainer:not(.leaf)\"); // this selector needs to include the top scope object itself \n    for (var i = items.length - 1; i >= 0; i--) {\n        var siblingHori = items[i].parentElement.childNodes[3];\n        if (items[i].classList.contains(\"singleton\")) {\n            var bottom1 = siblingHori.childNodes[1].childNodes[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2) - (boxItem.x + boxItem.width / 2)) + \"px)\";\n        }\n        else if (siblingHori.childNodes.length % 2 == 1) {\n            var bottom1 = siblingHori.childNodes[1].childNodes[1];\n            var bottom2 = siblingHori.childNodes[siblingHori.childNodes.length - 1].childNodes[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var box2 = bottom2.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            items[i].style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + \"px\";\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + \"px)\";\n        }\n        else {\n            var bottom1 = siblingHori.childNodes[1].childNodes[1];\n            var bottom2 = siblingHori.childNodes[siblingHori.childNodes.length - 1].childNodes[1];\n            var box1 = bottom1.getBoundingClientRect();\n            var box2 = bottom2.getBoundingClientRect();\n            var boxItem = items[i].getBoundingClientRect();\n            items[i].style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + \"px\";\n            items[i].style.transform = \"translateX(\" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + \"px)\";\n        }\n        for (var j = 2; j < siblingHori.childNodes.length - 1; j++) {\n            var line = items[i].childNodes[5].childNodes[j - 2];\n            var box = siblingHori.childNodes[j].childNodes[1].getBoundingClientRect();\n            var boxLine = line.getBoundingClientRect();\n            line.style.transform = \"translateX(\" + ((box.x + box.width / 2) - (boxLine.x + boxLine.width / 2)) + \"px)\";\n        }\n    }\n}\nfunction clearTree() {\n    currentTrees.forEach(function (tree) {\n        tree.rootBranch.element.remove();\n    });\n    currentTrees = [];\n}\nfunction createTree() {\n    for (var i = 0; i < entries.length; i++) {\n        if (entries[i].mentors.length == 0 && entries[i].adopters.length == 0 && (entries[i].mentees.length > 0 || entries[i].adoptedMentees.length > 0)) {\n            var tree = new Tree(entries[i]);\n            var newGrouping = createBranch(entries[i], null, tree);\n            tree.setRootBranch(newGrouping);\n            currentTrees.push(tree);\n            document.querySelector(\"body\").appendChild(newGrouping.element);\n        }\n    }\n}\nfunction createTreeFreshmen() {\n    for (var i = 0; i < entries.length; i++) {\n        if (entries[i].mentors.length == 0 && entries[i].adopters.length == 0 && (entries[i].mentees.length > 0 || entries[i].adoptedMentees.length > 0)) {\n            var tree = new Tree(entries[i]);\n            var newGrouping = createBranch(entries[i], null, tree, false, true);\n            tree.setRootBranch(newGrouping);\n            for (var i_1 = 0; i_1 < tree.entries.length; i_1++) {\n                if (tree.entries[i_1].isFreshman) {\n                    currentTrees.push(tree);\n                    document.querySelector(\"body\").appendChild(newGrouping.element);\n                    break;\n                }\n            }\n        }\n    }\n}\nfunction loadAllEntries(onfinish) {\n    var request = new XMLHttpRequest();\n    request.open(\"GET\", tsvURL);\n    request.addEventListener(\"readystatechange\", function () {\n        if (request.readyState == 4 && request.status == 200) {\n            var resp = request.response;\n            var lines = resp.split(\"\\n\");\n            for (var i = lines.length - 1; i > 0; i--) { //does not use first line since it is column names\n                var vals = lines[i].split(\"\\t\");\n                var nickname = vals[2].trim() + \" \" + vals[0].trim();\n                var newEntry = { name: vals[3].trim(), nickname: nickname, mentors: [], adopters: [], mentees: [], adoptedMentees: [], isFreshman: i <= NUM_FRESHMEN };\n                entries.push(newEntry);\n            }\n            setMentees(lines);\n            onfinish();\n        }\n    });\n    request.send();\n}\nloadAllEntries(function () {\n    var nameSelector = document.querySelector(\"#nameSelector\");\n    nameSelector.oninput = function () {\n        var entry = getEntry(nameSelector.value.trim());\n        if (entry) {\n            document.querySelector(\"#showLine\").classList.remove(\"disabled\");\n        }\n        else {\n            document.querySelector(\"#showLine\").classList.add(\"disabled\");\n        }\n    };\n    document.querySelector(\"#showAll\").onclick = function () {\n        clearTree();\n        createTree();\n        recalculatePositions();\n    };\n    document.querySelector(\"#showFreshmen\").onclick = function () {\n        clearTree();\n        createTreeFreshmen();\n        recalculatePositions();\n    };\n});\nrecalculatePositions();\n//@ts-ignore\nwindow.getEntry = getEntry;\n\n\n//# sourceURL=webpack://family-tree/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;