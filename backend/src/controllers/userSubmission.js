const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const normalizeOutput = (str) => {
    if (!str) return '';
    return str.trim().replace(/\s+/g, '').toLowerCase();
};

const prepareExecutableCode = (code, language, tag = 'array') => {
    if (!code) return '';
    const lang = language.toLowerCase();
    const problemTag = (tag || 'array').toLowerCase();

    const hasTargetParam = code.includes('target') || code.includes('amount') || code.includes('Target') || code.includes('int k') || code.includes('int K') || code.includes('k: int') || code.includes('k,') || code.includes('k)');
    const isSingleIntParam = (code.includes('int n') || code.includes('n: int') || code.includes('solve(n)') || code.includes('solve(n:')) && !code.includes('int*') && !code.includes('vector') && !code.includes('int[]') && problemTag !== 'linkedlist';
    const hasReturnSize = code.includes('returnSize');
    const isBoolReturn = code.includes('bool') || code.includes('boolean');
    const isTwoLists = code.includes('list2') || code.includes('l2') || code.includes('head2') || code.includes('ListNode* list2') || code.includes('ListNode list2') || code.includes('struct ListNode* list2');
    const isLinkedListNParam = problemTag === 'linkedlist' && (code.includes('int n') || code.includes('n: int') || code.includes('n,') || code.includes('int n,') || code.includes('n)'));
    const isFloodFill = code.includes('color') || code.includes('sr');

    // C++ Category Drivers
    if (lang === 'c++' || lang === 'cpp') {
        let headers = `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <map>\n#include <set>\n#include <queue>\n#include <stack>\n#include <algorithm>\n#include <sstream>\n#include <cctype>\nusing namespace std;\n\nvoid printAns(int val) { cout << boolalpha << val << endl; }\nvoid printAns(bool val) { cout << boolalpha << val << endl; }\nvoid printAns(const vector<int>& ans) {\n    cout << "[";\n    for (size_t k = 0; k < ans.size(); k++) cout << ans[k] << (k + 1 < ans.size() ? ", " : "");\n    cout << "]" << endl;\n}\nvoid printAns(const vector<vector<int>>& matrix) {\n    cout << "[";\n    for (size_t i = 0; i < matrix.size(); i++) {\n        cout << "[";\n        for (size_t j = 0; j < matrix[i].size(); j++) cout << matrix[i][j] << (j + 1 < matrix[i].size() ? ", " : "");\n        cout << "]" << (i + 1 < matrix.size() ? ", " : "");\n    }\n    cout << "]" << endl;\n}\n\n`;

        if (problemTag === 'linkedlist' && !code.includes('struct ListNode')) {
            headers += `struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(NULL) {} };\n\n`;
        }

        if (!code.includes('int main')) {
            let mainDriver = '';

            if (problemTag === 'linkedlist') {
                let solveCall = 'sol.solve(dummy1.next)';
                if (isTwoLists) solveCall = 'sol.solve(dummy1.next, dummy2.next)';
                else if (isLinkedListNParam) solveCall = 'sol.solve(dummy1.next, nVal)';

                mainDriver = `\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string inputStr; char ch;\n    while (cin.get(ch)) inputStr += ch;\n    vector<vector<int>> lists;\n    int depth = 0;\n    string current;\n    for (char c : inputStr) {\n        if (c == '[') {\n            depth++;\n            if (depth == 1) current = "";\n            else current += c;\n        } else if (c == ']') {\n            depth--;\n            if (depth == 0) {\n                vector<int> nums;\n                stringstream ss(current);\n                string value;\n                while (getline(ss, value, ',')) {\n                    try { nums.push_back(stoi(value)); } catch (...) {}\n                }\n                lists.push_back(nums);\n            } else { current += c; }\n        } else if (depth > 0) { current += c; }\n    }\n    ListNode dummy1(0); ListNode* curr1 = &dummy1;\n    if (lists.size() >= 1) { for (int v : lists[0]) { curr1->next = new ListNode(v); curr1 = curr1->next; } }\n    ListNode dummy2(0); ListNode* curr2 = &dummy2;\n    if (lists.size() >= 2) { for (int v : lists[1]) { curr2->next = new ListNode(v); curr2 = curr2->next; } }\n    int nVal = 1;\n    size_t eqPos = inputStr.find_last_of('=');\n    if (eqPos != string::npos) {\n        try { nVal = stoi(inputStr.substr(eqPos + 1)); } catch (...) {}\n    }\n    Solution sol;\n    ListNode* head = ${solveCall};\n    cout << "[";\n    while (head) {\n        cout << head->val << (head->next ? ", " : "");\n        head = head->next;\n    }\n    cout << "]" << endl;\n    return 0;\n}`;
            } else if (problemTag === 'graph') {
                if (isFloodFill) {
                    mainDriver = `\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string inputStr; char ch;\n    while (cin.get(ch)) inputStr += ch;\n    vector<vector<int>> matrix;\n    vector<int> currentRow;\n    int depth = 0;\n    string numStr;\n    for (size_t i = 0; i < inputStr.length(); i++) {\n        char c = inputStr[i];\n        if (c == '[') {\n            depth++;\n            if (depth == 2) currentRow.clear();\n        } else if (c == ']') {\n            if (depth == 2) { matrix.push_back(currentRow); currentRow.clear(); }\n            depth--;\n        } else if (depth == 2 && (isdigit(c) || (c == '-' && i + 1 < inputStr.length() && isdigit(inputStr[i+1])))) {\n            numStr += c;\n            if (i + 1 >= inputStr.length() || (!isdigit(inputStr[i+1]))) { currentRow.push_back(stoi(numStr)); numStr.clear(); }\n        }\n    }\n    vector<int> allNums;\n    string nStr;\n    for (size_t i = 0; i < inputStr.length(); i++) {\n        char c = inputStr[i];\n        if (isdigit(c) || (c == '-' && i + 1 < inputStr.length() && isdigit(inputStr[i+1]))) {\n            nStr += c;\n            if (i + 1 >= inputStr.length() || !isdigit(inputStr[i+1])) { allNums.push_back(stoi(nStr)); nStr.clear(); }\n        }\n    }\n    Solution sol;\n    int color = allNums.back(); allNums.pop_back();\n    int sc = allNums.back(); allNums.pop_back();\n    int sr = allNums.back(); allNums.pop_back();\n    printAns(sol.solve(matrix, sr, sc, color));\n    return 0;\n}`;
                } else {
                    mainDriver = `\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string inputStr; char ch;\n    while (cin.get(ch)) inputStr += ch;\n    vector<vector<int>> matrix;\n    vector<int> currentRow;\n    int depth = 0;\n    string numStr;\n    for (size_t i = 0; i < inputStr.length(); i++) {\n        char c = inputStr[i];\n        if (c == '[') {\n            depth++;\n            if (depth == 2) currentRow.clear();\n        } else if (c == ']') {\n            if (depth == 2) { matrix.push_back(currentRow); currentRow.clear(); }\n            depth--;\n        } else if (depth == 2 && (isdigit(c) || (c == '-' && i + 1 < inputStr.length() && isdigit(inputStr[i+1])))) {\n            numStr += c;\n            if (i + 1 >= inputStr.length() || (!isdigit(inputStr[i+1]))) { currentRow.push_back(stoi(numStr)); numStr.clear(); }\n        }\n    }\n    Solution sol;\n    vector<vector<char>> charGrid;\n    for (auto& row : matrix) {\n        vector<char> cRow;\n        for (int v : row) cRow.push_back((char)(v + '0'));\n        charGrid.push_back(cRow);\n    }\n    printAns(sol.solve(charGrid));\n    return 0;\n}`;
                }
            } else if (isSingleIntParam) {
                mainDriver = `\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string inputStr; char ch;\n    while (cin.get(ch)) inputStr += ch;\n    vector<int> nums;\n    int i = 0, n = inputStr.length();\n    while (i < n) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && i + 1 < n && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < n && isdigit(inputStr[i])) i++;\n            nums.push_back(stoi(inputStr.substr(start, i - start)));\n        } else { i++; }\n    }\n    Solution sol;\n    int val = nums.empty() ? 0 : nums[0];\n    printAns(sol.solve(val));\n    return 0;\n}`;
            } else if (hasTargetParam) {
                mainDriver = `\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string inputStr; char ch;\n    while (cin.get(ch)) inputStr += ch;\n    vector<int> nums;\n    int i = 0, n = inputStr.length();\n    while (i < n) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && i + 1 < n && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < n && isdigit(inputStr[i])) i++;\n            nums.push_back(stoi(inputStr.substr(start, i - start)));\n        } else { i++; }\n    }\n    int target = 0;\n    if (nums.size() >= 2) {\n        target = nums.back(); nums.pop_back();\n    }\n    Solution sol;\n    printAns(sol.solve(nums, target));\n    return 0;\n}`;
            } else {
                mainDriver = `\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string inputStr; char ch;\n    while (cin.get(ch)) inputStr += ch;\n    vector<int> nums;\n    int i = 0, n = inputStr.length();\n    while (i < n) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && i + 1 < n && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < n && isdigit(inputStr[i])) i++;\n            nums.push_back(stoi(inputStr.substr(start, i - start)));\n        } else { i++; }\n    }\n    Solution sol;\n    printAns(sol.solve(nums));\n    return 0;\n}`;
            }
            return headers + code + mainDriver;
        }
        return headers + code;
    }

    // C Category Drivers
    if (lang === 'c') {
        let headers = `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <ctype.h>\n#include <stdbool.h>\n\n`;

        if (problemTag === 'linkedlist') {
            headers += `struct ListNode {\n    int val;\n    struct ListNode* next;\n};\n\n`;
            code = code.replace(/struct\s+ListNode\s*\{[\s\S]*?\};\s*/g, '');
        }

        if (!code.includes('int main')) {
            let mainDriver = '';

            if (problemTag === 'linkedlist') {
                let solveCall = 'solve(dummy1.next)';
                if (isTwoLists) solveCall = 'solve(dummy1.next, dummy2.next)';
                else if (isLinkedListNParam) solveCall = 'solve(dummy1.next, nVal)';

                mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    int lists[2][5000]; int sizes[2] = {0, 0};\n    int listIdx = 0;\n    char* ptr = inputStr;\n    while ((ptr = strchr(ptr, '[')) != NULL) {\n        if (listIdx >= 2) break;\n        ptr++;\n        char* endPtr = strchr(ptr, ']');\n        if (!endPtr) break;\n        while (ptr < endPtr) {\n            if (isdigit(*ptr) || (*ptr == '-' && isdigit(*(ptr + 1)))) {\n                lists[listIdx][sizes[listIdx]++] = atoi(ptr);\n                if (*ptr == '-') ptr++;\n                while (ptr < endPtr && isdigit(*ptr)) ptr++;\n            } else { ptr++; }\n        }\n        listIdx++;\n        ptr = endPtr + 1;\n    }\n    struct ListNode dummy1; dummy1.next = NULL; struct ListNode* curr1 = &dummy1;\n    for (int i = 0; i < sizes[0]; i++) {\n        struct ListNode* node = malloc(sizeof(struct ListNode)); node->val = lists[0][i]; node->next = NULL;\n        curr1->next = node; curr1 = node;\n    }\n    struct ListNode dummy2; dummy2.next = NULL; struct ListNode* curr2 = &dummy2;\n    for (int i = 0; i < sizes[1]; i++) {\n        struct ListNode* node = malloc(sizeof(struct ListNode)); node->val = lists[1][i]; node->next = NULL;\n        curr2->next = node; curr2 = node;\n    }\n    int nVal = 1;\n    char* nPtr = strstr(inputStr, "n =");\n    if (!nPtr) nPtr = strstr(inputStr, "n=");\n    if (nPtr) nVal = atoi(nPtr + (nPtr[1] == '=' ? 2 : 3));\n    struct ListNode* head = ${solveCall};\n    printf("[");\n    while (head != NULL) {\n        printf("%d", head->val);\n        if (head->next != NULL) printf(", ");\n        head = head->next;\n    }\n    printf("]\\n");\n    return 0;\n}`;
            } else if (problemTag === 'graph') {
                if (isFloodFill) {
                    mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    int matrix[100][100]; int rows = 0, cols = 0, depth = 0, reading = 0;\n    for (int i = 0; i < len; i++) {\n        char c = inputStr[i];\n        if (c == '[') depth++;\n        else if (c == ']') {\n            depth--;\n            if (depth == 1) { if (cols == 0) cols = reading; rows++; reading = 0; }\n        } else if (isdigit(c) || (c == '-' && isdigit(inputStr[i + 1]))) {\n            int sign = 1; if (c == '-') { sign = -1; i++; }\n            int number = 0;\n            while (isdigit(inputStr[i])) { number = number * 10 + (inputStr[i] - '0'); i++; }\n            i--;\n            if (depth == 2) matrix[rows][reading++] = sign * number;\n        }\n    }\n    int nums[1000]; int count = 0;\n    for (int i = 0; i < len; i++) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && isdigit(inputStr[i + 1]))) {\n            int sign = 1; if (inputStr[i] == '-') { sign = -1; i++; }\n            int value = 0;\n            while (isdigit(inputStr[i])) { value = value * 10 + (inputStr[i] - '0'); i++; }\n            nums[count++] = sign * value; i--;\n        }\n    }\n    int* image[100]; for (int i = 0; i < rows; i++) image[i] = matrix[i];\n    int color = nums[count - 1]; int scCol = nums[count - 2]; int sr = nums[count - 3];\n    int* colSizes = malloc(rows * sizeof(int));\n    for (int i = 0; i < rows; i++) colSizes[i] = cols;\n    solve(image, rows, colSizes, sr, scCol, color);\n    printf("[");\n    for (int i = 0; i < rows; i++) {\n        printf("[");\n        for (int j = 0; j < cols; j++) { printf("%d", matrix[i][j]); if (j + 1 < cols) printf(", "); }\n        printf("]"); if (i + 1 < rows) printf(", ");\n    }\n    printf("]\\n");\n    free(colSizes);\n    return 0;\n}`;
                } else {
                    mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    char** grid = (char**)malloc(100 * sizeof(char*));\n    int* colSizes = (int*)malloc(100 * sizeof(int));\n    int rows = 0, currLen = 0;\n    char current[500];\n    for (int i = 0; i < len; i++) {\n        if (inputStr[i] == '1' || inputStr[i] == '0') {\n            current[currLen++] = inputStr[i];\n        } else if (inputStr[i] == ']' && currLen > 0) {\n            grid[rows] = (char*)malloc(currLen * sizeof(char));\n            for (int k = 0; k < currLen; k++) grid[rows][k] = current[k];\n            colSizes[rows] = currLen;\n            rows++; currLen = 0;\n        }\n    }\n    printf("%d\\n", solve(grid, rows, colSizes));\n    return 0;\n}`;
                }
            } else if (isSingleIntParam) {
                mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    int nums[5000], count = 0, i = 0;\n    while (i < len) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < len && isdigit(inputStr[i])) i++;\n            nums[count++] = atoi(&inputStr[start]);\n        } else { i++; }\n    }\n    int n = (count >= 1) ? nums[0] : 0;\n    printf("%d\\n", solve(n));\n    return 0;\n}`;
            } else if (hasReturnSize) {
                mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    int nums[5000], count = 0, i = 0;\n    while (i < len) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < len && isdigit(inputStr[i])) i++;\n            nums[count++] = atoi(&inputStr[start]);\n        } else { i++; }\n    }\n    int target = (count >= 2) ? nums[count - 1] : 0;\n    if (count >= 2) count--;\n    int returnSize = 0;\n    int* ans = solve(nums, count, target, &returnSize);\n    printf("[");\n    if (ans) {\n        for (int k = 0; k < returnSize; k++) printf("%d%s", ans[k], (k + 1 < returnSize) ? ", " : "");\n    }\n    printf("]\\n");\n    return 0;\n}`;
            } else if (hasTargetParam) {
                mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    int nums[5000], count = 0, i = 0;\n    while (i < len) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < len && isdigit(inputStr[i])) i++;\n            nums[count++] = atoi(&inputStr[start]);\n        } else { i++; }\n    }\n    int amount = (count >= 2) ? nums[count - 1] : 0;\n    printf("%d\\n", solve(nums, count - 1, amount));\n    return 0;\n}`;
            } else {
                mainDriver = `\n\nint main() {\n    char inputStr[10000]; int ch, len = 0;\n    while ((ch = getchar()) != EOF && len < 9999) inputStr[len++] = (char)ch;\n    inputStr[len] = '\\0';\n    int nums[5000], count = 0, i = 0;\n    while (i < len) {\n        if (isdigit(inputStr[i]) || (inputStr[i] == '-' && isdigit(inputStr[i+1]))) {\n            int start = i; i++;\n            while (i < len && isdigit(inputStr[i])) i++;\n            nums[count++] = atoi(&inputStr[start]);\n        } else { i++; }\n    }\n    int ans = solve(nums, count);\n    if (${isBoolReturn}) {\n        if (ans == 1) printf("true\\n");\n        else printf("false\\n");\n    } else {\n        printf("%d\\n", ans);\n    }\n    return 0;\n}`;
            }
            return headers + code + mainDriver;
        }
        return headers + code;
    }

    // Java Drivers
    if (lang === 'java') {
        const imports = `import java.util.*;\nimport java.util.regex.*;\n\n`;
        const listNodeDef = code.includes('class ListNode') ? '' : 'class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }\n';

        if (!code.includes('public static void main')) {
            if (problemTag === 'linkedlist') {
                let solveCall = 'sol.solve(dummy1.next)';
                if (isTwoLists) solveCall = 'sol.solve(dummy1.next, dummy2.next)';
                else if (isLinkedListNParam) solveCall = 'sol.solve(dummy1.next, nVal)';

                return `${imports}${listNodeDef}${code}\n\nclass Main {\n    public static void main(String[] args) {\n        try {\n            Scanner sc = new Scanner(System.in);\n            StringBuilder sb = new StringBuilder();\n            while (sc.hasNextLine()) sb.append(sc.nextLine()).append(" ");\n            String text = sb.toString();\n            List<List<Integer>> lists = new ArrayList<>();\n            Matcher matcher = Pattern.compile("\\\\[[^\\\\[\\\\]]*\\\\]").matcher(text);\n            while (matcher.find()) {\n                String part = matcher.group();\n                Matcher nums = Pattern.compile("-?\\\\d+").matcher(part);\n                List<Integer> list = new ArrayList<>();\n                while (nums.find()) list.add(Integer.parseInt(nums.group()));\n                lists.add(list);\n            }\n            ListNode dummy1 = new ListNode(0); ListNode curr1 = dummy1;\n            if (lists.size() >= 1) { for (int v : lists.get(0)) { curr1.next = new ListNode(v); curr1 = curr1.next; } }\n            ListNode dummy2 = new ListNode(0); ListNode curr2 = dummy2;\n            if (lists.size() >= 2) { for (int v : lists.get(1)) { curr2.next = new ListNode(v); curr2 = curr2.next; } }\n            int nVal = 1;\n            Matcher nMatcher = Pattern.compile("n\\\\s*=\\\\s*(-?\\\\d+)").matcher(text);\n            if (nMatcher.find()) nVal = Integer.parseInt(nMatcher.group(1));\n            Solution sol = new Solution();\n            ListNode head = ${solveCall};\n            List<Integer> res = new ArrayList<>();\n            while (head != null) { res.add(head.val); head = head.next; }\n            System.out.println(res);\n        } catch(Exception e) { System.err.println("Execution error: " + e.getMessage()); e.printStackTrace(); System.exit(1); }\n    }\n}`;
            } else if (problemTag === 'graph') {
                if (isFloodFill) {
                    return `${imports}${code}\n\nclass Main {\n    public static void main(String[] args) {\n        try {\n            Scanner scScanner = new Scanner(System.in);\n            StringBuilder sb = new StringBuilder();\n            while (scScanner.hasNextLine()) sb.append(scScanner.nextLine()).append(" ");\n            String text = sb.toString();\n            int start = text.indexOf("[["); int end = text.lastIndexOf("]]");\n            String matrixText = text.substring(start, end + 2);\n            List<List<Integer>> rows = new ArrayList<>();\n            Matcher rowMatcher = Pattern.compile("\\\\[[^\\\\[\\\\]]*\\\\]").matcher(matrixText);\n            while (rowMatcher.find()) {\n                String rowText = rowMatcher.group();\n                Matcher nums = Pattern.compile("-?\\\\d+").matcher(rowText);\n                List<Integer> row = new ArrayList<>();\n                while (nums.find()) row.add(Integer.parseInt(nums.group()));\n                rows.add(row);\n            }\n            int[][] image = new int[rows.size()][];\n            for (int i = 0; i < rows.size(); i++) {\n                image[i] = new int[rows.get(i).size()];\n                for (int j = 0; j < rows.get(i).size(); j++) image[i][j] = rows.get(i).get(j);\n            }\n            Matcher allNums = Pattern.compile("-?\\\\d+").matcher(text);\n            List<Integer> nums = new ArrayList<>();\n            while (allNums.find()) nums.add(Integer.parseInt(allNums.group()));\n            Solution sol = new Solution();\n            int color = nums.get(nums.size() - 1);\n            int scCol = nums.get(nums.size() - 2);\n            int sr = nums.get(nums.size() - 3);\n            System.out.println(Arrays.deepToString(sol.solve(image, sr, scCol, color)));\n        } catch(Exception e) { System.err.println("Execution error: " + e.getMessage()); e.printStackTrace(); System.exit(1); }\n    }\n}`;
                } else {
                    return `${imports}${code}\n\nclass Main {\n    public static void main(String[] args) {\n        try {\n            Scanner scScanner = new Scanner(System.in);\n            StringBuilder sb = new StringBuilder();\n            while (scScanner.hasNextLine()) sb.append(scScanner.nextLine()).append(" ");\n            String text = sb.toString();\n            int start = text.indexOf("[["); int end = text.lastIndexOf("]]");\n            String matrixText = text.substring(start, end + 2);\n            List<List<Integer>> rows = new ArrayList<>();\n            Matcher rowMatcher = Pattern.compile("\\\\[[^\\\\[\\\\]]*\\\\]").matcher(matrixText);\n            while (rowMatcher.find()) {\n                String rowText = rowMatcher.group();\n                Matcher nums = Pattern.compile("-?\\\\d+").matcher(rowText);\n                List<Integer> row = new ArrayList<>();\n                while (nums.find()) row.add(Integer.parseInt(nums.group()));\n                rows.add(row);\n            }\n            int[][] image = new int[rows.size()][];\n            for (int i = 0; i < rows.size(); i++) {\n                image[i] = new int[rows.get(i).size()];\n                for (int j = 0; j < rows.get(i).size(); j++) image[i][j] = rows.get(i).get(j);\n            }\n            char[][] grid = new char[image.length][];\n            for (int i = 0; i < image.length; i++) {\n                grid[i] = new char[image[i].length];\n                for (int j = 0; j < image[i].length; j++) grid[i][j] = (char) ('0' + image[i][j]);\n            }\n            Solution sol = new Solution();\n            System.out.println(sol.solve(grid));\n        } catch(Exception e) { System.err.println("Execution error: " + e.getMessage()); e.printStackTrace(); System.exit(1); }\n    }\n}`;
                }
            } else if (isSingleIntParam) {
                return `${imports}${code}\n\nclass Main {\n    public static void main(String[] args) {\n        try {\n            Scanner sc = new Scanner(System.in);\n            StringBuilder sb = new StringBuilder();\n            while (sc.hasNextLine()) sb.append(sc.nextLine() + " ");\n            Matcher matcher = Pattern.compile("-?\\\\d+").matcher(sb.toString());\n            int n = matcher.find() ? Integer.parseInt(matcher.group()) : 0;\n            Solution sol = new Solution();\n            System.out.println(sol.solve(n));\n        } catch(Exception e) { System.err.println("Execution error: " + e.getMessage()); e.printStackTrace(); System.exit(1); }\n    }\n}`;
            } else if (hasTargetParam) {
                return `${imports}${code}\n\nclass Main {\n    public static void main(String[] args) {\n        try {\n            Scanner sc = new Scanner(System.in);\n            StringBuilder sb = new StringBuilder();\n            while (sc.hasNextLine()) sb.append(sc.nextLine()).append(" ");\n            Matcher matcher = Pattern.compile("-?\\\\d+").matcher(sb.toString());\n            List<Integer> values = new ArrayList<>();\n            while (matcher.find()) values.add(Integer.parseInt(matcher.group()));\n            int target = values.remove(values.size() - 1);\n            int[] nums = new int[values.size()];\n            for (int i = 0; i < values.size(); i++) nums[i] = values.get(i);\n            Solution sol = new Solution();\n            Object ans = sol.solve(nums, target);\n            if (ans instanceof int[]) System.out.println(Arrays.toString((int[]) ans));\n            else System.out.println(ans);\n        } catch(Exception e) { System.err.println("Execution error: " + e.getMessage()); e.printStackTrace(); System.exit(1); }\n    }\n}`;
            } else {
                return `${imports}${code}\n\nclass Main {\n    public static void main(String[] args) {\n        try {\n            Scanner sc = new Scanner(System.in);\n            StringBuilder sb = new StringBuilder();\n            while (sc.hasNextLine()) sb.append(sc.nextLine()).append(" ");\n            Matcher matcher = Pattern.compile("-?\\\\d+").matcher(sb.toString());\n            List<Integer> values = new ArrayList<>();\n            while (matcher.find()) values.add(Integer.parseInt(matcher.group()));\n            int[] nums = new int[values.size()];\n            for (int i = 0; i < values.size(); i++) nums[i] = values.get(i);\n            Solution sol = new Solution();\n            Object ans = sol.solve(nums);\n            if (ans instanceof int[]) System.out.println(Arrays.toString((int[]) ans));\n            else System.out.println(ans);\n        } catch(Exception e) { System.err.println("Execution error: " + e.getMessage()); e.printStackTrace(); System.exit(1); }\n    }\n}`;
            }
        }
        return imports + code;
    }

    // Python Drivers
    if (lang === 'python') {
        const pyHeaders = `from typing import List, Dict, Set, Optional\n\n`;
        const cleanCode = code.replace(/list\[/g, 'List[');

        if (!code.includes('if __name__')) {
            if (problemTag === 'linkedlist') {
                let solveCall = 'sol.solve(dummy1.next)';
                if (isTwoLists) solveCall = 'sol.solve(dummy1.next, dummy2.next)';
                else if (isLinkedListNParam) solveCall = 'sol.solve(dummy1.next, n_val)';

                return `${pyHeaders}${cleanCode}\n\nif __name__ == '__main__':\n    import sys, re\n    if 'ListNode' not in globals():\n        class ListNode:\n            def __init__(self, val=0, next=None):\n                self.val = val\n                self.next = next\n    try:\n        text = sys.stdin.read()\n        matches = re.findall(r"\\[[^\\[\\]]*\\]", text)\n        lists = [[int(x) for x in re.findall(r"-?\\d+", part)] for part in matches]\n        dummy1 = ListNode(0); curr1 = dummy1\n        for v in (lists[0] if len(lists) >= 1 else []): curr1.next = ListNode(v); curr1 = curr1.next\n        dummy2 = ListNode(0); curr2 = dummy2\n        for v in (lists[1] if len(lists) >= 2 else []): curr2.next = ListNode(v); curr2 = curr2.next\n        n_match = re.search(r'n\\s*=\\s*(-?\\d+)', text)\n        n_val = int(n_match.group(1)) if n_match else 1\n        sol = Solution()\n        head = ${solveCall}\n        res = []\n        while head: res.append(head.val); head = head.next\n        print(res)\n    except Exception as e:\n        sys.stderr.write(f"Runtime Error: {e}\\n")\n        sys.exit(1)\n`;
            } else if (problemTag === 'graph') {
                if (isFloodFill) {
                    return `${pyHeaders}${cleanCode}\n\nif __name__ == '__main__':\n    import sys, json, re\n    try:\n        text = sys.stdin.read().strip()\n        start = text.find("[["); end = text.rfind("]]")\n        image = json.loads(text[start:end+2]) if (start != -1 and end != -1) else []\n        numbers = [int(x) for x in re.findall(r"-?\\d+", text)]\n        sol = Solution()\n        color = numbers.pop()\n        sc = numbers.pop()\n        sr = numbers.pop()\n        print(sol.solve(image, sr, sc, color))\n    except Exception as e:\n        sys.stderr.write(f"Runtime Error: {e}\\n")\n        sys.exit(1)\n`;
                } else {
                    return `${pyHeaders}${cleanCode}\n\nif __name__ == '__main__':\n    import sys, json, re\n    try:\n        text = sys.stdin.read().strip()\n        start = text.find("[["); end = text.rfind("]]")\n        image = json.loads(text[start:end+2]) if (start != -1 and end != -1) else []\n        sol = Solution()\n        ans = sol.solve(image)\n        print(str(ans).lower() if isinstance(ans, bool) else ans)\n    except Exception as e:\n        sys.stderr.write(f"Runtime Error: {e}\\n")\n        sys.exit(1)\n`;
                }
            } else if (isSingleIntParam) {
                return `${pyHeaders}${cleanCode}\n\nif __name__ == '__main__':\n    import sys, re\n    try:\n        text = sys.stdin.read()\n        vals = [int(x) for x in re.findall(r'-?\\d+', text)]\n        sol = Solution()\n        ans = sol.solve(vals[0] if vals else 0)\n        print(str(ans).lower() if isinstance(ans, bool) else ans)\n    except Exception as e:\n        sys.stderr.write(f"Runtime Error: {e}\\n")\n        sys.exit(1)\n`;
            } else if (hasTargetParam) {
                return `${pyHeaders}${cleanCode}\n\nif __name__ == '__main__':\n    import sys, re\n    try:\n        text = sys.stdin.read()\n        vals = [int(x) for x in re.findall(r'-?\\d+', text)]\n        target = vals.pop() if len(vals) >= 2 else 0\n        sol = Solution()\n        ans = sol.solve(vals, target)\n        print(str(ans).lower() if isinstance(ans, bool) else ans)\n    except Exception as e:\n        sys.stderr.write(f"Runtime Error: {e}\\n")\n        sys.exit(1)\n`;
            } else {
                return `${pyHeaders}${cleanCode}\n\nif __name__ == '__main__':\n    import sys, re\n    try:\n        text = sys.stdin.read()\n        vals = [int(x) for x in re.findall(r'-?\\d+', text)]\n        sol = Solution()\n        ans = sol.solve(vals)\n        print(str(ans).lower() if isinstance(ans, bool) else ans)\n    except Exception as e:\n        sys.stderr.write(f"Runtime Error: {e}\\n")\n        sys.exit(1)\n`;
            }
        }
        return pyHeaders + cleanCode;
    }

    // JavaScript Drivers
    if (lang === 'javascript') {
        if (!code.includes('console.log')) {
            if (problemTag === 'linkedlist') {
                let solveCall = 'solve(dummy1.next)';
                if (isTwoLists) solveCall = 'solve(dummy1.next, dummy2.next)';
                else if (isLinkedListNParam) solveCall = 'solve(dummy1.next, nVal)';

                return `${code}\n\ntry {\n  if (typeof ListNode === 'undefined') {\n    function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }\n  }\n  const fs = require('fs');\n  const text = fs.readFileSync(0, 'utf-8');\n  const matches = text.match(/\\[[^\\[\\]]*\\]/g) || [];\n  const lists = matches.map(function(part) { var m = part.match(/-?\\d+/g); return m ? m.map(Number) : []; });\n  const list1 = lists[0] || [];\n  const list2 = lists[1] || [];\n  let dummy1 = new ListNode(0); let curr1 = dummy1;\n  for (let i = 0; i < list1.length; i++) { curr1.next = new ListNode(list1[i]); curr1 = curr1.next; }\n  let dummy2 = new ListNode(0); let curr2 = dummy2;\n  for (let i = 0; i < list2.length; i++) { curr2.next = new ListNode(list2[i]); curr2 = curr2.next; }\n  const nMatch = text.match(/n\\s*=\\s*(-?\\d+)/);\n  const nVal = nMatch ? Number(nMatch[1]) : 1;\n  let head = ${solveCall};\n  let res = [];\n  while (head) { res.push(head.val); head = head.next; }\n  console.log(JSON.stringify(res));\n} catch(e) {\n  console.error("Runtime Error: " + (e.stack || e.message || e));\n  process.exit(1);\n}`;
            } else if (problemTag === 'graph') {
                const isFloodFill = code.includes('sr') || code.includes('color');
                return `${code}\n\ntry {\n  const fs = require('fs');\n  const text = fs.readFileSync(0, 'utf-8').trim();\n  const start = text.indexOf("[[");\n  const end = text.lastIndexOf("]]");\n  let image = [];\n  if (start !== -1 && end !== -1) { image = JSON.parse(text.substring(start, end + 2)); }\n  const matchRes = text.match(/-?\\d+/g);\n  const numbers = matchRes ? matchRes.map(Number) : [];\n  let ans = null;\n  if (${isFloodFill} && numbers.length >= 3) {\n    const color = numbers.pop();\n    const sc = numbers.pop();\n    const sr = numbers.pop();\n    ans = solve(image, sr, sc, color);\n  } else {\n    ans = solve(image);\n  }\n  console.log(JSON.stringify(ans));\n} catch(e) {\n  console.error("Runtime Error: " + (e.stack || e.message || e));\n  process.exit(1);\n}`;
            } else if (isSingleIntParam) {
                return `${code}\n\ntry {\n  const fs = require('fs');\n  const text = fs.readFileSync(0, 'utf-8');\n  const matchRes = text.match(/-?\\d+/g);\n  const vals = matchRes ? matchRes.map(Number) : [];\n  console.log(JSON.stringify(solve(vals[0] || 0)));\n} catch(e) {\n  console.error("Runtime Error: " + (e.stack || e.message || e));\n  process.exit(1);\n}`;
            } else if (hasTargetParam) {
                return `${code}\n\ntry {\n  const fs = require('fs');\n  const text = fs.readFileSync(0, 'utf-8');\n  const matchRes = text.match(/-?\\d+/g);\n  const vals = matchRes ? matchRes.map(Number) : [];\n  const target = vals.length >= 2 ? vals.pop() : 0;\n  console.log(JSON.stringify(solve(vals, target)));\n} catch(e) {\n  console.error("Runtime Error: " + (e.stack || e.message || e));\n  process.exit(1);\n}`;
            } else {
                return `${code}\n\ntry {\n  const fs = require('fs');\n  const text = fs.readFileSync(0, 'utf-8');\n  const matchRes = text.match(/-?\\d+/g);\n  const vals = matchRes ? matchRes.map(Number) : [];\n  console.log(JSON.stringify(solve(vals)));\n} catch(e) {\n  console.error("Runtime Error: " + (e.stack || e.message || e));\n  process.exit(1);\n}`;
            }
        }
    }

    return code;
};

const submitCode = async (req,res)=>{
    try{
       const userId = req.result._id;
       const problemId = req.params.id;

       let {code,language} = req.body;

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");


      if(language==='cpp')
        language='c++'

    // Fetch the problem from database
       const problem = await Problem.findById(problemId);
       if (!problem) return res.status(404).send("Problem not found");

    // Create Submission record in DB
    const submittedResult = await Submission.create({
          userId,
          problemId,
          code,
          language,
          status:'pending',
          testCasesTotal: problem.hiddenTestCases.length
     });

    const languageId = getLanguageById(language);
    const executableCode = prepareExecutableCode(code, language, problem.tags);

    const submissions = problem.hiddenTestCases.map((testcase)=>({
        source_code: executableCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));


    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value)=> value.token);

    const testResult = await submitToken(resultToken);

    // submittedResult update
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;
    let failedTestCase = null;

    for(let i = 0; i < testResult.length; i++){
        const test = testResult[i];
        const isAccepted = test.status_id === 3 ||
          (normalizeOutput(test.stdout) === normalizeOutput(test.expected_output) && test.status_id !== 5 && test.status_id !== 6 && test.status_id !== 11);

        if(isAccepted){
           test.status_id = 3; // Normalize as Accepted!
           testCasesPassed++;
           runtime += parseFloat(test.time || 0);
           memory = Math.max(memory, test.memory || 0);
        } else {
           if (!failedTestCase) {
              failedTestCase = {
                 input: problem.hiddenTestCases[i]?.input || '',
                 output: problem.hiddenTestCases[i]?.output || '',
                 actualOutput: test.stdout || test.stderr || 'No output'
              };
           }
           if (test.status_id === 5) {
              status = 'wrong';
              errorMessage = test.stderr || test.compile_output || 'Time Limit Exceeded';
           } else {
              status = (test.status_id === 4) ? 'wrong' : 'error';
              errorMessage = test.stderr || test.compile_output || test.message || 'Wrong Answer';
           }
        }
    }

    if (testCasesPassed < problem.hiddenTestCases.length && status === 'accepted') {
        status = 'wrong';
    }

    // Store the result in Database in Submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage || '';
    submittedResult.runtime = parseFloat(runtime.toFixed(3));
    submittedResult.memory = memory;

    await submittedResult.save();

    if (status === 'accepted') {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { problemSolved: problemId }
      });
    }

    const accepted = (status === 'accepted');
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime: submittedResult.runtime,
      memory: submittedResult.memory,
      error: errorMessage,
      failedTestCase
    });

    }
    catch(err){
      console.error("Submit code error:", err);
      res.status(500).send("Internal Server Error " + err.message);
    }
}


const runCode = async(req,res)=>{
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

      let {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

      const problem = await Problem.findById(problemId);
      if (!problem) return res.status(404).send("Problem not found");

      if(language==='cpp')
        language='c++'

      const languageId = getLanguageById(language);
      const executableCode = prepareExecutableCode(code, language, problem.tags);

      const submissions = problem.visibleTestCases.map((testcase)=>({
          source_code: executableCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value)=> value.token);
      const testResult = await submitToken(resultToken);

      let testCasesPassed = 0;
      let runtime = 0;
      let memory = 0;
      let status = true;
      let failedTestCase = null;

      for(let i = 0; i < testResult.length; i++){
          const test = testResult[i];
          const isAccepted = test.status_id === 3 ||
            (normalizeOutput(test.stdout) === normalizeOutput(test.expected_output) && test.status_id !== 5 && test.status_id !== 6 && test.status_id !== 11);

          if(isAccepted){
             test.status_id = 3;
             testCasesPassed++;
             runtime += parseFloat(test.time || 0);
             memory = Math.max(memory, test.memory || 0);
          } else {
            status = false;
            if (!failedTestCase) {
              failedTestCase = {
                input: problem.visibleTestCases[i]?.input || '',
                output: problem.visibleTestCases[i]?.output || '',
                actualOutput: test.stdout || test.stderr || 'No output'
              };
            }
          }
      }

      res.status(201).json({
        success: status,
        testCases: testResult,
        runtime: parseFloat(runtime.toFixed(3)),
        memory,
        failedTestCase
      });
   }
   catch(err){
     console.error("Run code error:", err);
     res.status(500).send("Internal Server Error " + err.message);
   }
}

module.exports = {submitCode,runCode,prepareExecutableCode};
