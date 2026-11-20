# Python Syntax Cheat Sheet (for problem solving)

A quick reference to keep open while you solve problems. Written for Python 3.10+; names like `items`, `nums` or `d` stand for your own data.
Lines starting with `# ->` show the result.

**Contents:** 1. Basics · 2. Conditions · 3. Loops · 4. Lists · 5. Tuples · 6. Dictionaries ·
7. Sets · 8. Strings · 9. Comprehensions · 10. Functions & lambdas · 11. Handy built-ins ·
12. `collections` & friends · 13. Stacks, queues, heaps · 14. Classes · 15. Errors ·
16. Problem-solving patterns · 17. Big-O · 18. Common mistakes

---

## 1. Basics

```python
x = 5                 # int
y = 3.14              # float
name = "Ana"          # str
ok = True             # bool (True / False, capitalized)
nothing = None        # "no value"

a, b = 1, 2           # multiple assignment
a, b = b, a           # swap  -> a=2, b=1
x += 1                # also -=  *=  /=  //=  %=  **=

# Arithmetic
7 / 2    # -> 3.5   true division (always float)
7 // 2   # -> 3     floor division
7 % 2    # -> 1     remainder (modulo)  — "is even?":  n % 2 == 0
2 ** 10  # -> 1024  power
abs(-3), round(3.567, 2), max(1, 5), min(1, 5)   # -> 3, 3.57, 5, 1

# Type conversion
int("42"), float("3.5"), str(42), bool(0), list("abc")
# -> 42, 3.5, '42', False, ['a', 'b', 'c']
type(x)              # -> <class 'int'>
isinstance(x, int)   # -> True

# Input / output
s = input("Enter: ")                     # always returns a str
n = int(input())                         # read one integer
nums = list(map(int, input().split()))   # read "1 2 3" -> [1, 2, 3]
print("a", "b", sep="-", end="!\n")      # -> a-b!
print(f"{name} is {x} years old")        # f-string
print(f"{y:.2f}")                        # -> 3.14   (2 decimals)

# Infinity (handy for min/max tracking)
best = float("inf")      # or -float("inf")
```

---

## 2. Conditions

```python
if x > 10:
    print("big")
elif x > 5:
    print("medium")
else:
    print("small")

# Comparison:  ==  !=  <  <=  >  >=
# Logic:       and  or  not
# Chained:     0 <= x < 10
# Membership:  x in items      x not in items
# Identity:    x is None       x is not None   (use `is` only for None)

# One-line (ternary)
label = "even" if x % 2 == 0 else "odd"

# Truthiness — these are all False:  0, 0.0, "", [], {}, set(), None
if items:            # "if the list is not empty"
    ...
if not name:         # "if the string is empty"
    ...

# any / all
any(n < 0 for n in nums)     # True if at least one is negative
all(n > 0 for n in nums)     # True if every one is positive

# match (Python 3.10+) — like switch
match command:
    case "start":
        ...
    case "stop" | "quit":
        ...
    case _:              # default
        ...
```

---

## 3. Loops

```python
# for over a range of numbers
for i in range(5):           # 0 1 2 3 4
for i in range(2, 6):        # 2 3 4 5         (start, stop)  stop is NOT included
for i in range(0, 10, 2):    # 0 2 4 6 8       (start, stop, step)
for i in range(5, 0, -1):    # 5 4 3 2 1       counting down

# for over a collection
for item in items:
    print(item)

# index AND value
for i, item in enumerate(items):          # i = 0, 1, 2 ...
for i, item in enumerate(items, start=1): # i = 1, 2, 3 ...

# two lists side by side
for name, score in zip(names, scores):
    print(name, score)

# dictionary
for key in d:                    # keys
for value in d.values():         # values
for key, value in d.items():     # both

# reversed / sorted without changing the original
for x in reversed(items): ...
for x in sorted(items): ...

# nested loops (grid / matrix)
for r in range(rows):
    for c in range(cols):
        cell = grid[r][c]

# while
n = 10
while n > 0:
    n -= 1

# loop control
for x in items:
    if x == 0:
        continue     # skip to next iteration
    if x < 0:
        break        # leave the loop
else:
    print("ran without break")   # for/while ... else: runs only if no break

# infinite loop with exit
while True:
    line = input()
    if line == "q":
        break
```

---

## 4. Lists  `[ ]` — ordered, changeable, allows duplicates

```python
nums = [3, 1, 4, 1, 5]
empty = []
zeros = [0] * 5                    # -> [0, 0, 0, 0, 0]
grid = [[0] * 3 for _ in range(2)] # 2 rows x 3 cols  (NOT [[0]*3]*2 — see §18)

# Access
nums[0]      # -> 3    first
nums[-1]     # -> 5    last
nums[-2]     # -> 1    second to last
len(nums)    # -> 5

# Slicing   list[start:stop:step]   (stop not included)
nums[1:3]    # -> [1, 4]
nums[:2]     # -> [3, 1]          first 2
nums[2:]     # -> [4, 1, 5]       from index 2
nums[-2:]    # -> [1, 5]          last 2
nums[::-1]   # -> [5, 1, 4, 1, 3] reversed copy
nums[:]      # shallow copy

# Add
nums.append(9)          # add to end
nums.insert(0, 7)       # insert at index 0
nums.extend([2, 6])     # add many  (same as nums += [2, 6])

# Remove
nums.pop()              # remove + return last
nums.pop(0)             # remove + return index 0
nums.remove(1)          # remove first value 1 (ValueError if missing)
del nums[0]             # delete by index
nums.clear()            # empty it

# Search
nums = [3, 1, 4, 1, 5]
4 in nums               # -> True
nums.index(4)           # -> 2   (ValueError if missing)
nums.count(1)           # -> 2

# Sort / reverse
nums.sort()                     # in place, returns None
nums.sort(reverse=True)         # descending
new = sorted(nums)              # returns a NEW list
words = ["pear", "fig", "apple"]
words.sort(key=len)                         # by length -> ['fig', 'pear', 'apple']
pairs = [("b", 2), ("a", 3)]
pairs.sort(key=lambda p: p[1])              # by 2nd element
pairs.sort(key=lambda p: (-p[1], p[0]))     # desc by number, then asc by letter
nums.reverse()                  # in place

# Aggregate
sum(nums), max(nums), min(nums)

# Unpacking
first, *rest = [1, 2, 3]        # first=1, rest=[2, 3]
*init, last = [1, 2, 3]         # init=[1, 2], last=3

# Join list of strings
" ".join(["a", "b", "c"])       # -> 'a b c'
```

---

## 5. Tuples  `( )` — ordered, NOT changeable

```python
point = (3, 4)
single = (5,)            # trailing comma needed for 1 item
x, y = point             # unpacking
point[0]                 # -> 3
# point[0] = 9           # TypeError — tuples are immutable

# Use tuples as dict keys / set items (lists can't be)
visited = {(0, 0), (0, 1)}

# Return several values from a function
def min_max(a):
    return min(a), max(a)
lo, hi = min_max([3, 1, 4])
```

---

## 6. Dictionaries  `{key: value}` — fast lookup by key

```python
ages = {"ana": 25, "bo": 30}
empty = {}

# Read
ages["ana"]              # -> 25   (KeyError if missing!)
ages.get("cy")           # -> None (safe)
ages.get("cy", 0)        # -> 0    (safe with default)
"ana" in ages            # -> True (checks KEYS)

# Write
ages["cy"] = 22          # add or overwrite
ages.update({"di": 40})  # add many
ages.setdefault("ed", 0) # set only if missing, returns value

# Remove
ages.pop("bo")           # remove + return value
ages.pop("zz", None)     # no error if missing
del ages["cy"]

# Views
list(ages.keys()), list(ages.values()), list(ages.items())

# Counting pattern (VERY common)
counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
# -> {'b': 1, 'a': 3, 'n': 2}

# Grouping pattern
groups = {}
for word in ["apple", "avocado", "banana"]:
    groups.setdefault(word[0], []).append(word)
# -> {'a': ['apple', 'avocado'], 'b': ['banana']}

# Sort a dict by value
sorted(counts.items(), key=lambda kv: kv[1], reverse=True)
# -> [('a', 3), ('n', 2), ('b', 1)]
max(counts, key=counts.get)          # key with biggest value -> 'a'

# Merge (3.9+)
merged = {"a": 1} | {"b": 2}         # -> {'a': 1, 'b': 2}

# Build from two lists
dict(zip(["a", "b"], [1, 2]))        # -> {'a': 1, 'b': 2}
```

---

## 7. Sets  `{ }` — unique items, no order, fast `in`

```python
s = {1, 2, 3}
empty = set()            # NOT {}  ({} is an empty dict)
unique = set([1, 1, 2])  # -> {1, 2}   remove duplicates

s.add(4)
s.remove(4)              # KeyError if missing
s.discard(99)            # no error if missing
3 in s                   # -> True   (O(1) — much faster than a list)

a, b = {1, 2, 3}, {2, 3, 4}
a | b    # union         -> {1, 2, 3, 4}
a & b    # intersection  -> {2, 3}
a - b    # difference    -> {1}
a ^ b    # in one only   -> {1, 4}
a <= b   # is subset?    -> False

# Remove duplicates but keep order
list(dict.fromkeys([3, 1, 3, 2]))    # -> [3, 1, 2]
```

---

## 8. Strings  `" "` — immutable sequence of characters

```python
s = "Hello, World"
s[0], s[-1], s[0:5], s[::-1]   # -> 'H', 'd', 'Hello', 'dlroW ,olleH'
len(s)                         # -> 12

s.lower(), s.upper(), s.title()
s.strip()            # trim whitespace both ends (lstrip / rstrip)
s.split(", ")        # -> ['Hello', 'World']
s.split()            # split on any whitespace
s.replace("l", "L")  # -> 'HeLLo, WorLd'
s.find("o")          # -> 4   (-1 if missing)
s.count("l")         # -> 3
s.startswith("He"), s.endswith("ld")
"lo" in s            # -> True

# Character checks
"abc".isalpha(), "123".isdigit(), "a1".isalnum(), " ".isspace(), "A".isupper()

# Characters <-> numbers
ord("a")    # -> 97
chr(97)     # -> 'a'
ord(ch) - ord("a")   # letter position 0..25

# Build strings efficiently: collect pieces, then join once
parts = []
for i in range(3):
    parts.append(str(i))
"".join(parts)       # -> '012'

# Palindrome check
w = "racecar"
w == w[::-1]         # -> True

# f-string formatting
n, pi = 7, 3.14159
f"{n:03d}"      # -> '007'   zero-padded
f"{pi:.2f}"     # -> '3.14'
f"{1234567:,}"  # -> '1,234,567'
f"{'hi':>5}"    # -> '   hi'  right-align in width 5
f"{n=}"         # -> 'n=7'   (debug print)
```

---

## 9. Comprehensions — build a collection in one line

**Formula:** `[ EXPRESSION  for ITEM in ITERABLE  if CONDITION ]`
Read it as: "give me EXPRESSION, for each ITEM in ITERABLE, only if CONDITION".

```python
nums = [1, 2, 3, 4, 5, 6]

# --- List comprehension ---
squares = [n * n for n in nums]                 # -> [1, 4, 9, 16, 25, 36]
evens   = [n for n in nums if n % 2 == 0]       # filter -> [2, 4, 6]

# if/else goes BEFORE the for (it's part of the expression, not a filter)
labels  = ["even" if n % 2 == 0 else "odd" for n in nums]

# Equivalent normal loop (how to convert in your head):
evens = []
for n in nums:
    if n % 2 == 0:
        evens.append(n)

# Nested — loops read left-to-right, same order as nested for-loops
pairs = [(x, y) for x in range(2) for y in range(3)]
# -> [(0,0),(0,1),(0,2),(1,0),(1,1),(1,2)]
matrix = [[1, 2], [3, 4]]
flat = [v for row in matrix for v in row]       # -> [1, 2, 3, 4]
grid = [[0] * 3 for _ in range(2)]              # 2x3 grid of zeros
transposed = [list(col) for col in zip(*matrix)]  # -> [[1, 3], [2, 4]]

# --- Dict comprehension ---   {KEY: VALUE for ITEM in ITERABLE if COND}
sq_map  = {n: n * n for n in range(4)}          # -> {0: 0, 1: 1, 2: 4, 3: 9}
lengths = {w: len(w) for w in ["hi", "hello"]}  # -> {'hi': 2, 'hello': 5}
flipped = {v: k for k, v in sq_map.items()}     # swap keys/values

# --- Set comprehension ---    {EXPRESSION for ITEM in ITERABLE}
first_letters = {w[0] for w in ["apple", "avocado", "kiwi"]}  # -> {'a', 'k'}

# --- Generator expression ---  ( ... )  lazy, no list built — great inside sum/max/any
total = sum(n * n for n in nums)                # -> 91
has_big = any(n > 5 for n in nums)              # -> True
```

> Tip: if a comprehension needs more than one `if` or gets hard to read, write a normal loop instead.

---

## 10. Functions & Lambdas

```python
def greet(name, greeting="Hello"):     # default argument
    """Docstring: what the function does."""
    return f"{greeting}, {name}!"

greet("Ana")                    # -> 'Hello, Ana!'
greet("Ana", greeting="Hi")     # keyword argument

def total(*args):               # any number of positional args -> tuple
    return sum(args)
total(1, 2, 3)                  # -> 6

def show(**kwargs):             # any number of keyword args -> dict
    for k, v in kwargs.items():
        print(k, v)

# A function without `return` returns None.

# Lambda: small anonymous function   lambda ARGS: EXPRESSION
square = lambda x: x * x
sorted(["bb", "a", "ccc"], key=lambda s: len(s))   # -> ['a', 'bb', 'ccc']

# map / filter (comprehensions are usually clearer)
list(map(str, [1, 2]))                      # -> ['1', '2']
list(filter(lambda n: n > 1, [1, 2, 3]))    # -> [2, 3]

# Recursion — always have a base case
def factorial(n):
    if n <= 1:              # base case
        return 1
    return n * factorial(n - 1)

# Memoization (cache results of expensive recursive calls)
from functools import cache
@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
fib(50)                     # -> 12586269025 (instant)

# Type hints (optional, help readability)
def add(a: int, b: int) -> int:
    return a + b
```

---

## 11. Handy Built-ins

| Function | Example | Result |
|---|---|---|
| `len(x)` | `len([1, 2])` | `2` |
| `sum / min / max` | `max([3, 7], key=abs)` | `7` |
| `sorted(x, key=, reverse=)` | `sorted("cba")` | `['a','b','c']` |
| `reversed(x)` | `list(reversed([1, 2]))` | `[2, 1]` |
| `enumerate(x, start=0)` | `list(enumerate("ab"))` | `[(0,'a'),(1,'b')]` |
| `zip(a, b)` | `list(zip([1, 2], "ab"))` | `[(1,'a'),(2,'b')]` |
| `range(start, stop, step)` | `list(range(3))` | `[0, 1, 2]` |
| `any / all` | `all([True, 1, "x"])` | `True` |
| `divmod(a, b)` | `divmod(17, 5)` | `(3, 2)` |
| `abs / round / pow` | `pow(2, 10, 1000)` | `24` (2¹⁰ mod 1000) |
| `int(s, base)` | `int("1010", 2)` | `10` |
| `bin / hex` | `bin(10)` | `'0b1010'` |
| `isinstance(x, T)` | `isinstance(3, int)` | `True` |

---

## 12. `collections` & Other Useful Modules

```python
from collections import Counter, defaultdict, deque, namedtuple

# Counter — count things
c = Counter("banana")            # -> Counter({'a': 3, 'n': 2, 'b': 1})
c["a"]                           # -> 3
c["z"]                           # -> 0  (no KeyError)
c.most_common(2)                 # -> [('a', 3), ('n', 2)]
Counter("listen") == Counter("silent")   # anagram check -> True

# defaultdict — dict with automatic default for new keys
graph = defaultdict(list)
graph["a"].append("b")           # no need to create the list first
count = defaultdict(int)
count["x"] += 1

# namedtuple — tuple with field names
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2);  p.x            # -> 1

import math
math.sqrt(16), math.floor(2.7), math.ceil(2.1), math.gcd(12, 18), math.inf
math.isqrt(17)                   # -> 4  integer square root

import itertools
list(itertools.permutations([1, 2, 3], 2))   # ordered pairs
list(itertools.combinations([1, 2, 3], 2))   # -> [(1,2),(1,3),(2,3)]
list(itertools.product([0, 1], repeat=2))    # -> [(0,0),(0,1),(1,0),(1,1)]
list(itertools.accumulate([1, 2, 3]))        # -> [1, 3, 6] running sum

import random
random.randint(1, 6), random.choice([1, 2, 3]), random.shuffle(nums)

import bisect                    # binary search on a SORTED list
a = [1, 3, 5, 7]
bisect.bisect_left(a, 5)         # -> 2  index where 5 is / would go
bisect.insort(a, 4)              # insert keeping it sorted
```

---

## 13. Stacks, Queues, Heaps

```python
# Stack (LIFO) — use a list
stack = []
stack.append(1)        # push
stack.append(2)
stack.pop()            # -> 2
stack[-1]              # peek -> 1
not stack              # is empty?

# Queue (FIFO) — use deque (list.pop(0) is slow)
from collections import deque
q = deque()
q.append(1)            # enqueue (right)
q.append(2)
q.popleft()            # dequeue (left) -> 1
q.appendleft(0)        # add to front
dq = deque(maxlen=3)   # keeps only the last 3 items

# Heap / priority queue — smallest item always at index 0
import heapq
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
heapq.heappop(h)       # -> 1   (smallest)
h[0]                   # peek smallest -> 3
heapq.heapify(nums)    # turn a list into a heap in place
heapq.nlargest(2, [5, 1, 9, 3])    # -> [9, 5]
heapq.nsmallest(2, [5, 1, 9, 3])   # -> [1, 3]
# Max-heap trick: push negatives
heapq.heappush(h, -10); -heapq.heappop(h)   # -> 10
# Priority with data: push tuples (priority, item)
heapq.heappush(h, (2, "task"))
```

---

## 14. Classes (basics)

```python
class Dog:
    species = "canine"                 # class attribute (shared)

    def __init__(self, name, age):     # constructor
        self.name = name               # instance attributes
        self.age = age

    def bark(self):                    # method — first param is always self
        return f"{self.name} says woof"

    def __repr__(self):                # how it prints
        return f"Dog({self.name!r}, {self.age})"

d = Dog("Rex", 3)
d.bark()                # -> 'Rex says woof'

class Puppy(Dog):       # inheritance
    def bark(self):
        return super().bark() + " (tiny)"

# Dataclass — less boilerplate
from dataclasses import dataclass
@dataclass
class Point:
    x: int
    y: int = 0
Point(1)                # -> Point(x=1, y=0)

# Linked list / tree node (common in exercises)
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next
```

---

## 15. Errors & Files

```python
try:
    n = int("abc")
except ValueError as e:
    print("Not a number:", e)
except (KeyError, IndexError):
    print("lookup failed")
else:
    print("no error happened")
finally:
    print("always runs")

raise ValueError("bad input")       # throw your own error
assert n > 0, "n must be positive"  # quick sanity check

# Files — `with` closes the file automatically
with open("data.txt") as f:
    for line in f:
        print(line.strip())
with open("out.txt", "w") as f:     # "w" overwrite, "a" append
    f.write("hello\n")
```

---

## 16. Problem-Solving Patterns (templates)

```python
# --- Track best so far ---
best = float("-inf")
for x in nums:
    best = max(best, x)

# --- Frequency count ---
from collections import Counter
freq = Counter(nums)

# --- "Have I seen this?"  (Two Sum) ---
def two_sum(nums, target):
    seen = {}                          # value -> index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i

# --- Two pointers (sorted list, or both ends of a string) ---
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# --- Sliding window (fixed size k) ---
def max_window_sum(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)
    return best

# --- Sliding window (variable size): longest substring without repeats ---
def longest_unique(s):
    seen, left, best = set(), 0, 0
    for right, ch in enumerate(s):
        while ch in seen:
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)
    return best

# --- Prefix sums (fast range sums) ---
prefix = [0]
for n in nums:
    prefix.append(prefix[-1] + n)
# sum of nums[i:j] == prefix[j] - prefix[i]

# --- Binary search (sorted list) ---
def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# --- Grid neighbours (up, down, left, right) ---
DIRS = [(-1, 0), (1, 0), (0, -1), (0, 1)]
def neighbours(r, c, rows, cols):
    for dr, dc in DIRS:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols:
            yield nr, nc

# --- BFS (shortest path in unweighted graph / grid) ---
from collections import deque
def bfs(graph, start):
    visited = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in visited:
                visited.add(nxt)
                q.append(nxt)
    return visited

# --- DFS (recursive) ---
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for nxt in graph[node]:
        if nxt not in visited:
            dfs(graph, nxt, visited)
    return visited

# --- Stack: balanced brackets ---
def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
```

**Which tool when?**

| If the problem says… | Reach for… |
|---|---|
| "count", "most frequent", "anagram" | `Counter` / dict |
| "unique", "duplicate", "seen before" | `set` |
| "pair that sums to", "complement" | dict of seen values |
| "sorted array", "find position" | two pointers / binary search |
| "subarray / substring of length k", "longest/shortest window" | sliding window |
| "sum of range" many times | prefix sums |
| "matching brackets", "undo", "most recent" | stack (list) |
| "shortest path", "level by level" | BFS with `deque` |
| "all paths", "connected regions" | DFS / recursion |
| "k largest / smallest", "always take the cheapest next" | `heapq` |
| "all combinations / orderings" | `itertools` or backtracking |

---

## 17. Big-O of Common Operations

| Operation | list | dict / set |
|---|---|---|
| index `a[i]` / lookup `d[k]` | O(1) | O(1) |
| `x in ...` | **O(n)** | **O(1)** |
| append / add | O(1) | O(1) |
| `pop()` from end | O(1) | — |
| `pop(0)` / `insert(0, x)` | **O(n)** (use `deque`) | — |
| sort | O(n log n) | — |

---

## 18. Common Beginner Mistakes

```python
# 1. Shared inner lists
bad  = [[0] * 3] * 2           # both rows are the SAME list
good = [[0] * 3 for _ in range(2)]

# 2. Mutable default argument
def add_item(x, items=[]):     # the same list is reused across calls!
    ...
def add_item(x, items=None):   # correct
    if items is None:
        items = []

# 3. sort() returns None
nums = nums.sort()             # nums is now None!
nums.sort()                    # or: nums = sorted(nums)

# 4. Modifying a list while looping over it
for x in nums:
    if x < 0:
        nums.remove(x)         # skips items
nums = [x for x in nums if x >= 0]   # correct

# 5. Off-by-one: range(n) stops at n-1, slices exclude the stop index

# 6. Integer vs float division: 7 / 2 == 3.5, 7 // 2 == 3

# 7. Copying: b = a makes an alias, not a copy
b = a[:]                       # shallow copy (list)
import copy; b = copy.deepcopy(a)   # nested lists

# 8. `=` assigns, `==` compares;  use `is None`, not `== None`

# 9. input() always returns a string — convert with int()/float()
```
