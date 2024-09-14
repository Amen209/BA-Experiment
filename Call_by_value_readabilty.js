import { random_array_element, Reaction_Time, text_input_experiment, } from "../../modules/Experimentation/Experimentation.js";
import { BROWSER_EXPERIMENT } from "../../modules/Experimentation/Browser_Output_Writer.js";
import { Alternatives, Freetext } from "../../modules/Automata_Forwarders/Questionnaire_Forwarder.js";
import { set_letters } from "./GraphCreation.js";
import { convert_string_to_html_string } from "../../modules/Utils.js";
import { graphs_repository_not_balanced } from "./repository_with_15_innernodes.js";
let MJ = MathJax;
function graph_dictionary_notBalanced() {
    let result = [];
    for (let g of graphs_repository_not_balanced) {
        result.push(g);
    }
    return result;
}
function highlightOperator(expression, operatorIndex) {
    const operators = ['+', '*', '/'];
    let operatorPositions = [];
    for (let i = 0; i < expression.length; i++) {
        if (operators.includes(expression[i])) {
            operatorPositions.push(i);
        }
    }
    if (operatorIndex < 0 || operatorIndex >= operatorPositions.length) {
        return "Invalid operator index";
    }
    let operatorPosition = operatorPositions[operatorIndex];
    let beforeOperator = expression.slice(0, operatorPosition);
    let operator = expression[operatorPosition];
    let afterOperator = expression.slice(operatorPosition + 1);
    let highlightedOperator = `<span style="color:red;">${operator}</span>`;
    let highlightedExpression = beforeOperator + highlightedOperator + afterOperator;
    return highlightedExpression;
}
function operatorOrderString(expression) {
    let operatorCount = 1;
    let operatorNumbers = [];
    let operators = ["/"];
    function processCharacter(character) {
        if (/[+\-*\/\d\w()]/.test(character)) {
            if (operators.includes(character)) {
                operatorNumbers.push(operatorCount++);
            }
            else {
                operatorNumbers.push(" ");
            }
        }
        else {
            operatorNumbers.push(" ");
        }
    }
    for (let i = 0; i < expression.length; i++) {
        processCharacter(expression.charAt(i));
    }
    let numbersToCheck = [11, 12, 13, 14, 15];
    numbersToCheck.forEach(number => {
        let index = operatorNumbers.indexOf(number);
        if (index > 0 && operatorNumbers[index - 1] === ' ') {
            operatorNumbers.splice(index - 1, 1);
        }
    });
    return operatorNumbers.join("");
}
function highlightNumberAtIndex(inputString, numberToMark) {
    const numberStr = numberToMark.toString();
    const markedNumber = `<span style="color: red;">${numberStr}</span>`;
    return inputString.replace(numberStr, markedNumber);
}
function next_call_by_value_operator(tree, index, isMathjax) {
    let inorder = tree.inorder_list().filter((e) => !e.is_leave());
    let call_by_value_order = tree.call_by_value_order().filter((e) => !e.is_leave());
    if (inorder.length > 15 || call_by_value_order.length > 15) {
        return 0;
    }
    if (isMathjax) {
        let arr = [];
        for (let t of call_by_value_order) {
            arr.push(inorder.indexOf(t) + 1);
        }
        let index_folge = tree.source_code_position();
        const regex = /\[(\d+)\]/g;
        let numbers = [];
        let match;
        while ((match = regex.exec(index_folge)) !== null) {
            numbers.push(Number(match[1]));
        }
        let array = [];
        for (let i = 0; i < inorder.length, i < numbers.length; i++) {
            array.push([inorder[i], numbers[i]]);
        }
        let ar = [];
        for (let t of call_by_value_order) {
            ar.push(findIndexByFirstElement(array, t));
        }
        return findNextNumber(ar, index);
    }
    else {
        let source_node = inorder[index - 1];
        let call_by_value_index = call_by_value_order.indexOf(source_node);
        let result = -1;
        if (call_by_value_index == 14)
            result = 0;
        else {
            result = inorder.indexOf(call_by_value_order[call_by_value_index + 1]) + 1;
        }
        return result;
    }
}
function findNextNumber(numbers, target) {
    const index = numbers.indexOf(target);
    if (index === -1) {
        throw new Error('Die Zahl wurde im Array nicht gefunden.');
    }
    if (index === numbers.length - 1) {
        return 0;
    }
    return numbers[index + 1];
}
function findIndexByFirstElement(arr, element) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === element) {
            return arr[i][1];
        }
    }
    return -1;
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function findIndexByFirstElementInArray(arr, element) {
    return arr.find(item => item[0] === element);
}
function call_by_value_next_operator_distance_from_nodeNum(tree, nodeIndex, isMathJax, distanz) {
    var _a, _b;
    let inOrder = tree.inorder_list().filter(e => !e.is_leave());
    let callByValueOrder = tree.call_by_value_order().filter(e => !e.is_leave());
    if (inOrder.length > 15 || callByValueOrder.length > 15) {
        return 0;
        // throw Error(" filter not worked")
    }
    let sourceMathJax;
    let targetNodeMathJax;
    if (isMathJax) {
        const indexFolge = tree.source_code_position();
        const regex = /\[(\d+)\]/g;
        const numbers = [];
        let match;
        while ((match = regex.exec(indexFolge)) !== null) {
            numbers.push(Number(match[1]));
        }
        const array = inOrder.map((node, i) => [node, numbers[i]]);
        const ar = callByValueOrder.map(t => findIndexByFirstElementInArray(array, t));
        for (let i = 0; i < ar.length; i++) {
            if (ar[i][1] === nodeIndex) {
                sourceMathJax = ar[i][0];
                targetNodeMathJax = i < 13 ? ar[i + 1][0] : null;
            }
        }
    }
    const source = isMathJax ? sourceMathJax : inOrder[nodeIndex - 1];
    const sourceCallByValueIndex = callByValueOrder.indexOf(source);
    const targetNodeCode = callByValueOrder.indexOf(source) < 13 ? callByValueOrder[sourceCallByValueIndex + 1] : null;
    if (!isMathJax && distanz > 3) { //// Randfälle sind ausgeschlossen. wird 0 zurückgeliefert, Distanz wird nicht akzeptiert
        if (tree.findDepth(source) === 1) {
            return 0;
        }
        else if (tree.findDepth(source) > 1 && distanz !== 8) { /// Distanz 8 ist Ausnahme, da es keine Bäume mit diesen Einschränkungen vorhanden sind.
            let source_parent = tree.findParent(source);
            if (source_parent.isNodeInSubtree(targetNodeCode, false) === true) {
                return 0;
            }
        }
    }
    const targetNode = isMathJax ? targetNodeMathJax : targetNodeCode;
    if (source === tree) {
        return 0;
    }
    let result = 0;
    const parent = source ? tree === null || tree === void 0 ? void 0 : tree.findParent(source) : null;
    if (parent !== null && targetNode !== null && !targetNode.is_leave()) {
        if (targetNode === parent) {
            if (source === targetNode.right_math_term()) {
                const leftSideNodes = (source === null || source === void 0 ? void 0 : source.left_math_term()) !== null ? (_a = source === null || source === void 0 ? void 0 : source.left_math_term()) === null || _a === void 0 ? void 0 : _a.inorder_list() : null;
                result = (leftSideNodes === null || leftSideNodes === void 0 ? void 0 : leftSideNodes.length) + 2;
            }
            else if (source === targetNode.left_math_term()) {
                const rightSideNodes = (source === null || source === void 0 ? void 0 : source.right_math_term()) !== null ? (_b = source === null || source === void 0 ? void 0 : source.right_math_term()) === null || _b === void 0 ? void 0 : _b.inorder_list() : null;
                result = (rightSideNodes === null || rightSideNodes === void 0 ? void 0 : rightSideNodes.length) + 2;
            }
        }
        if (targetNode !== parent) {
            const nextValueDepth = parent === null || parent === void 0 ? void 0 : parent.findDepth(targetNode);
            const rightSideSource = source === null || source === void 0 ? void 0 : source.right_math_term();
            const rightSideNodesFromSource = rightSideSource === null || rightSideSource === void 0 ? void 0 : rightSideSource.inorder_list();
            // const targetLeftNodes : BinaryOperatorTree[] = targetNode.left_math_term() != null ? targetNode.left_math_term()?.inorder_list() : null;
            // in our case ist the targetLeftNodes always Literal, that is always with length 1 , we don't need to calculate the length from the (left side node).length from target
            // +3  because of source + parent + literal from the targetLeftNodes
            let i = 0; // i : number of literals to the left of the upper node of the target node
            let parentFromTarget = tree.findParent(targetNode);
            let previousParent = null;
            if (nextValueDepth >= 2) {
                while (parentFromTarget !== null && parentFromTarget !== parent) {
                    if ((parentFromTarget === null || parentFromTarget === void 0 ? void 0 : parentFromTarget.left_math_term()) !== targetNode && (parentFromTarget === null || parentFromTarget === void 0 ? void 0 : parentFromTarget.left_math_term()) !== previousParent) {
                        i++;
                    }
                    previousParent = parentFromTarget;
                    parentFromTarget = tree === null || tree === void 0 ? void 0 : tree.findParent(parentFromTarget);
                }
            }
            result = (rightSideNodesFromSource === null || rightSideNodesFromSource === void 0 ? void 0 : rightSideNodesFromSource.length) + nextValueDepth + 3 + i;
        }
    }
    return result;
}
// let NUMBER_OF_INNER_NODES_IN_CATALAN_GRAPHS = 15;
// let CATALAN_GRAPHS = create_catalan_graphs(NUMBER_OF_INNER_NODES_IN_CATALAN_GRAPHS);
// let graphs:BinaryTree [] = [];
// for (let i of CATALAN_GRAPHS) {
//     // graphs.push(i)
//     graphs.push(i)
// }
let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "TestExperiment",
        seed: "7",
        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string("Please, just do this experiment only, when you have enough time, are concentrated enough, and motivated enough.\n\nPlease, open the browser in fullscreen mode (probably by pressing [F11])."),
            writer.convert_string_to_html_string("In this experiment, you will be asked to manually compute the result of an mathematical term.\n\nDon't worry, the terms are not too complex.")
        ]),
        pre_run_training_instructions: writer.string_page_command(writer.convert_string_to_html_string("You entered the training phase.")),
        pre_run_experiment_instructions: writer.string_page_command(writer.convert_string_to_html_string("You entered the experiment phase.\n\n")),
        finish_pages: [
            writer.string_page_command(writer.convert_string_to_html_string("Almost done. Next, the experiment data will be downloaded. Please, send the " +
                "downloaded file to the experimenter.\n\nAfter sending your email, you can close this window.\n\nMany thanks for participating in the experiment."))
        ],
        post_questionnaire: [
            new Freetext("Name", "What's your name?"),
            new Freetext("Age", "How old are you?"),
            new Alternatives("Status", "What is your current working status?", ["Undergraduate student (BSc not yet finished)", "Graduate student (at least BSc finished)", "PhD student", "Professional software developer", "Teacher", "Other"]),
            new Freetext("Experience", "How many years of working experience in software industry to you have?"),
            new Freetext("LoC", "How many lines of code do you think you write each day on average?"),
        ],
        layout: [
            { variable: "Representation", treatments: ["Code", "Math"] },
            { variable: "Distance", treatments: ["3", "9", "15"] },
        ],
        repetitions: 5,
        // measurement: Reaction_Time(keys(["1", "2", "3", "4", "5", "6", "7", "8" , "9" , "0"])),
        measurement: Reaction_Time(text_input_experiment),
        task_configuration: (t) => {
            // print_create_graph_strings(15 , 14 , graphs )
            let isMathjax = t.treatment_combination[0].value !== "Code";
            let possible_graphs_notBalanced = graph_dictionary_notBalanced();
            let e_not_balanced = random_array_element(possible_graphs_notBalanced);
            let tree_not_balanced = set_letters(e_not_balanced);
            let distanz = Number(t.treatment_combination[1].value);
            let Position = getRandomNumber(0, 14);
            while (true) {
                let aktuelleDistanz = tree_not_balanced !== null ? call_by_value_next_operator_distance_from_nodeNum(tree_not_balanced, Position + 1, isMathjax, distanz) : 0;
                if (aktuelleDistanz === distanz) {
                    break;
                }
                tree_not_balanced = null;
                Position = getRandomNumber(0, 14);
                e_not_balanced = random_array_element(possible_graphs_notBalanced);
                tree_not_balanced = e_not_balanced !== null ? set_letters(e_not_balanced) : null;
            }
            t.do_print_task = () => {
                writer.clear_stage();
                if (t.treatment_combination[0].value === "Code") {
                    let highlighttree = tree_not_balanced.generate_source_code_string();
                    let hilighExpression = highlightOperator(highlighttree, Position);
                    writer.print_html_on_stage(hilighExpression);
                    let numbersOrder = convert_string_to_html_string((operatorOrderString(highlighttree)));
                    writer.print_html_on_stage(highlightNumberAtIndex(numbersOrder, Position + 1));
                }
                else {
                    writer.print_html_on_stage("\\( " + tree_not_balanced.generate_mathjax_code_string(Position + 1) + " \\)");
                    // @ts-ignore
                    MJ.typeset();
                }
            };
            t.expected_answer = "" + next_call_by_value_operator(tree_not_balanced, Position + 1, isMathjax);
            t.do_print_after_task_information = () => {
                let next_task_kind = (t.next_task() != null) ? "The next task is shown as " + t.next_task().treatment_combination[0].value + "." : "";
                writer.clear_stage();
                writer.print_string_on_stage(writer.convert_string_to_html_string("Correct answer : " + t.expected_answer +
                    "\nGiven answer : " + t.given_answer +
                    "\nPlease, take a short break of at least 5 seconds.\n\n" +
                    "Press [Enter] to go on. " + next_task_kind));
            };
        }
    };
};
BROWSER_EXPERIMENT(experiment_configuration_function);
//# sourceMappingURL=Call_by_value_readabilty.js.map