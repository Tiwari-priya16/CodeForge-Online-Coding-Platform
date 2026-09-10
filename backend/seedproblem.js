const path = require('path');

const backendDir =
  'C:/Notes, NEXUS batch_Coderarmy/LeetCode_project/Leetcode_Project/backend';

require(path.join(backendDir, 'node_modules/dotenv')).config({
  path: path.join(backendDir, '.env')
});

const mongoose = require(path.join(backendDir, 'node_modules/mongoose'));

async function seedDatabase() {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log('MongoDB Connected');

    const Problem = require(
      path.join(backendDir, 'src/models/problem')
    );

    const User = require(
      path.join(backendDir, 'src/models/user')
    );

    // Find admin
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.error('❌ Admin user not found.');
      await mongoose.disconnect();
      return;
    }

    console.log('Using Admin ID:', admin._id);

    // ============================================================
    // QUESTION 9 - MERGE TWO SORTED LISTS
    // ============================================================

    const mergeTwoSortedLists = {
      title: 'Merge Two Sorted Lists',

      difficulty: 'easy',

      tags: 'linkedList',

      description: `You are given the heads of two sorted singly linked lists, list1 and list2.

Merge the two lists into one sorted linked list.

The merged list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

### Constraints
- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.`,

      // 3 visible examples
      visibleTestCases: [
        {
          input: 'list1 = [1,2,4], list2 = [1,3,4]',
          output: '[1,1,2,3,4,4]',
          explanation:
            'The two sorted lists are merged in sorted order to form [1,1,2,3,4,4].'
        },
        {
          input: 'list1 = [], list2 = []',
          output: '[]',
          explanation:
            'Both lists are empty, so the merged list is also empty.'
        },
        {
          input: 'list1 = [], list2 = [0]',
          output: '[0]',
          explanation:
            'The first list is empty, so the result is the second list.'
        }
      ],

      // 11 hidden test cases
      // First 3 are same as visible examples
      hiddenTestCases: [
        {
          input: 'list1 = [1,2,4], list2 = [1,3,4]',
          output: '[1,1,2,3,4,4]'
        },
        {
          input: 'list1 = [], list2 = []',
          output: '[]'
        },
        {
          input: 'list1 = [], list2 = [0]',
          output: '[0]'
        },
        {
          input: 'list1 = [1], list2 = [2]',
          output: '[1,2]'
        },
        {
          input: 'list1 = [2,4,6], list2 = [1,3,5]',
          output: '[1,2,3,4,5,6]'
        },
        {
          input: 'list1 = [1,1,1], list2 = [1,1]',
          output: '[1,1,1,1,1]'
        },
        {
          input: 'list1 = [-5,-2,0], list2 = [-3,-1,2]',
          output: '[-5,-3,-2,-1,0,2]'
        },
        {
          input: 'list1 = [1,5,10], list2 = [2,3,7,11]',
          output: '[1,2,3,5,7,10,11]'
        },
        {
          input: 'list1 = [10,20,30], list2 = [5,15,25,35]',
          output: '[5,10,15,20,25,30,35]'
        },
        {
          input: 'list1 = [0,2,4], list2 = [1,3,5]',
          output: '[0,1,2,3,4,5]'
        },
        {
          input: 'list1 = [100], list2 = [1,2,3,4]',
          output: '[1,2,3,4,100]'
        }
      ],

      startCode: [
        {
          language: 'C',
          initialCode: `#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* solve(
    struct ListNode* list1,
    struct ListNode* list2
) {
    return NULL;
}`
        },

        {
          language: 'C++',
          initialCode: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;

    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* solve(ListNode* list1, ListNode* list2) {
        return nullptr;
    }
};`
        },

        {
          language: 'Java',
          initialCode: `class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
    }
}

class Solution {
    public ListNode solve(ListNode list1, ListNode list2) {
        return null;
    }
}`
        },

        {
          language: 'JavaScript',
          initialCode: `function solve(list1, list2) {
    return null;
}`
        },

        {
          language: 'Python',
          initialCode: `class Solution:
    def solve(self, list1, list2):
        pass`
        }
      ],

      referenceSolution: [
        {
          language: 'C',
          completeCode: `#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* solve(
    struct ListNode* list1,
    struct ListNode* list2
) {
    struct ListNode dummy;
    struct ListNode* tail = &dummy;

    dummy.next = NULL;

    while (list1 != NULL && list2 != NULL) {
        if (list1->val <= list2->val) {
            tail->next = list1;
            list1 = list1->next;
        } else {
            tail->next = list2;
            list2 = list2->next;
        }

        tail = tail->next;
    }

    if (list1 != NULL)
        tail->next = list1;
    else
        tail->next = list2;

    return dummy.next;
}`
        },

        {
          language: 'C++',
          completeCode: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;

    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* solve(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;

        while (list1 != nullptr && list2 != nullptr) {
            if (list1->val <= list2->val) {
                tail->next = list1;
                list1 = list1->next;
            } else {
                tail->next = list2;
                list2 = list2->next;
            }

            tail = tail->next;
        }

        if (list1 != nullptr)
            tail->next = list1;
        else
            tail->next = list2;

        return dummy.next;
    }
};`
        },

        {
          language: 'Java',
          completeCode: `class Solution {
    public ListNode solve(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }

            tail = tail.next;
        }

        if (list1 != null)
            tail.next = list1;
        else
            tail.next = list2;

        return dummy.next;
    }
}`
        },

        {
          language: 'JavaScript',
          completeCode: `function solve(list1, list2) {
    const dummy = {
        val: 0,
        next: null
    };

    let tail = dummy;

    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }

        tail = tail.next;
    }

    tail.next = list1 !== null ? list1 : list2;

    return dummy.next;
}`
        },

        {
          language: 'Python',
          completeCode: `class Solution:
    def solve(self, list1, list2):
        dummy = ListNode(0)
        tail = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next

            tail = tail.next

        if list1:
            tail.next = list1
        else:
            tail.next = list2

        return dummy.next`
        }
      ]
    };

    // ============================================================
    // QUESTION 10 - FLOOD FILL
    // ============================================================

    const floodFill = {
      title: 'Flood Fill',

      difficulty: 'easy',

      tags: 'graph',

      description: `An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.

You are also given three integers sr, sc, and color.

Perform a flood fill on the image starting from the pixel image[sr][sc].

To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel that have the same value as the starting pixel, plus any pixels connected 4-directionally to those pixels, and so on.

Replace the color of all of the aforementioned pixels with color.

Return the modified image.

### Constraints
- 1 <= image.length <= 50
- 1 <= image[i].length <= 50
- 0 <= image[i][j], color < 2^16
- 0 <= sr < image.length
- 0 <= sc < image[0].length
- The image and every row of image have the same length.`,

      // 3 visible examples
      visibleTestCases: [
        {
          input:
            'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
          output:
            '[[2,2,2],[2,2,0],[2,0,1]]',
          explanation:
            'Starting from the center pixel, all connected pixels having the original color 1 are changed to 2.'
        },
        {
          input:
            'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0',
          output:
            '[[0,0,0],[0,0,0]]',
          explanation:
            'The starting pixel already has the target color, so the image remains unchanged.'
        },
        {
          input:
            'image = [[1,1,0],[1,0,0],[1,1,1]], sr = 0, sc = 0, color = 3',
          output:
            '[[3,3,0],[3,0,0],[3,3,3]]',
          explanation:
            'All pixels connected to the starting pixel with original color 1 are changed to 3.'
        }
      ],

      // 11 hidden test cases
      // First 3 are same as visible examples
      hiddenTestCases: [
        {
          input:
            'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
          output:
            '[[2,2,2],[2,2,0],[2,0,1]]'
        },
        {
          input:
            'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0',
          output:
            '[[0,0,0],[0,0,0]]'
        },
        {
          input:
            'image = [[1,1,0],[1,0,0],[1,1,1]], sr = 0, sc = 0, color = 3',
          output:
            '[[3,3,0],[3,0,0],[3,3,3]]'
        },
        {
          input:
            'image = [[1]], sr = 0, sc = 0, color = 2',
          output:
            '[[2]]'
        },
        {
          input:
            'image = [[0]], sr = 0, sc = 0, color = 5',
          output:
            '[[5]]'
        },
        {
          input:
            'image = [[1,1],[1,1]], sr = 0, sc = 0, color = 9',
          output:
            '[[9,9],[9,9]]'
        },
        {
          input:
            'image = [[1,2,1],[2,1,2],[1,2,1]], sr = 1, sc = 1, color = 7',
          output:
            '[[1,2,1],[2,7,2],[1,2,1]]'
        },
        {
          input:
            'image = [[1,1,1],[1,0,1],[1,1,1]], sr = 0, sc = 0, color = 4',
          output:
            '[[4,4,4],[4,0,4],[4,4,4]]'
        },
        {
          input:
            'image = [[2,2,2],[2,3,2],[2,2,2]], sr = 1, sc = 1, color = 5',
          output:
            '[[2,2,2],[2,5,2],[2,2,2]]'
        },
        {
          input:
            'image = [[1,1,0,0],[1,0,0,1],[0,0,1,1]], sr = 0, sc = 0, color = 6',
          output:
            '[[6,6,0,0],[6,0,0,1],[0,0,1,1]]'
        },
        {
          input:
            'image = [[3,3,3,3],[3,2,2,3],[3,2,3,3]], sr = 1, sc = 1, color = 8',
          output:
            '[[3,3,3,3],[3,8,8,3],[3,8,3,3]]'
        }
      ],

      startCode: [
        {
          language: 'C',
          initialCode: `#include <stdio.h>

void solve(
    int** image,
    int imageSize,
    int* imageColSize,
    int sr,
    int sc,
    int color
) {
    // Write your solution here
}`
        },

        {
          language: 'C++',
          initialCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> solve(
        vector<vector<int>>& image,
        int sr,
        int sc,
        int color
    ) {
        return image;
    }
};`
        },

        {
          language: 'Java',
          initialCode: `class Solution {
    public int[][] solve(
        int[][] image,
        int sr,
        int sc,
        int color
    ) {
        return image;
    }
}`
        },

        {
          language: 'JavaScript',
          initialCode: `function solve(image, sr, sc, color) {
    return image;
}`
        },

        {
          language: 'Python',
          initialCode: `class Solution:
    def solve(self, image, sr, sc, color):
        return image`
        }
      ],

      referenceSolution: [
        {
          language: 'C',
          completeCode: `#include <stdio.h>

void dfs(
    int** image,
    int rows,
    int cols,
    int r,
    int c,
    int oldColor,
    int newColor
) {
    if (r < 0 || r >= rows ||
        c < 0 || c >= cols ||
        image[r][c] != oldColor) {
        return;
    }

    image[r][c] = newColor;

    dfs(image, rows, cols, r + 1, c, oldColor, newColor);
    dfs(image, rows, cols, r - 1, c, oldColor, newColor);
    dfs(image, rows, cols, r, c + 1, oldColor, newColor);
    dfs(image, rows, cols, r, c - 1, oldColor, newColor);
}

void solve(
    int** image,
    int imageSize,
    int* imageColSize,
    int sr,
    int sc,
    int color
) {
    int oldColor = image[sr][sc];

    if (oldColor == color)
        return;

    dfs(
        image,
        imageSize,
        imageColSize[0],
        sr,
        sc,
        oldColor,
        color
    );
}`
        },

        {
          language: 'C++',
          completeCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
    void dfs(
        vector<vector<int>>& image,
        int r,
        int c,
        int oldColor,
        int newColor
    ) {
        int rows = image.size();
        int cols = image[0].size();

        if (r < 0 || r >= rows ||
            c < 0 || c >= cols ||
            image[r][c] != oldColor) {
            return;
        }

        image[r][c] = newColor;

        dfs(image, r + 1, c, oldColor, newColor);
        dfs(image, r - 1, c, oldColor, newColor);
        dfs(image, r, c + 1, oldColor, newColor);
        dfs(image, r, c - 1, oldColor, newColor);
    }

public:
    vector<vector<int>> solve(
        vector<vector<int>>& image,
        int sr,
        int sc,
        int color
    ) {
        int oldColor = image[sr][sc];

        if (oldColor == color)
            return image;

        dfs(image, sr, sc, oldColor, color);

        return image;
    }
};`
        },

        {
          language: 'Java',
          completeCode: `class Solution {
    private void dfs(
        int[][] image,
        int r,
        int c,
        int oldColor,
        int newColor
    ) {
        if (r < 0 || r >= image.length ||
            c < 0 || c >= image[0].length ||
            image[r][c] != oldColor) {
            return;
        }

        image[r][c] = newColor;

        dfs(image, r + 1, c, oldColor, newColor);
        dfs(image, r - 1, c, oldColor, newColor);
        dfs(image, r, c + 1, oldColor, newColor);
        dfs(image, r, c - 1, oldColor, newColor);
    }

    public int[][] solve(
        int[][] image,
        int sr,
        int sc,
        int color
    ) {
        int oldColor = image[sr][sc];

        if (oldColor == color)
            return image;

        dfs(image, sr, sc, oldColor, color);

        return image;
    }
}`
        },

        {
          language: 'JavaScript',
          completeCode: `function solve(image, sr, sc, color) {
    const oldColor = image[sr][sc];

    if (oldColor === color)
        return image;

    const rows = image.length;
    const cols = image[0].length;

    function dfs(r, c) {
        if (
            r < 0 ||
            r >= rows ||
            c < 0 ||
            c >= cols ||
            image[r][c] !== oldColor
        ) {
            return;
        }

        image[r][c] = color;

        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }

    dfs(sr, sc);

    return image;
}`
        },

        {
          language: 'Python',
          completeCode: `class Solution:
    def solve(self, image, sr, sc, color):
        old_color = image[sr][sc]

        if old_color == color:
            return image

        rows = len(image)
        cols = len(image[0])

        def dfs(r, c):
            if (
                r < 0 or
                r >= rows or
                c < 0 or
                c >= cols or
                image[r][c] != old_color
            ):
                return

            image[r][c] = color

            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        dfs(sr, sc)

        return image`
        }
      ]
    };

    // ============================================================
    // ADD BOTH QUESTIONS SAFELY
    // ============================================================

    const problemsToAdd = [
      mergeTwoSortedLists,
      floodFill
    ];

    for (const problemData of problemsToAdd) {

      // Prevent duplicate question
      const alreadyExists = await Problem.findOne({
        title: problemData.title
      });

      if (alreadyExists) {
        console.log(
          `⚠️ "${problemData.title}" already exists. Skipping.`
        );
        continue;
      }

      const formattedProblem = {
        ...problemData,
        problemCreator: admin._id
      };

      const insertedProblem = await Problem.create(
        formattedProblem
      );

      console.log(
        `✅ Added: ${insertedProblem.title}`
      );
    }

    console.log('\n🎉 Done!');
    console.log('Your existing questions were NOT deleted.');
    console.log('No duplicate will be created if you run this again.');

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Error seeding problems:', error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting MongoDB.');
    }
  }
}

seedDatabase();