let entries: Entry[] = [];

let tsvURL = "output.tsv";

const groupTemplate = document.querySelector("#groupTemplate") as HTMLTemplateElement;
const groupUpTemplate = document.querySelector("#groupUpTemplate") as HTMLTemplateElement;

const NUM_FRESHMEN = 24;

let currentTrees: Tree[] = [];

type Entry = {
    name: string,
    nickname: string,
    mentors: Entry[],
    adopters: Entry[],
    mentees: Entry[],
    adoptedMentees: Entry[],
    isFreshman: boolean
};

class Branch {
    lvl: number;
    element: HTMLDivElement;
    entries: Entry[];

    constructor(lvl: number, element: HTMLDivElement, entries: Entry[]) {
        this.lvl = lvl;
        this.element = element;
        this.entries = entries;
    }

    hasFreshman(): boolean {
        for(let i = 0; i < this.entries.length; i++) {
            if(this.entries[i].isFreshman) {
                // this.element.children[0].children[0].textContent += " " + this.entries[i].name;
                return true;
            }
        }
        return false;
    }
}

class Tree {
    entries: Entry[];
    root: Entry;

    rootBranch: Branch;

    constructor(root: Entry, rootBranch: Branch = null) {
        this.entries = [root];
        this.root = root;
        this.rootBranch = rootBranch;
    }

    addEntry(entry: Entry) {
        this.entries.push(entry);
    }

    setRootBranch(branch: Branch) {
        this.rootBranch = branch;
    }
}

function getEntry(name: string): Entry {
    if(name.trim() == "") {
	return null;
    }
    for(let i = 0; i < entries.length; i++) {
        if(entries[i].name == name || entries[i].nickname == name) {
            return entries[i];
        }
    }
    console.log("kung pow penis " + name);
    return null;
}

function onNameClick(element: HTMLDivElement, entry: Entry) {
    let group = element.parentElement.parentElement as HTMLDivElement;
    if(group.classList.contains("collapsed")) {
        element.parentElement.parentElement.classList.remove("collapsed");
    } else {
        element.parentElement.parentElement.classList.add("collapsed");
    }
    let rootGroup = group;
    while(rootGroup.parentElement.classList.contains("horiGrouping")) {
        rootGroup = rootGroup.parentElement.parentElement as HTMLDivElement;
    }
    console.log(rootGroup);
    recalculatePositionsLocal(rootGroup);
}

function createBranch(person: Entry, parent: Entry, tree: Tree, collapseAdopted = true, removeNonFreshmen = false): Branch {
    let treeHasPerson = tree.entries.includes(person);
    if(!treeHasPerson) {
        tree.addEntry(person);
    }
    let newGrouping = groupTemplate.content.cloneNode(true).firstChild as HTMLDivElement;
    newGrouping.childNodes[1].childNodes[1].textContent = person.name;
    if(person.mentees.length + person.adoptedMentees.length == 0) {
        (newGrouping.childNodes[1] as HTMLDivElement).classList.add("leaf");
        return new Branch(0, newGrouping, [person]);
    } else {
        if((collapseAdopted && person.mentors.length > 0 && person.adopters.includes(parent)) ||
                (removeNonFreshmen && treeHasPerson && tree.root != person)) {
            newGrouping.classList.add("collapsed");
        }
        (newGrouping.childNodes[1].childNodes[1] as HTMLDivElement).onclick = (e: MouseEvent) => {
            onNameClick(newGrouping.childNodes[1].childNodes[1] as HTMLDivElement, person);
        };
        let maxLvl = 0;
        let sillies: Entry[] = [person];
        let bottom = newGrouping.childNodes[1].childNodes[5];
        let index = 0;
        let adoptedStartIndex: number;
        for(let i = 0; i < person.mentees.length; i++) {
            let branch = createBranch(person.mentees[i], person, tree, collapseAdopted, removeNonFreshmen);
            if(!removeNonFreshmen || branch.hasFreshman()) {
                if(branch.lvl > maxLvl) {
                    maxLvl = branch.lvl;
                }
                for(let j = 0; j < branch.entries.length; j++) {
                    if(!sillies.includes(branch.entries[j])) {
                        sillies.push(branch.entries[j]);
                    }
                }
                newGrouping.childNodes[3].appendChild(branch.element);
                index++;
            }
        }
        adoptedStartIndex = index;
        for(let i = 0; i < person.adoptedMentees.length; i++) {
            let branch = createBranch(person.adoptedMentees[i], person, tree, collapseAdopted, removeNonFreshmen);
            if(!removeNonFreshmen || branch.hasFreshman()) {
                if(branch.lvl > maxLvl) {
                    maxLvl = branch.lvl;
                }
                for(let j = 0; j < branch.entries.length; j++) {
                    if(!sillies.includes(branch.entries[j])) {
                        sillies.push(branch.entries[j]);
                    }
                }
                if(index == 0) {
                    (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add("dottedLeft");
                }
                newGrouping.childNodes[3].appendChild(branch.element);
                index++;
            }
        }
        if(index == 1) {
            (newGrouping.childNodes[1] as HTMLDivElement).classList.add("singleton");
            if(adoptedStartIndex == 0) {
                // (newGrouping.children[0].children[1].children[0] as HTMLDivElement).classList.add("dottedRight");
                // (newGrouping.children[0].children[1].children[1] as HTMLDivElement).classList.add("dottedLeft");
                (newGrouping.children[0].children[2] as HTMLDivElement).classList.add("dottedRight");
            }
        } else if(index > adoptedStartIndex) {
            (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add("dottedRight");
        }
        for(let i = 1; i < index - 1; i++) {
            let line = document.createElement("div") as HTMLDivElement;
            line.classList.add("midLine");
            if(i >= adoptedStartIndex) {
                line.classList.add("dottedLeft");
            }
            bottom.appendChild(line);
        }
        return new Branch(maxLvl + 1, newGrouping, sillies);
    }
}

// function createBranchFor(person: Entry, parent: Entry, tree: Tree, requires: Entry): Branch {
//     let treeHasPerson = tree.entries.includes(person);
//     if(!treeHasPerson) {
//         tree.addEntry(person);
//     }
//     let newGrouping = groupTemplate.content.cloneNode(true).firstChild as HTMLDivElement;
//     newGrouping.childNodes[1].childNodes[1].textContent = person.name;
//     if(person.mentees.length + person.adoptedMentees.length == 0) {
//         (newGrouping.childNodes[1] as HTMLDivElement).classList.add("leaf");
//         return new Branch(0, newGrouping, [person]);
//     } else {
//         if((collapseAdopted && person.mentors.length > 0 && person.adopters.includes(parent)) ||
//                 (removeNonFreshmen && treeHasPerson && tree.root != person)) {
//             newGrouping.classList.add("collapsed");
//         }
//         (newGrouping.childNodes[1].childNodes[1] as HTMLDivElement).onclick = (e: MouseEvent) => {
//             onNameClick(newGrouping.childNodes[1].childNodes[1] as HTMLDivElement, person);
//         };
//         let maxLvl = 0;
//         let sillies: Entry[] = [person];
//         let bottom = newGrouping.childNodes[1].childNodes[5];
//         let index = 0;
//         let adoptedStartIndex: number;
//         for(let i = 0; i < person.mentees.length; i++) {
//             let branch = createBranch(person.mentees[i], person, tree, collapseAdopted, removeNonFreshmen);
//             if(!removeNonFreshmen || branch.hasFreshman()) {
//                 if(branch.lvl > maxLvl) {
//                     maxLvl = branch.lvl;
//                 }
//                 for(let j = 0; j < branch.entries.length; j++) {
//                     if(!sillies.includes(branch.entries[j])) {
//                         sillies.push(branch.entries[j]);
//                     }
//                 }
//                 newGrouping.childNodes[3].appendChild(branch.element);
//                 index++;
//             }
//         }
//         adoptedStartIndex = index;
//         for(let i = 0; i < person.adoptedMentees.length; i++) {
//             let branch = createBranch(person.adoptedMentees[i], person, tree, collapseAdopted, removeNonFreshmen);
//             if(!removeNonFreshmen || branch.hasFreshman()) {
//                 if(branch.lvl > maxLvl) {
//                     maxLvl = branch.lvl;
//                 }
//                 for(let j = 0; j < branch.entries.length; j++) {
//                     if(!sillies.includes(branch.entries[j])) {
//                         sillies.push(branch.entries[j]);
//                     }
//                 }
//                 if(index == 0) {
//                     (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add("dottedLeft");
//                 }
//                 newGrouping.childNodes[3].appendChild(branch.element);
//                 index++;
//             }
//         }
//         if(index == 1) {
//             (newGrouping.childNodes[1] as HTMLDivElement).classList.add("singleton");
//             if(adoptedStartIndex == 0) {
//                 // (newGrouping.children[0].children[1].children[0] as HTMLDivElement).classList.add("dottedRight");
//                 // (newGrouping.children[0].children[1].children[1] as HTMLDivElement).classList.add("dottedLeft");
//                 (newGrouping.children[0].children[2] as HTMLDivElement).classList.add("dottedRight");
//             }
//         } else if(index > adoptedStartIndex) {
//             (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add("dottedRight");
//         }
//         for(let i = 1; i < index - 1; i++) {
//             let line = document.createElement("div") as HTMLDivElement;
//             line.classList.add("midLine");
//             if(i >= adoptedStartIndex) {
//                 line.classList.add("dottedLeft");
//             }
//             bottom.appendChild(line);
//         }
//         return new Branch(maxLvl + 1, newGrouping, sillies);
//     }
// }

// function createUpBranch(person: Entry, parent: Entry, tree: Tree): Branch {
//     let newGrouping = groupTemplate.content.cloneNode(true).firstChild as HTMLDivElement;
//     newGrouping.childNodes[1].childNodes[1].textContent = person.name;
//     if(person.mentees.length + person.adoptedMentees.length == 0) {
//         (newGrouping.childNodes[1] as HTMLDivElement).classList.add("leaf");
//         return {lvl: 0, element: newGrouping};
//     } else {
//         if(person.mentors.length > 0 && person.adopters.includes(parent)) {
//             newGrouping.classList.add("collapsed");
//         }
//         (newGrouping.childNodes[1].childNodes[1] as HTMLDivElement).onclick = (e: MouseEvent) => {
//             onNameClick(newGrouping.childNodes[1].childNodes[1] as HTMLDivElement, person);
//         };
//         if(person.mentees.length + person.adoptedMentees.length == 1) {
//             (newGrouping.childNodes[1] as HTMLDivElement).classList.add("singleton");
//         }
//         let maxLvl = 0;
//         let bottom = newGrouping.childNodes[1].childNodes[5];
//         let index = 0;
//         let adoptedStartIndex: number;
//         for(let i = 0; i < person.mentees.length; i++) {
//             let branch = createBranch(person.mentees[i], person, tree);
//             if(branch.lvl > maxLvl) {
//                 maxLvl = branch.lvl;
//             }
//             newGrouping.childNodes[3].appendChild(branch.element);
//             index++;
//         }
//         adoptedStartIndex = index;
//         for(let i = 0; i < person.adoptedMentees.length; i++) {
//             let branch = createBranch(person.adoptedMentees[i], person, tree);
//             if(branch.lvl > maxLvl) {
//                 maxLvl = branch.lvl;
//             }
//             if(index == 0) {
//                 (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add("dottedLeft");
//             } else if(index == person.mentees.length + person.adoptedMentees.length - 1) {
//                 (newGrouping.childNodes[1].childNodes[5] as HTMLDivElement).classList.add("dottedRight");
//             }
//             newGrouping.childNodes[3].appendChild(branch.element);
//             index++;
//         }
//         for(let i = 1; i < index - 1; i++) {
//             let line = document.createElement("div") as HTMLDivElement;
//             line.classList.add("midLine");
//             if(i >= adoptedStartIndex) {
//                 line.classList.add("dottedLeft");
//             }
//             bottom.appendChild(line);
//         }
//         return {lvl: maxLvl + 1, element: newGrouping};
//     }
// }


// all entries should already be added by the time this is run
function setMentees(lines: string[]): void {
    for(let i = lines.length - 1; i > 0; i--) { //does not use first line since it is column names
        let vals = lines[i].split("\t");
        let adopterStrings = vals[5].split(",");
        let mentorStrings = vals[4].split(",");
        let adopters: Entry[] = [];
        for(let j = 0; j < adopterStrings.length; j++) {
            let n = getEntry(adopterStrings[j].trim());
            if(n) {
                adopters.push(n);
            } else if (adopterStrings[j].trim().length > 0) {
                console.log("Entry not found for " + adopterStrings[j].trim());
            }
        }
        let mentors: Entry[] = [];
        for(let j = 0; j < mentorStrings.length; j++) {
            let n = getEntry(mentorStrings[j].trim());
            if(n) {
                mentors.push(n);
            } else if (mentorStrings[j].trim().length > 0) {
                console.log("Entry not found for " + mentorStrings[j].trim());
            }
        }
        let menteeEntry = getEntry(vals[3].trim());
        if(!menteeEntry) {
            console.log("WEE WOO WEE WOO " + vals[3] + " NOT FOUND");
	    console.log(menteeEntry);
	}
        for(let j = 0; j < mentors.length; j++) {
            mentors[j].mentees.push(menteeEntry);
            menteeEntry.mentors.push(mentors[j]);
        }
        for(let j = 0; j < adopters.length; j++) {
            adopters[j].adoptedMentees.push(menteeEntry);
            menteeEntry.adopters.push(adopters[j]);
        }
    }
    console.log(entries);
}

function recalculatePositions(): void {
    let items = document.querySelectorAll(".grouping:not(.collapsed):not(.up) > .branchContainer:not(.leaf)");
    for(let i = items.length - 1; i >= 0; i--) {
        let siblingHori = items[i].parentElement.childNodes[3] as HTMLDivElement;
        if(items[i].classList.contains("singleton")) {
            let bottom1 = siblingHori.childNodes[1].childNodes[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2) - (boxItem.x + boxItem.width / 2)) + "px)";
        } else {
            let bottom1 = siblingHori.childNodes[1].childNodes[1] as HTMLDivElement;
            let bottom2 = siblingHori.childNodes[siblingHori.childNodes.length - 1].childNodes[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let box2 = bottom2.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            (items[i] as HTMLDivElement).style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + "px";
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + "px)";
        }
        for(let j = 2; j < siblingHori.childNodes.length - 1; j++) {
            let line = items[i].childNodes[5].childNodes[j - 2] as HTMLDivElement;
            let box = (siblingHori.childNodes[j].childNodes[1] as HTMLDivElement).getBoundingClientRect();
            let boxLine = line.getBoundingClientRect();
            line.style.transform = "translateX(" + ((box.x + box.width / 2) - (boxLine.x + boxLine.width / 2)) + "px)";
        }
    }

    items = document.querySelectorAll(".grouping.up:not(.collapsed) > .branchContainer:not(.leaf)");
    for(let i = items.length - 1; i >= 0; i--) {
        let siblingHori = items[i].parentElement.children[0] as HTMLDivElement;
        if(items[i].classList.contains("singleton")) {
            let bottom1 = siblingHori.children[0].children[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2) - (boxItem.x + boxItem.width / 2)) + "px)";
        } else {
            let bottom1 = siblingHori.children[0].children[1] as HTMLDivElement;
            let bottom2 = siblingHori.children[siblingHori.children.length - 1].children[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let box2 = bottom2.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            console.log(((box2.x + box2.width / 2) - (box1.x + box1.width / 2)));
            console.log(bottom2);
            (items[i] as HTMLDivElement).style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + "px";
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + "px)";
            console.log(items[i]);
        }
        for(let j = 1; j < siblingHori.children.length - 1; j++) {
            let line = items[i].childNodes[5].childNodes[j - 1] as HTMLDivElement;
            let box = (siblingHori.children[j].childNodes[1] as HTMLDivElement).getBoundingClientRect();
            let boxLine = line.getBoundingClientRect();
            line.style.transform = "translateX(" + ((box.x + box.width / 2) - (boxLine.x + boxLine.width / 2)) + "px)";
        }
    }
}

function recalculatePositionsLocal(top: HTMLDivElement): void {
    let itemsClear = top.querySelectorAll(":scope.grouping > .branchContainer:not(.leaf), :scope .grouping > .branchContainer:not(.leaf)");
    let lines = top.querySelectorAll(":scope .midLine");
    for(let i = 0; i < itemsClear.length; i++) {
        (itemsClear[i] as HTMLDivElement).style.width = "";
        (itemsClear[i] as HTMLDivElement).style.transform = "";
    }
    for(let i = 0; i < lines.length; i++) {
        (lines[i] as HTMLDivElement).style.transform = "";
    }
    let items = top.querySelectorAll(":scope.grouping:not(.collapsed) > .branchContainer:not(.leaf), :scope .grouping:not(.collapsed) > .branchContainer:not(.leaf)"); // this selector needs to include the top scope object itself 
    for(let i = items.length - 1; i >= 0; i--) {
        let siblingHori = items[i].parentElement.childNodes[3] as HTMLDivElement;
        if(items[i].classList.contains("singleton")) {
            let bottom1 = siblingHori.childNodes[1].childNodes[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2) - (boxItem.x + boxItem.width / 2)) + "px)";
        } else if(siblingHori.childNodes.length % 2 == 1) {
            let bottom1 = siblingHori.childNodes[1].childNodes[1] as HTMLDivElement;
            let bottom2 = siblingHori.childNodes[siblingHori.childNodes.length - 1].childNodes[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let box2 = bottom2.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            (items[i] as HTMLDivElement).style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + "px";
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + "px)";
        } else {
            let bottom1 = siblingHori.childNodes[1].childNodes[1] as HTMLDivElement;
            let bottom2 = siblingHori.childNodes[siblingHori.childNodes.length - 1].childNodes[1] as HTMLDivElement;
            let box1 = bottom1.getBoundingClientRect();
            let box2 = bottom2.getBoundingClientRect();
            let boxItem = items[i].getBoundingClientRect();
            (items[i] as HTMLDivElement).style.width = ((box2.x + box2.width / 2) - (box1.x + box1.width / 2)) + "px";
            (items[i] as HTMLDivElement).style.transform = "translateX(" + ((box1.x + box1.width / 2 + box2.x + box2.width / 2) / 2 - (boxItem.x + boxItem.width / 2)) + "px)";
        }
        for(let j = 2; j < siblingHori.childNodes.length - 1; j++) {
            let line = items[i].childNodes[5].childNodes[j - 2] as HTMLDivElement;
            let box = (siblingHori.childNodes[j].childNodes[1] as HTMLDivElement).getBoundingClientRect();
            let boxLine = line.getBoundingClientRect();
            line.style.transform = "translateX(" + ((box.x + box.width / 2) - (boxLine.x + boxLine.width / 2)) + "px)";
        }
    }
}

function clearTree(): void {
    currentTrees.forEach((tree: Tree) => {
        tree.rootBranch.element.remove();
    });
    currentTrees = [];
}

function createTree(): void {
    for(let i = 0; i < entries.length; i++) {
        if(entries[i].mentors.length == 0 && entries[i].adopters.length == 0 && (entries[i].mentees.length > 0 || entries[i].adoptedMentees.length > 0)) {
            let tree = new Tree(entries[i]);
            let newGrouping = createBranch(entries[i], null, tree);
            tree.setRootBranch(newGrouping);
            currentTrees.push(tree);
            document.querySelector("body").appendChild(newGrouping.element);
        }
    }
}

function createTreeFreshmen(): void {
    console.log("SKIBIDI TOILET");
    for(let i = 0; i < entries.length; i++) {
        if(entries[i].mentors.length == 0 && entries[i].adopters.length == 0 && (entries[i].mentees.length > 0 || entries[i].adoptedMentees.length > 0)) {
            console.log("new tree because");
	    console.log(entries[i]);
	    let tree = new Tree(entries[i]);
            let newGrouping = createBranch(entries[i], null, tree, false, true);
            tree.setRootBranch(newGrouping);
            for(let i = 0; i < tree.entries.length; i++) {
                if(tree.entries[i].isFreshman) {
                    currentTrees.push(tree);
                    document.querySelector("body").appendChild(newGrouping.element);
                    break;
                }
            }
        } else {
	    console.log(entries[i]);
	}
    }
}

function createTreeFor(person: Entry): void {
    for(let i = 0; i < entries.length; i++) {
        if(entries[i].mentors.length == 0 && entries[i].adopters.length == 0 && (entries[i].mentees.length > 0 || entries[i].adoptedMentees.length > 0)) {
            let tree = new Tree(entries[i]);
            let newGrouping = createBranch(entries[i], null, tree, false, true);
            tree.setRootBranch(newGrouping);
            for(let i = 0; i < tree.entries.length; i++) {
                if(tree.entries[i].isFreshman) {
                    currentTrees.push(tree);
                    document.querySelector("body").appendChild(newGrouping.element);
                    break;
                }
            }
        }
    }
}

function loadAllEntries(onfinish: () => void) {
    let request = new XMLHttpRequest();
    request.open("GET", tsvURL);
    request.addEventListener("readystatechange", () => {
        if(request.readyState == 4 && request.status == 200) {
            let resp = request.response as string;
            let lines = resp.split("\n");
            for(let i = lines.length - 1; i > 0; i--) { //does not use first line since it is column names
                let vals = lines[i].split("\t");
		if(vals[3].trim() == "") {
		    continue;
		}
                let nickname = vals[2].trim() + " " + vals[0].trim();
                let newEntry = {name: vals[3].trim(), nickname: nickname, mentors: [], adopters: [], mentees: [], adoptedMentees: [], isFreshman: i <= NUM_FRESHMEN} as Entry;
                entries.push(newEntry);
            }
            setMentees(lines);
            onfinish();
        }
    });
    request.send();
}

loadAllEntries(() => {
    const nameSelector = document.querySelector("#nameSelector") as HTMLInputElement;
    nameSelector.oninput = () => {
        let entry = getEntry(nameSelector.value.trim());
        if(entry) {
            (document.querySelector("#showLine") as HTMLDivElement).classList.remove("disabled");
        } else {
            (document.querySelector("#showLine") as HTMLDivElement).classList.add("disabled");
        }
    };

    (document.querySelector("#showAll") as HTMLDivElement).onclick = () => {
        clearTree();
        createTree();
        recalculatePositions();
    };

    (document.querySelector("#showFreshmen") as HTMLDivElement).onclick = () => {
        clearTree();
        createTreeFreshmen();
        recalculatePositions();
    };
});

recalculatePositions();

//@ts-ignore
window.getEntry = getEntry;
